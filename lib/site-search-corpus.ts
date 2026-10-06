// SERVER-ONLY (build time). Everything /search matches against, flattened
// into one compact object and written to /data/search-index.json. The site
// is static, so the search itself (lib/site-search.ts) runs in the browser
// over this file — the same approach pumpkinpatchesnearme.com uses.
import { restaurants, getCities } from './restaurants'
import { phoRestaurants } from './pho'
import { blogPosts } from './blog-posts'
import { getReviewSlug, hasReviewPage } from './reviews'
import { getAllRecipes } from './recipes'
import { getSupplementListingParams, findSupplementListing, supplementToRestaurant } from './places-supplements'
import { FIND_PAGES } from '@/components/find-cross-links'
import { CITY_GUIDE_REDIRECTS } from './city-guide-migration'
import { getCityListicleEntries, getCityPhoListicleEntries } from './city-listicles'
import { CAPITAL_CITIES } from './capital-cities'
import { MAJOR_CITIES } from './major-cities-list'
import { STATE_CODE_TO_SLUG } from './state-lookups'
import { isRetiredPage } from './retired-pages'
import type { Restaurant } from './restaurants'
import type { SearchCorpus, SearchRestaurant } from './site-search'

function slim(r: Restaurant, supp = false): SearchRestaurant {
  const reviewSlug = getReviewSlug(r)
  const hasReview = !supp && hasReviewPage(reviewSlug) && !isRetiredPage(`/reviews/${reviewSlug}`)
  return {
    slug: r.slug,
    name: r.name,
    city: r.city,
    state: r.state,
    stateCode: r.stateCode,
    citySlug: r.citySlug,
    stateSlug: r.stateSlug,
    postalCode: r.postalCode || undefined,
    address: r.address || undefined,
    rating: r.rating,
    reviewCount: r.reviewCount ?? 0,
    photo: r.photo || undefined,
    reviewSlug: hasReview ? reviewSlug : undefined,
  }
}

export function buildSearchCorpus(): SearchCorpus {
  const supplements: SearchRestaurant[] = []
  for (const p of getSupplementListingParams(Infinity)) {
    const s = findSupplementListing(p.city, p.state, p.restaurant)
    if (s) supplements.push(slim(supplementToRestaurant(s), true))
  }
  return {
    restaurants: restaurants.map((r) => slim(r)),
    supplements,
    cities: [
      ...getCities().map((c) => ({ city: c.city, citySlug: c.citySlug, stateCode: c.stateCode, stateSlug: c.stateSlug, count: c.count, major: false })),
      ...CAPITAL_CITIES.map((c) => ({ city: c.city, citySlug: c.citySlug, stateCode: c.stateCode, stateSlug: c.stateSlug, count: 0, major: true })),
      ...MAJOR_CITIES.map((c) => ({
        city: c.city,
        citySlug: c.city.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        stateCode: c.stateCode,
        stateSlug: STATE_CODE_TO_SLUG[c.stateCode] ?? '',
        count: 0,
        major: true,
      })),
    ],
    pho: phoRestaurants.map((p) => ({
      slug: p.slug, name: p.name, city: p.city, citySlug: p.citySlug, stateCode: p.stateCode,
      description: p.description, rating: p.rating, reviewCount: p.reviewCount, photo: p.photo || undefined,
    })),
    blog: blogPosts
      .filter((p) => !CITY_GUIDE_REDIRECTS[p.slug])
      .map((p) => ({ slug: p.slug, title: p.h1 ?? p.title, description: p.description, category: p.category, readTime: p.readTime })),
    listicles: [...getCityListicleEntries(), ...getCityPhoListicleEntries()].filter((e) => !isRetiredPage(e.href)),
    findPages: FIND_PAGES.map((p) => ({ href: p.href, label: p.label })),
    recipes: getAllRecipes().map((r) => ({ slug: r.slug, title: r.title, description: r.description })),
  }
}
