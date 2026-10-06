-- Run this in the Supabase SQL Editor (project ucqlkhhjoriakjyeogbx).
--
-- RamenNearYou is now a static site (no server or API routes), so analytics
-- events are inserted straight from the browser with the anon key instead of
-- through the old /api/analytics/track route and its service-role client —
-- the same setup pumpkinpatchesnearme.com uses. The table already allows
-- public SELECT (ramennearyou_dashboard.sql); this adds public INSERT.
--
-- The CHECK constraint on event_type is the only server-side guardrail on
-- what gets written, so treat the table as untrusted, append-only analytics,
-- not a source of truth for anything billed. If abuse becomes a problem,
-- move inserts behind a Supabase Edge Function that rate-limits.

drop policy if exists "public insert analytics" on public.ramennearyou_dashboard;
create policy "public insert analytics"
  on public.ramennearyou_dashboard
  for insert
  to anon, authenticated
  with check (true);
