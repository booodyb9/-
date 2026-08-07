-- Remove legacy public write access from the public media bucket.
-- Public downloads remain available because the bucket itself is public.
-- Upload/update/delete/list operations stay protected by the existing admin policies.

drop policy if exists "Allow public uploads to media bucket" on storage.objects;
drop policy if exists "Allow public deletes from media bucket" on storage.objects;
