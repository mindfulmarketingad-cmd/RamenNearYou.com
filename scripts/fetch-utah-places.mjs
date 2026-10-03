/**
 * Fetches ramen restaurant data from Google Places Text Search API for
 * additional Utah cities and merges them into lib/places-major-cities.json.
 *
 * Run: GOOGLE_PLACES_API_KEY=<key> node scripts/fetch-utah-places.mjs
 * Resume-safe: skips cities already present in the output, DB, or capitals.
 */

import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_FILE = join(ROOT, 'lib', 'places-major-cities.json')
const RESTAURANTS_FILE = join(ROOT, 'lib', 'restaurants.json')
const CAPITALS_FILE = join(ROOT, 'lib', 'places-capital-supplements.json')

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error('GOOGLE_PLACES_API_KEY is not set')
  process.exit(1)
}

function slugify(str) {
  return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Additional Utah cities to cover (beyond the 10 already fetched + DB cities).
const UTAH_CITIES = [
  'Lehi', 'South Jordan', 'Millcreek', 'Murray', 'Draper', 'Bountiful',
  'Riverton', 'Herriman', 'Spanish Fork', 'Pleasant Grove', 'Logan',
  'American Fork', 'Tooele', 'Cedar City', 'Cottonwood Heights', 'Holladay',
  'Midvale', 'Kaysville', 'Clearfield', 'Roy', 'Saratoga Springs', 'Lindon',
  'Farmington', 'Syracuse', 'North Salt Lake', 'Brigham City', 'Payson',
  'Highland', 'Vineyard', 'Park City',
].map(city => ({ city, stateCode: 'UT', state: 'Utah' }))

async function fetchPlaces(city) {
  const query = encodeURIComponent(`ramen restaurants in ${city.city}, ${city.state}`)
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=restaurant&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${city.city}`)
  const json = await res.json()
  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API error for ${city.city}: ${json.status} — ${json.error_message ?? ''}`)
  }
  return (json.results ?? [])
    // Keep Utah results only — avoids pulling in a nearby out-of-state match.
    .filter(r => /,\s*UT\b/.test(r.formatted_address ?? ''))
    .slice(0, 20)
    .map(r => ({
      placeId: r.place_id,
      name: r.name,
      address: r.formatted_address,
      rating: r.rating ?? null,
      reviewCount: r.user_ratings_total ?? 0,
      priceLevel: r.price_level ?? null,
      // Photo intentionally omitted — the Place Photo endpoint is billed per
      // fetch, so we serve a local placeholder instead of live Google photos.
      photo: null,
      latitude: r.geometry?.location?.lat ?? null,
      longitude: r.geometry?.location?.lng ?? null,
      openNow: r.opening_hours?.open_now ?? null,
      googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
    }))
}

async function main() {
  const restaurants = JSON.parse(readFileSync(RESTAURANTS_FILE, 'utf8'))
  const dbParams = new Set(
    restaurants.map(r => `${slugify(r.citySlug ?? r.city)}-${(r.stateCode ?? '').toLowerCase()}`)
  )

  let capitalsData = {}
  try { capitalsData = JSON.parse(readFileSync(CAPITALS_FILE, 'utf8')) } catch {}
  const capitalParams = new Set(Object.keys(capitalsData))

  let existing = {}
  try { existing = JSON.parse(readFileSync(OUT_FILE, 'utf8')) } catch {}
  const results = { ...existing }

  let fetched = 0, skipped = 0, errors = 0
  for (const city of UTAH_CITIES) {
    const param = `${slugify(city.city)}-${city.stateCode.toLowerCase()}`
    if (dbParams.has(param) || capitalParams.has(param) || param in results) {
      console.log(`  SKIP ${city.city} (${param})`)
      skipped++
      continue
    }
    try {
      console.log(`  Fetching ${city.city}, ${city.stateCode} (${param})...`)
      const places = await fetchPlaces(city)
      results[param] = places
      console.log(`    → ${places.length} results`)
      fetched++
      await new Promise(r => setTimeout(r, 300))
    } catch (err) {
      console.error(`    ERROR: ${err.message}`)
      results[param] = []
      errors++
    }
  }

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2))
  console.log(`\nDone. Fetched: ${fetched}, Skipped: ${skipped}, Errors: ${errors}`)
  console.log(`Total params in output: ${Object.keys(results).length}`)
}

main().catch(err => { console.error(err); process.exit(1) })
