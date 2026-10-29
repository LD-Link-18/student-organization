-- Membership applications from the form at /basvuru/ (see README → "Applications"). Run once in the Supabase
-- SQL editor, after 0002_hardening.sql.
--
-- Anyone can send an application; nobody but an admin can read, and only admins can delete. The checks
-- repeat the form's own (public/basvuru/script.js), since anyone can also post here without the form.

create table public.applications (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  email text not null check (length(email) <= 254 and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  first_name text not null check (length(first_name) between 2 and 80),
  last_name text not null check (length(last_name) between 2 and 80),
  student_no text not null check (student_no ~ '^[0-9]{9}$'),
  -- Turkish mobile number without +90 / 0: 5XXXXXXXXX
  phone text not null check (phone ~ '^5[0-9]{9}$'),
  department text not null check (length(department) between 2 and 120),
  grade text not null check (grade in ('Hazırlık', '1. Sınıf', '2. Sınıf', '3. Sınıf', '4. Sınıf')),
  -- Which form (TR or EN page) it came from.
  lang text not null default 'tr' check (lang in ('tr', 'en')),
  -- The KVKK notice checkbox: no application without it.
  consent boolean not null check (consent),
  -- Hash of the sender's IP, only for the rate limit below. Not readable through the API, even by admins.
  ip_hash text
);

create index applications_created_at on public.applications (created_at desc);
create index applications_ip_recent on public.applications (ip_hash, created_at);

-- Tidies the input, stamps the time, and turns away floods: at most 30 applications per IP in 10 minutes
-- (generous, as a booth laptop or the campus network sends many from one address) and 300 in total per
-- hour. Raising the numbers is safe; the overall cap is what keeps a script from filling the database.
-- SQLSTATE PT429 makes the API answer 429 Too Many Requests.
create function public.application_accept() returns trigger
  language plpgsql security definer set search_path = ''
  as $$
declare
  headers json := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::json;
  ip text := coalesce(headers ->> 'cf-connecting-ip', split_part(headers ->> 'x-forwarded-for', ',', 1), '');
begin
  new.created_at := now();
  new.email := lower(btrim(new.email));
  new.first_name := btrim(new.first_name);
  new.last_name := btrim(new.last_name);
  new.ip_hash := encode(sha256(convert_to(ip, 'UTF8')), 'hex');

  if (select count(*) from public.applications
      where ip_hash = new.ip_hash and created_at > now() - interval '10 minutes') >= 30
     or (select count(*) from public.applications where created_at > now() - interval '1 hour') >= 300 then
    raise exception 'Too many applications, try again later' using errcode = 'PT429';
  end if;
  return new;
end
$$;

create trigger application_accept before insert on public.applications
  for each row execute function public.application_accept();

alter table public.applications enable row level security;

-- Column by column, so a sender can't set the time or the hash, and admins never see the hash.
revoke all on public.applications from anon, authenticated;
grant insert (email, first_name, last_name, student_no, phone, department, grade, lang, consent)
  on public.applications to anon, authenticated;
grant select (id, created_at, email, first_name, last_name, student_no, phone, department, grade, lang)
  on public.applications to authenticated;
grant delete on public.applications to authenticated;

create policy "Anyone can apply" on public.applications
  for insert to anon, authenticated with check (true);
create policy "Admins can read applications" on public.applications
  for select to authenticated using (public.is_admin());
create policy "Admins can delete applications" on public.applications
  for delete to authenticated using (public.is_admin());
