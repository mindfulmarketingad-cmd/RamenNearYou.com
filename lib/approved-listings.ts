// SERVER-ONLY. Owner-submitted restaurants (via /claim-your-listing →
// /api/listings) live in the Supabase `listings` table and are approved by
// an admin at /admin/listings. Until now nothing on the live site ever read
// that table, so an approved submission never got a working listing page —
// its /{city}/{state}/{slug} URL 404'd. This module resolves those rows and
// adapts them into the same Restaurant shape every other listing renders
// through.
import { createAdminClient } from './supabase-admin'
import { STATE_CODE_TO_SLUG, STATE_CODE_TO_NAME } from './state-lookups'
import type { Restaurant } from './restaurants'

export interface ApprovedListingRow {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string | null
  phone: string | null
  website: string | null
  description: string | null
}

// Matches how listing URLs are formed from names elsewhere on the site:
// lowercase, every non-alphanumeric run collapses to a single hyphen
// ("Neetu's Kitchen" → "neetu-s-kitchen").
export function slugifyListing(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// The submission form stores a 2-letter state code, but be tolerant of full
// names in case rows were entered by hand.
function stateToSlug(state: string): string | null {
  const raw = state.trim()
  const code = raw.toUpperCase()
  if (STATE_CODE_TO_SLUG[code]) return STATE_CODE_TO_SLUG[code]
  const asName = slugifyListing(raw)
  return Object.values(STATE_CODE_TO_SLUG).includes(asName) ? asName : null
}

function stateToCode(state: string): string {
  const code = state.trim().toUpperCase()
  if (STATE_CODE_TO_NAME[code]) return code
  const asName = state.trim().toLowerCase()
  for (const [c, n] of Object.entries(STATE_CODE_TO_NAME)) {
    if (n.toLowerCase() === asName) return c
  }
  return code
}

// One query per build worker, shared by generateStaticParams and every page
// render — listing pages are generated only at build time, so the set can't
// change mid-build and there is nothing to gain from re-reading it per page.
let _approved: Promise<ApprovedListingRow[]> | null = null

/** Every approved owner-submitted listing that has the fields a URL needs. */
export function getAllApprovedListings(): Promise<ApprovedListingRow[]> {
  _approved ??= (async () => {
    const admin = createAdminClient()
    if (!admin) return []
    const { data, error } = await admin
      .from('listings')
      .select('id, name, address, city, state, zip, phone, website, description')
      .eq('status', 'approved')
    if (error || !data) {
      // At build time this drops every owner-submitted page from the deploy,
      // so make it loud in the build log rather than silent.
      console.error('[approved-listings] query failed, building without them:', error?.message)
      return []
    }
    return (data as ApprovedListingRow[]).filter((row) => row.name && row.city && row.state)
  })()
  return _approved
}

export async function getApprovedListing(
  citySlug: string,
  stateSlug: string,
  slug: string
): Promise<ApprovedListingRow | null> {
  for (const row of await getAllApprovedListings()) {
    if (slugifyListing(row.name) !== slug) continue
    if (slugifyListing(row.city) !== citySlug) continue
    if (stateToSlug(row.state) !== stateSlug) continue
    return row
  }
  return null
}

export function approvedListingToRestaurant(row: ApprovedListingRow): Restaurant {
  const stateCode = stateToCode(row.state)
  const stateSlug = stateToSlug(row.state) ?? slugifyListing(row.state)
  const addressParts = [row.address, row.city, `${stateCode}${row.zip ? ` ${row.zip}` : ''}`]
  return {
    name: row.name,
    slug: slugifyListing(row.name),
    citySlug: slugifyListing(row.city),
    stateSlug,
    phone: row.phone ?? '',
    website: row.website ?? '',
    address: addressParts.filter(Boolean).join(', '),
    street: row.address,
    city: row.city,
    county: '',
    state: STATE_CODE_TO_NAME[stateCode] ?? row.state,
    stateCode,
    postalCode: row.zip ?? '',
    latitude: null,
    longitude: null,
    rating: null,
    reviewCount: 0,
    reviewsPerScore: null,
    photosCount: 0,
    photo: '',
    logo: '',
    businessStatus: '',
    hours: null,
    priceRange: '',
    description: row.description ?? '',
    menuLink: '',
    orderLinks: '',
    googleMapsLink: '',
    placeId: '',
    subtypes: '',
    amenities: {
      delivery: false, takeout: false, dineIn: false, outdoorSeating: false,
      alcohol: false, veganOptions: false, vegetarianOptions: false,
      acceptsReservations: false, wheelchairAccessible: false,
      casual: false, cozy: false, trendy: false, familyFriendly: false,
      parking: false, creditCards: false,
    },
  }
}
