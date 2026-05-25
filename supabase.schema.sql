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
