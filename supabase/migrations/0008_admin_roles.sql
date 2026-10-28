-- What each admin may change (see README → "Admins and what they may change"). Run once in the Supabase SQL editor, after
-- 0007_event_signups.sql.
--
-- A full admin can do everything, including managing admins (the panel's Admins page). Anyone else only gets
-- the areas ticked for them: content sections of the panel, the Event list, event sign-ups, applications, project
-- pitches. The database enforces it, so it holds even outside the panel. Everyone who is an admin when this runs
-- becomes a full admin.

alter table public.admins
  add column full_access boolean not null default false,
  add column areas text[] not null default '{}';

update public.admins set full_access = true;

-- The areas, and for content sections the parts of the saved content they edit (top-level keys of the "tr" /
-- "en" rows, and of the "site" row). Mirrors `sections` in src/admin/sections.tsx: change both together.
create table public.admin_areas (
  id text primary key,
  content_keys text[] not null default '{}',
  site_keys text[] not null default '{}'
);

insert into public.admin_areas (id, content_keys, site_keys) values
  ('club', '{club}', '{club,discordHref}'),
  ('hero', '{hero,tapeExtras}', '{}'),
  ('about', '{about,stats}', '{}'),
  ('areas', '{areas}', '{}'),
  ('projects', '{projects}', '{}'),
  ('project-page', '{projectPage}', '{}'),
  ('events', '{events}', '{}'),
  ('team', '{team}', '{}'),
  ('sponsors', '{sponsors}', '{showSponsors,sponsorship,sponsors}'),
  ('join', '{join,socialFloat,footer}', '{}'),
  ('pages', '{soon,notFound}', '{}'),
  ('labels', '{nav,common,switcher}', '{}'),
  -- not content: the Event list (events and their photos), and the personal data
  ('event-list', '{}', '{}'),
  ('signups', '{}', '{}'),
  ('applications', '{}', '{}'),
  ('pitches', '{}', '{}');

alter table public.admin_areas enable row level security;
grant select on public.admin_areas to authenticated;
create policy "Admins can read the areas" on public.admin_areas for select to authenticated using (true);

create function public.is_full_admin() returns boolean
  language sql stable security definer set search_path = ''
  as $$ select exists (select 1 from public.admins where user_id = auth.uid() and full_access) $$;

-- Whether the signed-in user may work in an area (full admins may everywhere).
create function public.admin_can(p_area text) returns boolean
  language sql stable security definer set search_path = ''
  as $$ select exists (select 1 from public.admins where user_id = auth.uid() and (full_access or p_area = any(areas))) $$;

-- Uploaded files: event photos belong to the Event list, sponsor logos to Sponsors, anything else to full admins.
create function public.admin_can_asset(p_name text) returns boolean
  language sql stable security definer set search_path = ''
  as $$
  select case
    when p_name like 'events/%' then public.admin_can('event-list')
    when p_name like 'sponsors/%' then public.admin_can('sponsors')
    else public.is_full_admin()
  end
  $$;

-- Content: an admin who isn't full may only change the parts of a row their sections edit. The panel saves the
-- whole row, keeping everything else as it was; a save that changes anything else is refused. (Without a
-- signed-in user, i.e. the SQL editor, nothing is checked.)
create function public.content_guard() returns trigger
  language plpgsql security definer set search_path = ''
  as $$
declare
  allowed text[];
  old_data jsonb := case when tg_op = 'UPDATE' then old.data else '{}' end;
  k text;
begin
  if auth.uid() is null or public.is_full_admin() then
    return new;
  end if;
  -- The panel's upsert onto an existing row fires this as an INSERT first; the UPDATE that follows is checked
  -- against the row as it was.
  if tg_op = 'INSERT' and exists (select 1 from public.content where key = new.key) then
    return new;
  end if;
  select coalesce(array_agg(distinct key), '{}') into allowed
    from public.admins a
    cross join unnest(a.areas) as area(id)
    join public.admin_areas aa on aa.id = area.id
    cross join unnest(case when new.key = 'site' then aa.site_keys else aa.content_keys end) as key
    where a.user_id = auth.uid();
  for k in select jsonb_object_keys(old_data) union select jsonb_object_keys(new.data) loop
    if (old_data -> k) is distinct from (new.data -> k) and not (k = any(allowed)) then
      raise exception 'Not allowed to change "%" in "%"', k, new.key using errcode = '42501';
    end if;
  end loop;
  return new;
end
$$;

create trigger content_guard before insert or update on public.content
  for each row execute function public.content_guard();

-- Events, sign-ups, applications, pitches and uploads: the area instead of "any admin".
drop policy "Admins can add events" on public.events;
drop policy "Admins can change events" on public.events;
drop policy "Admins can delete events" on public.events;
create policy "Event list admins can add events" on public.events
  for insert to authenticated with check (public.admin_can('event-list'));
create policy "Event list admins can change events" on public.events
  for update to authenticated using (public.admin_can('event-list')) with check (public.admin_can('event-list'));
create policy "Event list admins can delete events" on public.events
  for delete to authenticated using (public.admin_can('event-list'));

drop policy "Admins can read sign-ups" on public.event_signups;
drop policy "Admins can move sign-ups" on public.event_signups;
drop policy "Admins can delete sign-ups" on public.event_signups;
create policy "Sign-up admins can read sign-ups" on public.event_signups
  for select to authenticated using (public.admin_can('signups'));
create policy "Sign-up admins can move sign-ups" on public.event_signups
  for update to authenticated using (public.admin_can('signups')) with check (public.admin_can('signups'));
create policy "Sign-up admins can delete sign-ups" on public.event_signups
  for delete to authenticated using (public.admin_can('signups'));

drop policy "Admins can read applications" on public.applications;
drop policy "Admins can delete applications" on public.applications;
create policy "Application admins can read applications" on public.applications
  for select to authenticated using (public.admin_can('applications'));
create policy "Application admins can delete applications" on public.applications
  for delete to authenticated using (public.admin_can('applications'));

drop policy "Admins can read pitches" on public.project_pitches;
drop policy "Admins can delete pitches" on public.project_pitches;
create policy "Pitch admins can read pitches" on public.project_pitches
  for select to authenticated using (public.admin_can('pitches'));
create policy "Pitch admins can delete pitches" on public.project_pitches
  for delete to authenticated using (public.admin_can('pitches'));

drop policy "Admins can upload site assets" on storage.objects;
drop policy "Admins can replace site assets" on storage.objects;
drop policy "Admins can delete site assets" on storage.objects;
drop policy "Admins can see site assets" on storage.objects;
create policy "Admins can upload their site assets" on storage.objects
  for insert to authenticated with check (bucket_id = 'site-assets' and public.admin_can_asset(name));
create policy "Admins can replace their site assets" on storage.objects
  for update to authenticated using (bucket_id = 'site-assets' and public.admin_can_asset(name));
create policy "Admins can delete their site assets" on storage.objects
  for delete to authenticated using (bucket_id = 'site-assets' and public.admin_can_asset(name));
create policy "Admins can see their site assets" on storage.objects
  for select to authenticated using (bucket_id = 'site-assets' and public.admin_can_asset(name));

-- The Admins page (full admins only): list, add or change, remove. New people are invited from the Supabase
-- dashboard first (Authentication → Users → Invite user); then they're added here by email.
create function public.admin_list() returns table (user_id uuid, email text, full_access boolean, areas text[], added_at timestamptz)
  language plpgsql stable security definer set search_path = ''
  as $$
begin
  if not public.is_full_admin() then
    raise exception 'Only full admins can manage admins' using errcode = '42501';
  end if;
  return query
    select a.user_id, u.email::text, a.full_access, a.areas, a.added_at
    from public.admins a join auth.users u on u.id = a.user_id
    order by a.added_at;
end
$$;

-- Adds the account with this email as an admin, or changes what it may do. Errors: 404 no such account
-- (invite it first), 422 an unknown area, 409 it would leave no full admin.
create function public.admin_save(p_email text, p_full_access boolean, p_areas text[]) returns void
  language plpgsql security definer set search_path = ''
  as $$
declare
  target uuid;
  clean text[] := array(select distinct a from unnest(coalesce(p_areas, '{}')) a order by a);
begin
  if not public.is_full_admin() then
    raise exception 'Only full admins can manage admins' using errcode = '42501';
  end if;
  select id into target from auth.users where lower(email) = lower(btrim(p_email));
  if target is null then
    raise exception 'No account with this email: invite it in the Supabase dashboard first' using errcode = 'PT404';
  end if;
  if exists (select 1 from unnest(clean) a where a not in (select id from public.admin_areas)) then
    raise exception 'Unknown area' using errcode = 'PT422';
  end if;
  -- Locks the admins, so two full admins demoting each other at once can't leave none.
  lock table public.admins in share row exclusive mode;
  if not p_full_access and not exists (select 1 from public.admins where full_access and user_id <> target) then
    raise exception 'Keep at least one full admin' using errcode = 'PT409';
  end if;
  insert into public.admins (user_id, full_access, areas) values (target, p_full_access, clean)
    on conflict (user_id) do update set full_access = excluded.full_access, areas = excluded.areas;
end
$$;

create function public.admin_remove(p_user_id uuid) returns void
  language plpgsql security definer set search_path = ''
  as $$
begin
  if not public.is_full_admin() then
    raise exception 'Only full admins can manage admins' using errcode = '42501';
  end if;
  lock table public.admins in share row exclusive mode;
  if not exists (select 1 from public.admins where full_access and user_id <> p_user_id) then
    raise exception 'Keep at least one full admin' using errcode = 'PT409';
  end if;
  delete from public.admins where user_id = p_user_id;
end
$$;

revoke execute on function public.admin_list(), public.admin_save(text, boolean, text[]), public.admin_remove(uuid) from public, anon;
grant execute on function public.admin_list(), public.admin_save(text, boolean, text[]), public.admin_remove(uuid) to authenticated;
grant execute on function public.admin_can(text), public.is_full_admin() to authenticated;
