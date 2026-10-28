-- Each event's own page (/etkinlikler/<id>-<title>/): a longer write-up and photos from the event. Run once in
-- the Supabase SQL editor, after 0005_events.sql.

-- Photos are files in the site-assets bucket (0001_admin.sql), uploaded in the panel's Event list: a list of
-- {"src", "thumb", "w", "h"}, where src and thumb are paths like events/12/1730000000000-ab12.webp (the
-- full-size photo and its small version for the grid) and w × h is the full size. At most 100 per event.
create function public.event_photos_valid(photos jsonb) returns boolean
  language sql immutable set search_path = ''
  as $$
  select jsonb_typeof(photos) = 'array' and jsonb_array_length(photos) <= 100 and not exists (
    select 1 from jsonb_array_elements(photos) p
    where jsonb_typeof(p) <> 'object'
       or coalesce(p ->> 'src', '') !~ '^events/[0-9]+/[A-Za-z0-9_-]+\.(webp|jpg)$'
       or coalesce(p ->> 'thumb', '') !~ '^events/[0-9]+/[A-Za-z0-9_-]+\.(webp|jpg)$'
       or jsonb_typeof(p -> 'w') is distinct from 'number'
       or jsonb_typeof(p -> 'h') is distinct from 'number'
  )
  $$;

alter table public.events
  -- Several paragraphs (blank lines between them) for the event's page; empty: its short description instead.
  add column details_tr text not null default '' check (length(details_tr) <= 10000),
  add column details_en text not null default '' check (length(details_en) <= 10000),
  add column photos jsonb not null default '[]' check (public.event_photos_valid(photos));

grant select (details_tr, details_en, photos) on public.events to anon;
grant insert (details_tr, details_en, photos), update (details_tr, details_en, photos) on public.events to authenticated;
