-- Run this in the Supabase SQL Editor to enable thumbs up / down on
-- restaurant pages.
--
-- One row per (user, restaurant). Changing your mind updates the existing
-- row rather than adding another, so the tallies can't be inflated by
-- clicking repeatedly. Votes require a logged-in account for the same
-- reason.

create table if not exists restaurant_votes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  restaurant_slug text not null,
  -- 1 = thumbs up, -1 = thumbs down. No other values are meaningful.
  vote            smallint not null check (vote in (1, -1)),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, restaurant_slug)
);

-- Tally lookups are always "all votes for one slug".
create index if not exists restaurant_votes_slug_idx
  on restaurant_votes (restaurant_slug);

alter table restaurant_votes enable row level security;

-- Anyone may read the tallies — the counts are public on every listing page.
drop policy if exists "votes are publicly readable" on restaurant_votes;
create policy "votes are publicly readable"
  on restaurant_votes for select
  using (true);

-- You may only write your own vote.
drop policy if exists "users manage their own vote" on restaurant_votes;
create policy "users manage their own vote"
  on restaurant_votes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Returns { up, down } for a batch of slugs in one round trip, so a feed of
-- 20 cards doesn't need 20 queries.
create or replace function restaurant_vote_tallies(slugs text[])
returns table (restaurant_slug text, up bigint, down bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    v.restaurant_slug,
    count(*) filter (where v.vote = 1)  as up,
    count(*) filter (where v.vote = -1) as down
  from restaurant_votes v
  where v.restaurant_slug = any(slugs)
  group by v.restaurant_slug
$$;

grant execute on function restaurant_vote_tallies(text[]) to anon, authenticated;
