-- ════════════════════════════════════════════════════════════════════════════
-- RAMEN PASS — Subscription + Contribution Rewards System
-- Run this in the Supabase SQL Editor.
-- Adapted to this codebase: the profile table is `user_profiles` (PK user_id),
-- and reviews/restaurants are keyed by slug (text), so reference_id is text.
-- ════════════════════════════════════════════════════════════════════════════

-- ─── ramen_pass_subscriptions ───────────────────────────────────────────────
create table if not exists public.ramen_pass_subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid references auth.users(id) on delete cascade not null,
  stripe_customer_id     text not null,
  stripe_subscription_id text not null,
  status                 text not null default 'active',  -- active | canceled | past_due | trialing
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

create unique index if not exists ramen_pass_subscriptions_user_idx
  on public.ramen_pass_subscriptions (user_id);
create index if not exists ramen_pass_subscriptions_sub_idx
  on public.ramen_pass_subscriptions (stripe_subscription_id);

alter table public.ramen_pass_subscriptions enable row level security;

create policy "Owners read own ramen pass"
  on public.ramen_pass_subscriptions for select
  using (auth.uid() = user_id);

-- ─── contribution_rewards ────────────────────────────────────────────────────
create table if not exists public.contribution_rewards (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete cascade not null,
  type           text not null,
  -- review_with_photo | review_only | checkin | add_restaurant
  -- update_info | first_review_bonus | referral | profile_complete
  amount         numeric(5,2) not null,
  status         text not null default 'pending',  -- pending | approved | rejected | applied
  reference_id   text,
  billing_period text not null,  -- YYYY-MM
  approved_at    timestamptz,
  created_at     timestamptz default now()
);

create index if not exists contribution_rewards_user_idx
  on public.contribution_rewards (user_id);
create index if not exists contribution_rewards_period_idx
  on public.contribution_rewards (billing_period);
create index if not exists contribution_rewards_status_idx
  on public.contribution_rewards (status);

alter table public.contribution_rewards enable row level security;

create policy "Owners read own rewards"
  on public.contribution_rewards for select
  using (auth.uid() = user_id);

-- ─── monthly_credit_summary ──────────────────────────────────────────────────
create table if not exists public.monthly_credit_summary (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid references auth.users(id) on delete cascade not null,
  billing_period        text not null,  -- YYYY-MM
  total_earned          numeric(5,2) default 0,
  cap_reached           boolean default false,
  applied_to_invoice    boolean default false,
  stripe_credit_applied boolean default false,
  created_at            timestamptz default now(),
  unique(user_id, billing_period)
);

create index if not exists monthly_credit_summary_period_idx
  on public.monthly_credit_summary (billing_period);

alter table public.monthly_credit_summary enable row level security;

create policy "Owners read own credit summary"
  on public.monthly_credit_summary for select
  using (auth.uid() = user_id);

-- ─── referrals ───────────────────────────────────────────────────────────────
create table if not exists public.referrals (
  id                uuid primary key default gen_random_uuid(),
  referrer_user_id  uuid references auth.users(id),
  referred_user_id  uuid references auth.users(id),
  referral_code     text not null,
  reward_issued     boolean default false,
  created_at        timestamptz default now()
);

create index if not exists referrals_referrer_idx on public.referrals (referrer_user_id);
create index if not exists referrals_referred_idx on public.referrals (referred_user_id);
create index if not exists referrals_code_idx on public.referrals (referral_code);

alter table public.referrals enable row level security;

create policy "Users read own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_user_id or auth.uid() = referred_user_id);

-- ─── check_ins (24h cooldown enforcement) ────────────────────────────────────
create table if not exists public.ramen_pass_checkins (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  restaurant_slug text not null,
  method          text not null,  -- qr | geo
  created_at      timestamptz default now()
);

create index if not exists ramen_pass_checkins_user_slug_idx
  on public.ramen_pass_checkins (user_id, restaurant_slug, created_at);

alter table public.ramen_pass_checkins enable row level security;

create policy "Owners read own checkins"
  on public.ramen_pass_checkins for select
  using (auth.uid() = user_id);

-- ─── user_profiles additions ─────────────────────────────────────────────────
-- (this codebase uses user_profiles, not "profiles")
alter table public.user_profiles add column if not exists ramen_rank text default 'Noobie';
alter table public.user_profiles add column if not exists total_contributions integer default 0;
alter table public.user_profiles add column if not exists referral_code text unique;
alter table public.user_profiles add column if not exists profile_reward_claimed boolean default false;
