-- Run this in the Supabase SQL Editor (project ucqlkhhjoriakjyeogbx).
--
-- Backs the public analytics dashboard at /dashboard. Named
-- `ramennearyou_dashboard` rather than a generic `analytics_events` because
-- this Supabase project is shared across several directory sites, each with
-- its own dashboard table.
--
-- No PII is stored here: only URL paths, event types, and ids the browser
-- generates for itself (a sessionStorage session id and a localStorage
-- visitor id). That is why public SELECT is safe — and it is required, since
-- the dashboard's live panel subscribes to this table over Supabase Realtime
-- directly from the browser using the anon key.

create table if not exists public.ramennearyou_dashboard (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  event_type   text not null check (event_type in (
                 'pageview', 'listing_view', 'call_click',
                 'directions_click', 'search', 'review_click'
               )),
  path         text,
  referrer     text,
  session_id   text,
  visitor_id   text,
  listing_slug text,
  listing_name text,
  city         text,
  query        text
);

create index if not exists ramennearyou_dashboard_created_at_idx
  on public.ramennearyou_dashboard (created_at desc);
create index if not exists ramennearyou_dashboard_event_type_idx
  on public.ramennearyou_dashboard (event_type);
create index if not exists ramennearyou_dashboard_listing_slug_idx
  on public.ramennearyou_dashboard (listing_slug);
create index if not exists ramennearyou_dashboard_path_idx
  on public.ramennearyou_dashboard (path);
create index if not exists ramennearyou_dashboard_session_id_idx
  on public.ramennearyou_dashboard (session_id);

alter table public.ramennearyou_dashboard enable row level security;

-- Public read: the dashboard is intentionally no-login, and Realtime
-- delivers rows to the browser only for tables the anon role can select.
drop policy if exists "public read analytics" on public.ramennearyou_dashboard;
create policy "public read analytics"
  on public.ramennearyou_dashboard
  for select
  using (true);

-- Writes go through the service-role key in /api/analytics/track only, so no
-- insert policy is granted to anon/authenticated.

-- Add to the realtime publication, guarded so re-running this file is safe.
do $$
begin
  if not exists (
    select 1
      from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'ramennearyou_dashboard'
  ) then
    alter publication supabase_realtime add table public.ramennearyou_dashboard;
  end if;
end
$$;
