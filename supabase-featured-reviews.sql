-- ─── Featured Listings ───────────────────────────────────────────────────────

create table if not exists public.featured_listings (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid references auth.users(id) on delete cascade not null,
  restaurant_name       text not null,
  restaurant_slug       text,
  city                  text not null,
  state_code            text not null,
  address               text not null,
  phone                 text,
  website               text,
  description           text,
  photos                text[] default '{}',
  stripe_customer_id    text,
  stripe_subscription_id text,
  status                text not null default 'pending',  -- pending | active | cancelled
  featured_order        int default 0,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

alter table public.featured_listings enable row level security;

create policy "Public reads active featured listings"
  on public.featured_listings for select
  using (status = 'active');

create policy "Owners read own featured listings"
  on public.featured_listings for select
  using (auth.uid() = user_id);

create policy "Auth users insert featured listings"
  on public.featured_listings for insert
  with check (auth.uid() = user_id);

create policy "Owners update own featured listings"
  on public.featured_listings for update
  using (auth.uid() = user_id);

-- ─── Reviews ─────────────────────────────────────────────────────────────────

create table if not exists public.reviews (
  id                uuid default gen_random_uuid() primary key,
  restaurant_slug   text not null,
  user_id           uuid references auth.users(id) on delete cascade not null,
  user_display_name text,
  rating            int not null check (rating between 1 and 5),
  body              text,
  photos            text[] default '{}',
  created_at        timestamptz default now()
);

alter table public.reviews enable row level security;

create policy "Public reads reviews"
  on public.reviews for select
  using (true);

create policy "Auth users insert reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Owners delete own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- ─── Storage buckets (run in Supabase dashboard Storage section) ─────────────
-- Create a public bucket called: restaurant-photos
-- Or run this SQL:
-- insert into storage.buckets (id, name, public) values ('restaurant-photos', 'restaurant-photos', true);
-- create policy "Public read restaurant photos" on storage.objects for select using (bucket_id = 'restaurant-photos');
-- create policy "Auth upload restaurant photos" on storage.objects for insert with check (bucket_id = 'restaurant-photos' and auth.role() = 'authenticated');
