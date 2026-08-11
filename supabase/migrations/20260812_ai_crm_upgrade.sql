-- Riyadh Glass AI + CRM additive migration
-- Safe to re-run. No destructive operations.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  service text,
  source text not null default 'other',
  source_context jsonb not null default '{}'::jsonb,
  message text,
  notes text,
  status text not null default 'new',
  score integer not null default 0,
  temperature text not null default 'cold',
  calc_area numeric,
  calc_type text,
  calc_price numeric,
  assigned_admin uuid,
  follow_up_at timestamptz,
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads add column if not exists name text;
alter table public.leads add column if not exists phone text;
alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists service text;
alter table public.leads add column if not exists source text default 'other';
alter table public.leads add column if not exists source_context jsonb default '{}'::jsonb;
alter table public.leads add column if not exists message text;
alter table public.leads add column if not exists notes text;
alter table public.leads add column if not exists status text default 'new';
alter table public.leads add column if not exists score integer default 0;
alter table public.leads add column if not exists temperature text default 'cold';
alter table public.leads add column if not exists calc_area numeric;
alter table public.leads add column if not exists calc_type text;
alter table public.leads add column if not exists calc_price numeric;
alter table public.leads add column if not exists assigned_admin uuid;
alter table public.leads add column if not exists follow_up_at timestamptz;
alter table public.leads add column if not exists last_activity_at timestamptz default now();
alter table public.leads add column if not exists created_at timestamptz default now();
alter table public.leads add column if not exists updated_at timestamptz default now();

do $$ begin
  alter table public.leads add constraint leads_status_check check (status in ('new','contacted','interested','quote_sent','won','lost','closed'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.leads add constraint leads_temperature_check check (temperature in ('hot','warm','cold'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.leads add constraint leads_score_check check (score between 0 and 100);
exception when duplicate_object then null; end $$;

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_source_idx on public.leads(source);
create index if not exists leads_score_idx on public.leads(score desc);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);
create index if not exists lead_activities_lead_created_idx on public.lead_activities(lead_id, created_at desc);

create table if not exists public.admin_activity (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid,
  action text not null,
  entity_type text,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists admin_activity_created_idx on public.admin_activity(created_at desc);

-- Preserve the existing messages table and extend it when present.
do $$ begin
  if to_regclass('public.messages') is not null then
    alter table public.messages add column if not exists phone text;
    alter table public.messages add column if not exists service text;
    alter table public.messages add column if not exists status text default 'new';
    alter table public.messages add column if not exists archived_at timestamptz;
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at before update on public.leads
for each row execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.lead_activities enable row level security;
alter table public.admin_activity enable row level security;

-- Public visitors may create a lead, but cannot read/update/delete leads.
drop policy if exists "public can create leads" on public.leads;
create policy "public can create leads" on public.leads
for insert to anon, authenticated
with check (coalesce(length(trim(phone)), 0) > 0 or coalesce(length(trim(email)), 0) > 0);

-- Existing admins table is the source of admin authorization.
drop policy if exists "admins can manage leads" on public.leads;
create policy "admins can manage leads" on public.leads
for all to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins can manage lead activities" on public.lead_activities;
create policy "admins can manage lead activities" on public.lead_activities
for all to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

drop policy if exists "admins can manage admin activity" on public.admin_activity;
create policy "admins can manage admin activity" on public.admin_activity
for all to authenticated
using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));
