import data from './retired-pages.json'

// Programmatic pages pruned for having no search demand, from a Google Search
// Console export (date range in retired-pages.json `source`).
//
// - `redirects`: template pages (listings, reviews, city x filter, broth-city,
//   pho-city, partner and city-listicle pages) with zero impressions over the
//   whole range. Each 308s to its nearest live parent — a review to its
//   listing, a listing to its city hub — so links already out there (and the
//   client-side map/search links that point at every restaurant) keep landing
//   somewhere useful. They're left out of the build and the sitemaps.
// - `findModifierPages`: the only /find/{modifier}-{city} pages still built —
//   the ones that earned at least one click. The other ~44k modifier x city
//   combinations are near-duplicates of the city page (most have no restaurant
//   matching the modifier at all) and redirect to /find/{city}.
// - `findSmallCityPages`: /find pages for cities outside getFindCityParams()
//   (one dataset listing, or Places listings only) that have impressions.
//   Those without impressions are in `redirects`, pointing at the state page.
//
// Never retired: state and /find city hubs, experiences (too new to have
// search data), and hand-verified or billboard listings.
//
// To bring a page back, delete its line from `redirects` (or add the modifier
// page to `findModifierPages`) and redeploy.

const REDIRECTS: Record<string, string> = data.redirects
const FIND_MODIFIER_PAGES = new Set<string>(data.findModifierPages)

/** Where a retired path now redirects to, or undefined if it's live. */
export function retiredPageTarget(path: string): string | undefined {
  return Object.prototype.hasOwnProperty.call(REDIRECTS, path) ? REDIRECTS[path] : undefined
}

export function isRetiredPage(path: string): boolean {
  return retiredPageTarget(path) !== undefined
}

/** Whether /find/{param} is a modifier page that's still built. */
export function isLiveFindModifier(param: string): boolean {
  return FIND_MODIFIER_PAGES.has(param)
}

export function getLiveFindModifierParams(): string[] {
  return data.findModifierPages
}

export function getLiveFindSmallCityParams(): string[] {
  return data.findSmallCityPages
}
