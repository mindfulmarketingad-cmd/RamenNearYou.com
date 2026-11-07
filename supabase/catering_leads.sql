-- ============================================================
-- catering_leads — stores every catering inquiry from the site
-- Run this once in the Supabase SQL Editor.
-- ============================================================

create table if not exists catering_leads (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- Lead status (update manually or via admin panel)
  status         text not null default 'new'
                   check (status in ('new', 'contacted', 'quoted', 'booked', 'lost')),

  -- Contact
  name           text not null,
  email          text not null,
  phone          text,

  -- Location
  city           text,
  state          text,
  location       text,          -- full "City, ST" string for display

  -- Event details
  event_type     text,
  event_date     date,
  event_time     text,          -- e.g. "Morning (8am–12pm)"

  -- Scale
  guest_count    text,          -- e.g. "51–100"
  budget         text,          -- e.g. "$15–$25 / person"

  -- Preferences
  dietary_needs  text,          -- comma-separated selections

  -- Free text
  notes          text,

  -- Attribution
  source         text default 'hero_quiz'  -- 'hero_quiz' | 'catering_page'
);

-- Index for dashboard queries (newest first)
create index if not exists catering_leads_created_at_idx
  on catering_leads (created_at desc);

-- Index to filter by status
create index if not exists catering_leads_status_idx
  on catering_leads (status, created_at desc);

-- RLS: enable but only allow service_role (server-side API inserts bypass RLS anyway)
alter table catering_leads enable row level security;

-- No public read/write — all access goes through the server API with the service role key
-- To view leads: use the Supabase dashboard or a server-side admin query
