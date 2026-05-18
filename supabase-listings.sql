-- Run this in your Supabase SQL editor to create / update the listings table

create table if not exists listings (
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

alter table listings enable row level security;

-- Anyone can insert (no account required)
create policy "Anyone can submit a listing"
  on listings for insert
  with check (true);

-- Only the submitting user can view their own
create policy "Users can view their own listings"
  on listings for select
  using (auth.uid() = user_id);
