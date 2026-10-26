-- Admin panel storage (see README → "Admin panel"). Run once in the Supabase SQL editor.
--
-- content          one row per language ("tr", "en") plus "site" (links, sponsors): the edits made in
--                  /admin/, laid over the defaults in src/content/ by the site at load time.
-- content_history  every saved version, for "who changed what" and restoring an older one.
-- admins           who may edit. A user who can sign in but isn't listed here can't change anything.

create table public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  added_at timestamptz not null default now()
);

create table public.content (
  key text primary key check (key in ('tr', 'en', 'site')),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table public.content_history (
  id bigint generated always as identity primary key,
  key text not null,
  data jsonb not null,
  saved_at timestamptz not null,
  saved_by text
);

create index content_history_saved_at on public.content_history (saved_at desc);

create function public.is_admin() returns boolean
  language sql stable security definer set search_path = ''
  as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- Stamps each save with time and author.
create function public.content_stamp() returns trigger
  language plpgsql set search_path = ''
  as $$
begin
  new.updated_at := now();
  new.updated_by := auth.jwt() ->> 'email';
  return new;
end
$$;

-- Keeps a copy of each saved version. An AFTER trigger, so an upsert that hits an existing row
-- (which fires both BEFORE INSERT and BEFORE UPDATE) is recorded once.
create function public.content_record() returns trigger
  language plpgsql security definer set search_path = ''
  as $$
begin
  insert into public.content_history (key, data, saved_at, saved_by)
    values (new.key, new.data, new.updated_at, new.updated_by);
  return null;
end
$$;

create trigger content_stamp before insert or update on public.content
  for each row execute function public.content_stamp();
create trigger content_record after insert or update on public.content
  for each row execute function public.content_record();

alter table public.admins enable row level security;
alter table public.content enable row level security;
alter table public.content_history enable row level security;

grant select on public.content to anon, authenticated;
grant insert, update on public.content to authenticated;
grant select on public.content_history to authenticated;
grant select on public.admins to authenticated;

create policy "Anyone can read the site content" on public.content
  for select using (true);
create policy "Admins can add content" on public.content
  for insert to authenticated with check (public.is_admin());
create policy "Admins can change content" on public.content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can read the history" on public.content_history
  for select to authenticated using (public.is_admin());
create policy "Users can see whether they are an admin" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- Sponsor logos and other images uploaded in the panel: public to read, admins to write.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('site-assets', 'site-assets', true, 2097152, array['image/svg+xml', 'image/png', 'image/jpeg', 'image/webp'])
  on conflict (id) do nothing;

create policy "Admins can upload site assets" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-assets' and public.is_admin());
create policy "Admins can replace site assets" on storage.objects
  for update to authenticated using (bucket_id = 'site-assets' and public.is_admin());
create policy "Admins can delete site assets" on storage.objects
  for delete to authenticated using (bucket_id = 'site-assets' and public.is_admin());
