-- ============================================================================
-- Restaurant submission ("Add your restaurant" / Claim Your Listing) table.
-- Run this in the Supabase SQL editor:
--   Dashboard → SQL Editor → New query → paste → Run
-- Safe to run multiple times (idempotent).
-- Project: https://ucqlkhhjoriakjyeogbx.supabase.co
-- ============================================================================

create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  zip text,
  phone text,
  website text,
  description text,
  broth_types text[],
  hours text,
  owner_name text,
  owner_email text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Backfill any columns that might be missing from an older version of the table.
alter table public.listings add column if not exists owner_name  text;
alter table public.listings add column if not exists owner_email text;
alter table public.listings add column if not exists broth_types text[];
alter table public.listings add column if not exists hours       text;
alter table public.listings add column if not exists status      text not null default 'pending';
alter table public.listings add column if not exists created_at  timestamptz default now();

alter table public.listings enable row level security;

-- Anyone can submit a listing (no account required) — this is what lets the
-- public "Add your restaurant" form write rows with the anon key.
drop policy if exists "Anyone can submit a listing" on public.listings;
create policy "Anyone can submit a listing"
  on public.listings for insert
  with check (true);

-- Submitting users can view their own submissions.
drop policy if exists "Users can view their own listings" on public.listings;
create policy "Users can view their own listings"
  on public.listings for select
  using (auth.uid() = user_id);

-- Quick check that anon/authenticated can write (RLS still applies).
grant insert on public.listings to anon, authenticated;
grant select on public.listings to authenticated;
