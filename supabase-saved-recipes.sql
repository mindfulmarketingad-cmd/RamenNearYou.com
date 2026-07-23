-- Run this in your Supabase SQL editor (Database > SQL Editor)

create table if not exists saved_recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_slug text not null,
  created_at timestamptz default now(),
  unique(user_id, recipe_slug)
);

alter table saved_recipes enable row level security;

create policy "Users can view their own recipe saves"
  on saved_recipes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recipe saves"
  on saved_recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own recipe saves"
  on saved_recipes for delete
  using (auth.uid() = user_id);
