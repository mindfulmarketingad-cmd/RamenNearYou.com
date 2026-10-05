import data from './retired-pages.json'

// The directory is capped at ~5,000 built pages. Template pages (listings,
// reviews, /find city/modifier/neighborhood/pho pages, broth-city, city x
// filter, partner and city-listicle pages) were ranked by Google Search
// clicks, then impressions (date range in retired-pages.json `source`), and
// only the top 4,600 are built, plus every state page and the hand-verified
// and billboard listings. Hand-written pages (home, blog posts, recipes,
// comparisons, static pages) and owner-submitted listings aren't ranked and
// are always built.
//
// - `redirects`: every other template page, with where it 308s to — its
//   nearest built parent: a review to its listing, a listing to its city
//   page, a city page to its state page. Links already out there (and the
//   client-side map/search links that point at every restaurant) keep
//   landing somewhere useful. These are left out of the build, the sitemaps
//   and server-rendered link lists.
// - `findModifierPages`: the /find/{modifier}-{city}-{st} pages that are
//   built. Every other modifier x city combination redirects by rule in
//   proxy.ts rather than being listed.
// - `findSmallCityPages`: built /find pages for cities outside
//   getFindCityParams() (one dataset listing, or Places listings only).
//
// To bring a page back, delete its line from `redirects` (or add the param
// to `findModifierPages` / `findSmallCityPages`) and redeploy.

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
