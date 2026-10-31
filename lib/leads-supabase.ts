// SERVER-ONLY. Shared `leads` table this Supabase project already uses to
// collect leads across multiple directory sites (construction/remodeling,
// event rentals, etc.) — this is NOT a dedicated table for RamenNearYou, so
// inquiries here are mapped onto its existing generic columns rather than
// adding restaurant-specific ones. Relevant columns (see
// app/api/inquire/route.ts for the exact mapping):
//
//   name, phone, email, city            — customer + restaurant city
//   event_type, event_date, guest_count — repurposed as reservation type/
//                                          date/party size (all loosely-
//                                          typed text columns already used
//                                          for the event-rental vertical)
//   best_time_to_call                   — repurposed as requested arrival time
//   message                             — restaurant name + any customer notes
//   source                              — 'ramennearyou.com' so this
//                                          directory's leads are filterable
//                                          alongside the other sites
//   page_url                            — the page the inquiry was sent from
//
// Everything vertical-specific to the other directories (project_type,
// job_category, chair_count, concessions, etc.) is left null. `id`,
// `created_at`, and `status` are NOT NULL but already have column defaults
// (used successfully by the other directories), so they're omitted here too.
//
// The publishable key is safe to embed (equivalent to an anon key, gated by
// RLS, not secrecy); env vars can override it per-environment if needed.
import { createClient } from '@supabase/supabase-js'

const LEADS_SUPABASE_URL = process.env.LEADS_SUPABASE_URL ?? 'https://tbqigevoksabizjogvtm.supabase.co'
const LEADS_SUPABASE_KEY = process.env.LEADS_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_aHlx0Tdu2rhOTBUp3lhkQw_Lv6Awz7a'

export function createLeadsClient() {
  return createClient(LEADS_SUPABASE_URL, LEADS_SUPABASE_KEY, { auth: { persistSession: false } })
}
