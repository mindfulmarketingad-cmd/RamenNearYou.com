-- Run this in Supabase SQL Editor to enable featured listing analytics

create table if not exists listing_analytics (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references featured_listings(id) on delete cascade,
  event_type  text not null check (event_type in ('view', 'click')),
  created_at  timestamptz not null default now()
);

-- Index for fast per-listing queries
create index if not exists listing_analytics_listing_id_idx on listing_analytics (listing_id, created_at);

-- Only service_role can insert/read (API uses admin client)
alter table listing_analytics enable row level security;
create policy "service role full access" on listing_analytics
  using (true) with check (true);
