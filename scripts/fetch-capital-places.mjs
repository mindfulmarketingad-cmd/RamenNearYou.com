/**
 * One-time script: fetches ramen restaurants from Google Places Text Search API
 * for state capitals that have no listings in our database.
 *
 * Run: node scripts/fetch-capital-places.mjs
 * Requires: GOOGLE_PLACES_API_KEY env var
 * Output: lib/places-capital-supplements.json
 */

import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_FILE = join(ROOT, 'lib', 'places-capital-supplements.json')

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error('GOOGLE_PLACES_API_KEY is not set')
  process.exit(1)
}

// Capitals with 0 DB listings (verified 2025-06)
const NEEDS_PLACES = [
  { param: 'montgomery-al',     city: 'Montgomery',     state: 'Alabama',       stateCode: 'AL', lat: 32.3617,  lng: -86.2792  },
  { param: 'juneau-ak',         city: 'Juneau',         state: 'Alaska',        stateCode: 'AK', lat: 58.3005,  lng: -134.4197 },
  { param: 'phoenix-az',        city: 'Phoenix',        state: 'Arizona',       stateCode: 'AZ', lat: 33.4484,  lng: -112.0740 },
  { param: 'hartford-ct',       city: 'Hartford',       state: 'Connecticut',   stateCode: 'CT', lat: 41.7637,  lng: -72.6851  },
  { param: 'dover-de',          city: 'Dover',          state: 'Delaware',      stateCode: 'DE', lat: 39.1582,  lng: -75.5244  },
  { param: 'tallahassee-fl',    city: 'Tallahassee',    state: 'Florida',       stateCode: 'FL', lat: 30.4518,  lng: -84.2807  },
  { param: 'honolulu-hi',       city: 'Honolulu',       state: 'Hawaii',        stateCode: 'HI', lat: 21.3069,  lng: -157.8583 },
  { param: 'boise-id',          city: 'Boise',          state: 'Idaho',         stateCode: 'ID', lat: 43.6150,  lng: -116.2023 },
  { param: 'des-moines-ia',     city: 'Des Moines',     state: 'Iowa',          stateCode: 'IA', lat: 41.5868,  lng: -93.6250  },
  { param: 'frankfort-ky',      city: 'Frankfort',      state: 'Kentucky',      stateCode: 'KY', lat: 38.2009,  lng: -84.8733  },
  { param: 'baton-rouge-la',    city: 'Baton Rouge',    state: 'Louisiana',     stateCode: 'LA', lat: 30.4515,  lng: -91.1871  },
  { param: 'augusta-me',        city: 'Augusta',        state: 'Maine',         stateCode: 'ME', lat: 44.3106,  lng: -69.7795  },
  { param: 'annapolis-md',      city: 'Annapolis',      state: 'Maryland',      stateCode: 'MD', lat: 38.9784,  lng: -76.4922  },
  { param: 'boston-ma',         city: 'Boston',         state: 'Massachusetts', stateCode: 'MA', lat: 42.3601,  lng: -71.0589  },
  { param: 'saint-paul-mn',     city: 'Saint Paul',     state: 'Minnesota',     stateCode: 'MN', lat: 44.9537,  lng: -93.0900  },
  { param: 'jackson-ms',        city: 'Jackson',        state: 'Mississippi',   stateCode: 'MS', lat: 32.2988,  lng: -90.1848  },
  { param: 'jefferson-city-mo', city: 'Jefferson City', state: 'Missouri',      stateCode: 'MO', lat: 38.5767,  lng: -92.1735  },
  { param: 'lincoln-ne',        city: 'Lincoln',        state: 'Nebraska',      stateCode: 'NE', lat: 40.8136,  lng: -96.7026  },
  { param: 'concord-nh',        city: 'Concord',        state: 'New Hampshire', stateCode: 'NH', lat: 43.2081,  lng: -71.5376  },
  { param: 'trenton-nj',        city: 'Trenton',        state: 'New Jersey',    stateCode: 'NJ', lat: 40.2171,  lng: -74.7429  },
  { param: 'santa-fe-nm',       city: 'Santa Fe',       state: 'New Mexico',    stateCode: 'NM', lat: 35.6870,  lng: -105.9378 },
  { param: 'bismarck-nd',       city: 'Bismarck',       state: 'North Dakota',  stateCode: 'ND', lat: 46.8083,  lng: -100.7837 },
  { param: 'harrisburg-pa',     city: 'Harrisburg',     state: 'Pennsylvania',  stateCode: 'PA', lat: 40.2732,  lng: -76.8867  },
  { param: 'salt-lake-city-ut', city: 'Salt Lake City', state: 'Utah',          stateCode: 'UT', lat: 40.7608,  lng: -111.8910 },
  { param: 'madison-wi',        city: 'Madison',        state: 'Wisconsin',     stateCode: 'WI', lat: 43.0731,  lng: -89.4012  },
  { param: 'cheyenne-wy',       city: 'Cheyenne',       state: 'Wyoming',       stateCode: 'WY', lat: 41.1400,  lng: -104.8202 },
]

async function fetchPlaces(city) {
  const query = encodeURIComponent(`ramen restaurants in ${city.city}, ${city.state}`)
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&type=restaurant&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${city.city}`)
  const json = await res.json()
  if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
    throw new Error(`Places API error for ${city.city}: ${json.status} — ${json.error_message ?? ''}`)
  }
  return (json.results ?? []).slice(0, 20).map(r => ({
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
  // Load existing supplements so we don't re-fetch what we already have
  let existing = {}
  try {
    existing = JSON.parse(readFileSync(OUT_FILE, 'utf8'))
    console.log(`Loaded ${Object.keys(existing).length} existing supplements`)
  } catch {
    console.log('No existing supplements file — starting fresh')
  }

  const results = { ...existing }

  for (const city of NEEDS_PLACES) {
    if (results[city.param]?.length > 0) {
      console.log(`  SKIP ${city.city} (already fetched: ${results[city.param].length} results)`)
      continue
    }
    try {
      console.log(`  Fetching ${city.city}, ${city.stateCode}...`)
      const places = await fetchPlaces(city)
      results[city.param] = places
      console.log(`    → ${places.length} results`)
      // Small delay to stay within rate limits
      await new Promise(r => setTimeout(r, 250))
    } catch (err) {
      console.error(`    ERROR: ${err.message}`)
      results[city.param] = []
    }
  }

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2))
  console.log(`\nWrote ${OUT_FILE}`)
}

main().catch(err => { console.error(err); process.exit(1) })
