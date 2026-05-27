create table if not exists public.clinics (
  id text primary key,
  title text not null,
  image_url text not null default '',
  sessions jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.clinics enable row level security;

create policy "Public can read clinics"
on public.clinics
for select
to anon
using (true);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  clinic_id text not null,
  clinic_title text not null,
  session_id text not null,
  session_date text not null,
  session_location text not null,
  name text not null,
  email text not null,
  phone text not null,
  country text not null default '',
  sailing_level text not null default '',
  message text not null default '',
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;
