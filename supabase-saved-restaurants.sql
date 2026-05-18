-- Run this in your Supabase SQL editor (Database > SQL Editor)

create table if not exists saved_restaurants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  restaurant_slug text not null,
  created_at timestamptz default now(),
  unique(user_id, restaurant_slug)
);

alter table saved_restaurants enable row level security;

create policy "Users can view their own saves"
  on saved_restaurants for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saves"
  on saved_restaurants for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saves"
  on saved_restaurants for delete
  using (auth.uid() = user_id);
