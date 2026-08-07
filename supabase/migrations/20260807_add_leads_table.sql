create table if not exists public.leads (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (char_length(phone) between 5 and 30),
  service text check (service is null or char_length(service) <= 120),
  message text check (message is null or char_length(message) <= 4000),
  calc_area numeric check (calc_area is null or calc_area >= 0),
  calc_type text check (calc_type is null or char_length(calc_type) <= 120),
  calc_price numeric check (calc_price is null or calc_price >= 0),
  source text not null default 'website' check (char_length(source) <= 80),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists leads_public_insert on public.leads;
create policy leads_public_insert on public.leads
for insert to public
with check (
  char_length(name) between 1 and 120
  and char_length(phone) between 5 and 30
  and (service is null or char_length(service) <= 120)
  and (message is null or char_length(message) <= 4000)
  and source = 'website'
);

drop policy if exists leads_admin_read on public.leads;
create policy leads_admin_read on public.leads
for select to public
using (exists (select 1 from public.admins where admins.user_id = (select auth.uid())));

drop policy if exists leads_admin_update on public.leads;
create policy leads_admin_update on public.leads
for update to public
using (exists (select 1 from public.admins where admins.user_id = (select auth.uid())))
with check (exists (select 1 from public.admins where admins.user_id = (select auth.uid())));

drop policy if exists leads_admin_delete on public.leads;
create policy leads_admin_delete on public.leads
for delete to public
using (exists (select 1 from public.admins where admins.user_id = (select auth.uid())));

create index if not exists leads_created_at_idx on public.leads(created_at desc);
