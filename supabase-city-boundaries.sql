-- City boundary polygon cache.
-- Boundaries are fetched once from OpenStreetMap/Nominatim and stored here so we
-- never re-hit the geocoder for the same city. Writes happen via the service-role
-- key (bypasses RLS); reads are public so the searchmap can render the outline.
create table if not exists public.city_boundaries (
  key          text primary key,           -- "{citySlug}:{stateSlug}" (lowercased)
  geojson      jsonb not null,             -- Polygon / MultiPolygon geometry
  bbox         jsonb,                       -- [south, west, north, east] for fitBounds
  display_name text,                        -- Nominatim display name (debugging)
  created_at   timestamptz not null default now()
);

alter table public.city_boundaries enable row level security;

drop policy if exists "city_boundaries public read" on public.city_boundaries;
create policy "city_boundaries public read"
  on public.city_boundaries
  for select
  using (true);
