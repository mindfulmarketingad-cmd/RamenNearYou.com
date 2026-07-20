// SERVER-ONLY. Separate Supabase project used purely to capture booking-
// inquiry leads (distinct from the main site's auth/claims database in
// lib/supabase/*). Mirrors the fallback-constant pattern already used there:
// the publishable key is safe to embed (equivalent to an anon key, gated by
// RLS, not secrecy) and env vars can override it per-environment if needed.
//
// Expected schema (run once in the Supabase SQL editor for this project):
//
//   create table leads (
//     id uuid primary key default gen_random_uuid(),
//     created_at timestamptz not null default now(),
//     source text not null,               -- 'listing' | 'partners' | 'find'
//     restaurant_name text not null,
//     restaurant_slug text,
//     city text,
//     state_code text,
//     party_size int,
//     reservation_date date,
//     reservation_time text,
//     customer_name text not null,
//     customer_email text,
//     customer_phone text,
//     notes text
//   );
//
//   alter table leads enable row level security;
//
//   create policy "Anyone can submit an inquiry"
//     on leads for insert
//     to anon
//     with check (true);
//
import { createClient } from '@supabase/supabase-js'

const LEADS_SUPABASE_URL = process.env.LEADS_SUPABASE_URL ?? 'https://tbqigevoksabizjogvtm.supabase.co'
const LEADS_SUPABASE_KEY = process.env.LEADS_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_aHlx0Tdu2rhOTBUp3lhkQw_Lv6Awz7a'

export function createLeadsClient() {
  return createClient(LEADS_SUPABASE_URL, LEADS_SUPABASE_KEY, { auth: { persistSession: false } })
}
