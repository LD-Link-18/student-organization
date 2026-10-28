-- Sign-up forms per event (see README → "Event sign-ups"). Run once in the Supabase SQL editor, after
-- 0006_event_pages.sql.
--
-- Each event has a form (built in the panel's Event list): name, email and KVKK consent always, student number
-- and phone when switched on, and its own questions. Visitors sign up only through sign_up_for_event(), which
-- checks everything, puts them on the list or (when the event is full) the waitlist, and says which. Only
-- admins read the list, move people between it and the waitlist, and delete sign-ups.

-- The form: {"ask_student_no": bool, "ask_phone": bool, "questions": [question, …]}, at most 30 questions.
-- A question: {"id", "type", "label_tr", "label_en", "required", "options"}; type is text (one line),
-- textarea, one (pick one), many (pick several) or yesno (a checkbox). Options (only for one and many, 2 to
-- 30): {"id", "tr", "en"}. Ids are short and never change, so renaming a question or an option keeps the
-- answers given before.
create function public.event_form_valid(form jsonb) returns boolean
  language sql immutable set search_path = ''
  as $$
  -- coalesce: a missing key makes the test NULL, which a CHECK would let through.
  select coalesce(jsonb_typeof(form) = 'object'
    and jsonb_typeof(form -> 'ask_student_no') = 'boolean'
    and jsonb_typeof(form -> 'ask_phone') = 'boolean'
    and jsonb_typeof(form -> 'questions') = 'array'
    and jsonb_array_length(form -> 'questions') <= 30
    and (select count(distinct q ->> 'id') = count(*) from jsonb_array_elements(form -> 'questions') q)
    and not exists (
      select 1 from jsonb_array_elements(form -> 'questions') q
      where jsonb_typeof(q) <> 'object'
         or coalesce(q ->> 'id', '') !~ '^[a-z0-9]{1,16}$'
         or coalesce(q ->> 'type', '') not in ('text', 'textarea', 'one', 'many', 'yesno')
         or length(btrim(coalesce(q ->> 'label_tr', ''))) not between 1 and 300
         or length(btrim(coalesce(q ->> 'label_en', ''))) not between 1 and 300
         or jsonb_typeof(q -> 'required') is distinct from 'boolean'
         or (q ->> 'type' in ('one', 'many') and (
              jsonb_typeof(q -> 'options') is distinct from 'array'
              or jsonb_array_length(q -> 'options') not between 2 and 30
              or (select count(distinct o ->> 'id') <> count(*) from jsonb_array_elements(q -> 'options') o)
              or exists (
                select 1 from jsonb_array_elements(q -> 'options') o
                where coalesce(o ->> 'id', '') !~ '^[a-z0-9]{1,16}$'
                   or length(btrim(coalesce(o ->> 'tr', ''))) not between 1 and 120
                   or length(btrim(coalesce(o ->> 'en', ''))) not between 1 and 120)))
    ), false)
  $$;

alter table public.events
  add column form jsonb not null default '{"ask_student_no": false, "ask_phone": false, "questions": []}'
    check (public.event_form_valid(form)),
  -- Places on the list; empty: no limit. Beyond it, sign-ups go on the waitlist.
  add column capacity integer check (capacity between 1 and 10000);

grant select (form, capacity) on public.events to anon;
grant insert (form, capacity), update (form, capacity) on public.events to authenticated;

create table public.event_signups (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events on delete cascade,
  created_at timestamptz not null default now(),
  -- confirmed: has a place; waitlist: in line for one (admins move people up).
  status text not null check (status in ('confirmed', 'waitlist')),
  name text not null check (length(name) between 2 and 120),
  email text not null check (length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  student_no text check (student_no ~ '^[0-9]{9}$'),
  phone text check (phone ~ '^5[0-9]{9}$'),
  -- {question id: answer}: text, a list of option ids (pick several), an option id (pick one) or true/false.
  answers jsonb not null default '{}' check (jsonb_typeof(answers) = 'object' and octet_length(answers::text) <= 50000),
  consent boolean not null check (consent),
  -- Hash of the sender's IP, only for the rate limit. Not readable through the API, even by admins.
  ip_hash text,
  unique (event_id, email)
);

create index event_signups_event on public.event_signups (event_id, created_at);
create index event_signups_ip_recent on public.event_signups (ip_hash, created_at);

alter table public.event_signups enable row level security;
revoke all on public.event_signups from anon, authenticated;
grant select (id, event_id, created_at, status, name, email, student_no, phone, answers) on public.event_signups to authenticated;
grant update (status), delete on public.event_signups to authenticated;
create policy "Admins can read sign-ups" on public.event_signups
  for select to authenticated using (public.is_admin());
create policy "Admins can move sign-ups" on public.event_signups
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete sign-ups" on public.event_signups
  for delete to authenticated using (public.is_admin());

-- Places left on an event's list, for its page: null when there's no limit, 0 when full (waitlist only).
create function public.event_places_left(p_event_id bigint) returns integer
  language sql stable security definer set search_path = ''
  as $$
  select case when e.capacity is null then null
    else greatest(e.capacity - (select count(*) from public.event_signups s where s.event_id = e.id and s.status = 'confirmed'), 0)::integer end
  from public.events e where e.id = p_event_id
  $$;

-- The only way to sign up. Answers 'confirmed' or 'waitlist'. Errors the form tells apart by HTTP status:
-- 410 sign-ups closed (switched off, event over, or no such event), 409 this email already signed up,
-- 422 an answer that doesn't fit the form, 429 too many sign-ups at once (30 per IP in 10 minutes, 500 in total
-- per hour). Names, emails and the like are checked by the table's rules (400).
create function public.sign_up_for_event(
  p_event_id bigint, p_name text, p_email text, p_student_no text, p_phone text, p_answers jsonb, p_consent boolean
) returns text
  language plpgsql security definer set search_path = ''
  as $$
declare
  headers json := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::json;
  v_ip_hash text := encode(sha256(convert_to(
    coalesce(headers ->> 'cf-connecting-ip', split_part(headers ->> 'x-forwarded-for', ',', 1), ''), 'UTF8')), 'hex');
  e public.events;
  v_q jsonb;
  v_a jsonb;
  v_answers jsonb := coalesce(p_answers, '{}');
  result text;
begin
  -- Locks the event, so two people can't take its last place at the same moment.
  select * into e from public.events where id = p_event_id for update;
  if not found or not e.rsvp_open or coalesce(e.ends_on, e.starts_on) < (now() at time zone 'Europe/Istanbul')::date then
    raise exception 'Sign-ups for this event are closed' using errcode = 'PT410';
  end if;

  if (select count(*) from public.event_signups where ip_hash = v_ip_hash and created_at > now() - interval '10 minutes') >= 30
     or (select count(*) from public.event_signups where created_at > now() - interval '1 hour') >= 500 then
    raise exception 'Too many sign-ups, try again later' using errcode = 'PT429';
  end if;

  -- Student number and phone: required when the form asks for them, otherwise not stored.
  p_student_no := nullif(btrim(coalesce(p_student_no, '')), '');
  p_phone := nullif(regexp_replace(coalesce(p_phone, ''), '\s', '', 'g'), '');
  if (e.form ->> 'ask_student_no')::boolean then
    if p_student_no is null then raise exception 'Student number required' using errcode = 'PT422'; end if;
  else
    p_student_no := null;
  end if;
  if (e.form ->> 'ask_phone')::boolean then
    if p_phone is null then raise exception 'Phone number required' using errcode = 'PT422'; end if;
  else
    p_phone := null;
  end if;

  -- Answers: only this form's questions, each of the right kind, required ones given.
  if jsonb_typeof(v_answers) <> 'object' then
    raise exception 'Answers must be an object' using errcode = 'PT422';
  end if;
  if exists (select 1 from jsonb_object_keys(v_answers) k
             where not exists (select 1 from jsonb_array_elements(e.form -> 'questions') q where q ->> 'id' = k)) then
    raise exception 'Answer to a question this form does not have' using errcode = 'PT422';
  end if;
  for v_q in select * from jsonb_array_elements(e.form -> 'questions') loop
    v_a := v_answers -> (v_q ->> 'id');
    if v_a is null or v_a = 'null'::jsonb or v_a = '""'::jsonb or v_a = '[]'::jsonb or v_a = 'false'::jsonb then
      if (v_q ->> 'required')::boolean then
        raise exception 'Required question not answered: %', v_q ->> 'id' using errcode = 'PT422';
      end if;
      v_answers := v_answers - (v_q ->> 'id');
      continue;
    end if;
    if (v_q ->> 'type' = 'text' and (jsonb_typeof(v_a) <> 'string' or length(v_a #>> '{}') > 300))
       or (v_q ->> 'type' = 'textarea' and (jsonb_typeof(v_a) <> 'string' or length(v_a #>> '{}') > 2000))
       or (v_q ->> 'type' = 'yesno' and v_a <> 'true'::jsonb)
       or (v_q ->> 'type' = 'one' and (jsonb_typeof(v_a) <> 'string'
           or not exists (select 1 from jsonb_array_elements(v_q -> 'options') o where o ->> 'id' = v_a #>> '{}')))
       or (v_q ->> 'type' = 'many' and (jsonb_typeof(v_a) <> 'array'
           or exists (select 1 from jsonb_array_elements(v_a) x
                      where jsonb_typeof(x) <> 'string'
                         or not exists (select 1 from jsonb_array_elements(v_q -> 'options') o where o ->> 'id' = x #>> '{}'))
           or (select count(distinct x) <> count(*) from jsonb_array_elements(v_a) x))) then
      raise exception 'Answer does not fit question %', v_q ->> 'id' using errcode = 'PT422';
    end if;
  end loop;

  result := case
    when e.capacity is null
      or (select count(*) from public.event_signups where event_id = e.id and status = 'confirmed') < e.capacity
    then 'confirmed' else 'waitlist' end;

  begin
    insert into public.event_signups (event_id, status, name, email, student_no, phone, answers, consent, ip_hash)
      values (e.id, result, btrim(p_name), lower(btrim(p_email)), p_student_no, p_phone, v_answers, p_consent, v_ip_hash);
  exception when unique_violation then
    raise exception 'This email is already signed up for this event' using errcode = 'PT409';
  end;
  return result;
end
$$;

revoke execute on function public.sign_up_for_event(bigint, text, text, text, text, jsonb, boolean) from public;
grant execute on function public.sign_up_for_event(bigint, text, text, text, text, jsonb, boolean) to anon, authenticated;
grant execute on function public.event_places_left(bigint) to anon, authenticated;
