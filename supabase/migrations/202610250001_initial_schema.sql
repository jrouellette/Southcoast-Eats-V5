-- Southcoast Eats V5: initial schema foundation.
-- Creates the data structure only; does not import real listings.

create extension if not exists pgcrypto;

create type public.restaurant_status as enum ('draft', 'published', 'closed');
create type public.review_status as enum ('pending', 'approved', 'rejected');

create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  description text,
  cuisine_types text[] not null default '{}',
  price_level smallint check (price_level between 1 and 4),
  website_url text,
  phone text,
  status public.restaurant_status not null default 'draft',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.restaurant_locations (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  label text,
  address_line_1 text,
  address_line_2 text,
  locality text,
  region text,
  postal_code text,
  country_code text not null default 'US',
  latitude double precision,
  longitude double precision,
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_locations_latitude_check check (latitude is null or latitude between -90 and 90),
  constraint restaurant_locations_longitude_check check (longitude is null or longitude between -180 and 180)
);

create index restaurant_locations_restaurant_id_idx on public.restaurant_locations(restaurant_id);
create index restaurant_locations_geo_idx on public.restaurant_locations(latitude, longitude);

create table public.restaurant_photos (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  image_url text not null,
  alt_text text,
  credit text,
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create index restaurant_photos_restaurant_id_idx on public.restaurant_photos(restaurant_id, sort_order);

create table public.restaurant_provider_ids (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  provider text not null,
  provider_place_id text not null,
  provider_url text,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_place_id)
);

create index restaurant_provider_ids_restaurant_id_idx on public.restaurant_provider_ids(restaurant_id);

create table public.restaurant_field_sources (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  field_name text not null,
  source_type text not null check (source_type in ('provider', 'manual', 'owner', 'other')),
  source_name text,
  source_record_id text,
  observed_value jsonb,
  is_current boolean not null default true,
  observed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index restaurant_field_sources_lookup_idx
  on public.restaurant_field_sources(restaurant_id, field_name, is_current);

create table public.restaurant_review_queue (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references public.restaurants(id) on delete cascade,
  review_status public.review_status not null default 'pending',
  reason text not null,
  proposed_changes jsonb not null default '{}'::jsonb,
  source_name text,
  source_record_id text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_notes text
);

create index restaurant_review_queue_status_idx
  on public.restaurant_review_queue(review_status, created_at);

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, restaurant_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger restaurants_set_updated_at
before update on public.restaurants
for each row execute function public.set_updated_at();

create trigger restaurant_locations_set_updated_at
before update on public.restaurant_locations
for each row execute function public.set_updated_at();

alter table public.restaurants enable row level security;
alter table public.restaurant_locations enable row level security;
alter table public.restaurant_photos enable row level security;
alter table public.restaurant_provider_ids enable row level security;
alter table public.restaurant_field_sources enable row level security;
alter table public.restaurant_review_queue enable row level security;
alter table public.favorites enable row level security;

create policy "Anyone can read published restaurants"
on public.restaurants for select
using (status = 'published');

create policy "Anyone can read locations for published restaurants"
on public.restaurant_locations for select
using (exists (
  select 1 from public.restaurants r
  where r.id = restaurant_id and r.status = 'published'
));

create policy "Anyone can read photos for published restaurants"
on public.restaurant_photos for select
using (exists (
  select 1 from public.restaurants r
  where r.id = restaurant_id and r.status = 'published'
));

create policy "Users can read their own favorites"
on public.favorites for select to authenticated
using (auth.uid() = user_id);

create policy "Users can add their own favorites"
on public.favorites for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can remove their own favorites"
on public.favorites for delete to authenticated
using (auth.uid() = user_id);
