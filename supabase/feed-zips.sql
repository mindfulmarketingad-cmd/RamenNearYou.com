-- Run this in the Supabase SQL Editor to enable the personal /feed page.
--
-- One row per ZIP a member follows. The feed itself isn't stored: it's
-- computed per request as "every ramen shop in these ZIPs", ranked by rating
-- then review count then slug. So the only thing that needs a table is the
-- list of ZIPs.

create table if not exists feed_zips (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  -- US 5-digit ZIP. Stored as text so leading zeros survive (e.g. 02139).
  zip        text not null check (zip ~ '^[0-9]{5}$'),
  -- Denormalised for the chip label, so rendering the list doesn't need a
  -- lookup against the restaurant dataset.
  label      text,
  created_at timestamptz not null default now(),
  unique (user_id, zip)
);

create index if not exists feed_zips_user_idx on feed_zips (user_id, created_at desc);

alter table feed_zips enable row level security;

-- A member's followed ZIPs are their own business — no public read.
drop policy if exists "users manage their own feed zips" on feed_zips;
create policy "users manage their own feed zips"
  on feed_zips for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
