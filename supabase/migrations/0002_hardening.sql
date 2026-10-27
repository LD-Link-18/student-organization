-- Security hardening for the admin panel. Run once in the Supabase SQL editor, after 0001_admin.sql.

-- Each saved row is a JSON object of at most 256 KB (all three rows together are ~47 KB today), so a runaway
-- save can't fill the database: every save is also copied into content_history.
alter table public.content add constraint content_data_shape
  check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 262144);

-- As in 0001, but a save that changes nothing adds no history row.
create or replace function public.content_record() returns trigger
  language plpgsql security definer set search_path = ''
  as $$
begin
  if tg_op = 'UPDATE' and new.data is not distinct from old.data then
    return null;
  end if;
  insert into public.content_history (key, data, saved_at, saved_by)
    values (new.key, new.data, new.updated_at, new.updated_by);
  return null;
end
$$;

-- Visitors read the content, not who saved it: updated_by is an admin's email.
revoke select on public.content from anon;
grant select (key, data) on public.content to anon;

-- Storage only lets an update or delete touch rows a SELECT policy shows, so without this admins couldn't
-- replace or remove an upload. Public URLs don't need it (the bucket is public); listing stays admin-only.
create policy "Admins can see site assets" on storage.objects
  for select to authenticated using (bucket_id = 'site-assets' and public.is_admin());
