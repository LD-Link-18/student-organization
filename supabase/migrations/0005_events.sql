-- Club events, with real dates: the site sorts them, shows the upcoming ones on the homepage and every event,
-- past and future, on /etkinlikler/ (see README → "Events"). Edited on the panel's "Event list" page, where
-- each change is saved at once. Run once in the Supabase SQL editor, after 0004_project_pitches.sql.

create table public.events (
  id bigint generated always as identity primary key,
  starts_on date not null,
  -- Last day of a multi-day event; empty for a one-day event.
  ends_on date,
  title_tr text not null check (length(btrim(title_tr)) between 1 and 120),
  title_en text not null check (length(btrim(title_en)) between 1 and 120),
  category_tr text not null check (length(btrim(category_tr)) between 1 and 40),
  category_en text not null check (length(btrim(category_en)) between 1 and 40),
  place_tr text not null check (length(btrim(place_tr)) between 1 and 80),
  place_en text not null check (length(btrim(place_en)) between 1 and 80),
  description_tr text not null check (length(btrim(description_tr)) between 1 and 1000),
  description_en text not null check (length(btrim(description_en)) between 1 and 1000),
  -- Off: the RSVP button is shown disabled.
  rsvp_open boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by text,
  constraint events_dates check (ends_on is null or ends_on >= starts_on)
);

create index events_starts_on on public.events (starts_on);

-- Same time and author stamp as the content rows (0001_admin.sql).
create trigger events_stamp before insert or update on public.events
  for each row execute function public.content_stamp();

alter table public.events enable row level security;

-- Visitors read everything but who saved it (an admin's email); only admins add, change and delete.
revoke all on public.events from anon, authenticated;
grant select (id, starts_on, ends_on, title_tr, title_en, category_tr, category_en, place_tr, place_en,
  description_tr, description_en, rsvp_open) on public.events to anon;
grant select on public.events to authenticated;
grant insert (starts_on, ends_on, title_tr, title_en, category_tr, category_en, place_tr, place_en,
  description_tr, description_en, rsvp_open),
  update (starts_on, ends_on, title_tr, title_en, category_tr, category_en, place_tr, place_en,
  description_tr, description_en, rsvp_open)
  on public.events to authenticated;
grant delete on public.events to authenticated;

create policy "Anyone can read events" on public.events
  for select using (true);
create policy "Admins can add events" on public.events
  for insert to authenticated with check (public.is_admin());
create policy "Admins can change events" on public.events
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete events" on public.events
  for delete to authenticated using (public.is_admin());

-- The one event the site listed before this table existed.
insert into public.events (starts_on, ends_on, title_tr, title_en, category_tr, category_en, place_tr, place_en,
  description_tr, description_en)
values ('2026-10-20', '2026-10-22', 'Stant Haftası', 'Booth Week', 'Stant', 'Booth', 'Umuttepe', 'Umuttepe',
  'Üç gün boyunca stantımızdayız. Projelerimizi yakından görmek, kulübü tanımak ve aklındaki her şeyi sormak için yanımıza uğramayı unutma!',
  'We''re at our booth for three days. See our projects up close, get to know the club and ask us anything. Don''t forget to stop by!');
