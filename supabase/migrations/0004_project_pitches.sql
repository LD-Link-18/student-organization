-- Project ideas from the form at /proje-oner/ (see README → "Project pitches"). Run once in the Supabase SQL
-- editor, after 0003_applications.sql.
--
-- Same rules as applications: anyone can send one; only admins can read and delete. The checks repeat the
-- form's own (public/proje-oner/script.js), since anyone can also post here without the form.

create table public.project_pitches (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  title text not null check (length(title) between 3 and 120),
  description text not null check (length(description) between 30 and 4000),
  name text not null check (length(name) between 2 and 120),
  email text not null check (length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  -- Optional: not everyone pitching is a student here.
  student_no text check (student_no ~ '^[0-9]{9}$'),
  -- Which form (TR or EN page) it came from.
  lang text not null default 'tr' check (lang in ('tr', 'en')),
  -- The KVKK notice checkbox: no pitch without it.
  consent boolean not null check (consent),
  -- Hash of the sender's IP, only for the rate limit below. Not readable through the API, even by admins.
  ip_hash text
);

create index project_pitches_created_at on public.project_pitches (created_at desc);
create index project_pitches_ip_recent on public.project_pitches (ip_hash, created_at);

-- Tidies the input, stamps the time, and turns away floods: at most 10 pitches per IP in 10 minutes and 100
-- in total per hour (far more than real use; the overall cap is what keeps a script from filling the
-- database). SQLSTATE PT429 makes the API answer 429 Too Many Requests.
create function public.pitch_accept() returns trigger
  language plpgsql security definer set search_path = ''
  as $$
declare
  headers json := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::json;
  ip text := coalesce(headers ->> 'cf-connecting-ip', split_part(headers ->> 'x-forwarded-for', ',', 1), '');
begin
  new.created_at := now();
  new.title := btrim(new.title);
  new.description := btrim(new.description);
  new.name := btrim(new.name);
  new.email := lower(btrim(new.email));
  new.student_no := nullif(btrim(new.student_no), '');
  new.ip_hash := encode(sha256(convert_to(ip, 'UTF8')), 'hex');

  if (select count(*) from public.project_pitches
      where ip_hash = new.ip_hash and created_at > now() - interval '10 minutes') >= 10
     or (select count(*) from public.project_pitches where created_at > now() - interval '1 hour') >= 100 then
    raise exception 'Too many pitches, try again later' using errcode = 'PT429';
  end if;
  return new;
end
$$;

create trigger pitch_accept before insert on public.project_pitches
  for each row execute function public.pitch_accept();

alter table public.project_pitches enable row level security;

-- Column by column, so a sender can't set the time or the hash, and admins never see the hash.
revoke all on public.project_pitches from anon, authenticated;
grant insert (title, description, name, email, student_no, lang, consent)
  on public.project_pitches to anon, authenticated;
grant select (id, created_at, title, description, name, email, student_no, lang)
  on public.project_pitches to authenticated;
grant delete on public.project_pitches to authenticated;

create policy "Anyone can pitch a project" on public.project_pitches
  for insert to anon, authenticated with check (true);
create policy "Admins can read pitches" on public.project_pitches
  for select to authenticated using (public.is_admin());
create policy "Admins can delete pitches" on public.project_pitches
  for delete to authenticated using (public.is_admin());
