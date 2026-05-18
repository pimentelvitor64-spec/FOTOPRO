-- Fotopro MVP - execute este arquivo no SQL Editor do Supabase.
create extension if not exists "pgcrypto";

create table if not exists public.photographer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  studio_name text not null default '',
  phone text,
  website text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  photographer_id uuid not null references public.photographer_profiles(id) on delete cascade,
  title text not null,
  description text,
  client_name text,
  client_email text,
  share_token text not null unique default replace(gen_random_uuid()::text, '-', ''),
  included_photo_limit integer not null default 0,
  extra_photo_price_cents integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  photographer_id uuid not null references public.photographer_profiles(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  original_filename text,
  created_at timestamptz not null default now()
);

create table if not exists public.photo_selections (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references public.photos(id) on delete cascade,
  gallery_id uuid not null references public.galleries(id) on delete cascade,
  client_name text not null,
  client_email text not null,
  selected_at timestamptz not null default now(),
  unique (photo_id, client_email)
);

alter table public.photographer_profiles enable row level security;
alter table public.galleries enable row level security;
alter table public.photos enable row level security;
alter table public.photo_selections enable row level security;

drop policy if exists "Photographers manage own profile" on public.photographer_profiles;
drop policy if exists "Photographers manage own galleries" on public.galleries;
drop policy if exists "Published galleries are visible by private token" on public.galleries;
drop policy if exists "Photographers manage own photos" on public.photos;
drop policy if exists "Photos visible in published galleries" on public.photos;
drop policy if exists "Photographers read selections for own galleries" on public.photo_selections;
drop policy if exists "Public read selections in published galleries" on public.photo_selections;
drop policy if exists "Clients create selections in published galleries" on public.photo_selections;
drop policy if exists "Clients update their previous selections" on public.photo_selections;
drop policy if exists "Photographers upload own gallery photos" on storage.objects;
drop policy if exists "Photographers update own gallery photos" on storage.objects;
drop policy if exists "Photographers delete own gallery photos" on storage.objects;
drop policy if exists "Public read gallery photos" on storage.objects;

create policy "Photographers manage own profile" on public.photographer_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Photographers manage own galleries" on public.galleries
  for all using (auth.uid() = photographer_id) with check (auth.uid() = photographer_id);

create policy "Published galleries are visible by private token" on public.galleries
  for select using (is_published = true);

create policy "Photographers manage own photos" on public.photos
  for all using (auth.uid() = photographer_id) with check (auth.uid() = photographer_id);

create policy "Photos visible in published galleries" on public.photos
  for select using (
    exists (
      select 1 from public.galleries g
      where g.id = photos.gallery_id and g.is_published = true
    )
  );

create policy "Photographers read selections for own galleries" on public.photo_selections
  for select using (
    exists (
      select 1 from public.galleries g
      where g.id = photo_selections.gallery_id and g.photographer_id = auth.uid()
    )
  );

create policy "Public read selections in published galleries" on public.photo_selections
  for select using (
    exists (
      select 1 from public.galleries g
      where g.id = photo_selections.gallery_id and g.is_published = true
    )
  );

create policy "Clients create selections in published galleries" on public.photo_selections
  for insert with check (
    exists (
      select 1 from public.galleries g
      where g.id = photo_selections.gallery_id and g.is_published = true
    )
  );

create policy "Clients update their previous selections" on public.photo_selections
  for update using (
    exists (
      select 1 from public.galleries g
      where g.id = photo_selections.gallery_id and g.is_published = true
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.photographer_profiles (id, full_name, studio_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'studio_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into storage.buckets (id, name, public)
values ('gallery-photos', 'gallery-photos', true)
on conflict (id) do update set public = true;

create policy "Photographers upload own gallery photos" on storage.objects
  for insert with check (
    bucket_id = 'gallery-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Photographers update own gallery photos" on storage.objects
  for update using (
    bucket_id = 'gallery-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Photographers delete own gallery photos" on storage.objects
  for delete using (
    bucket_id = 'gallery-photos' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Public read gallery photos" on storage.objects
  for select using (bucket_id = 'gallery-photos');
