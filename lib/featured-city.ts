// Maps "citySlug:stateSlug" to an ordered list of featured restaurant slugs.
// Featured restaurants appear first on the city find page with a gold pin and badge.
const featuredCityListings: Record<string, string[]> = {
  'port-washington:new-york': ['ikedo-ramen'],
}

export function getFeaturedSlugsForCity(citySlug: string, stateSlug: string): string[] {
  return featuredCityListings[`${citySlug}:${stateSlug}`] ?? []
}

// Flat set of every featured restaurant slug across all cities — used by the
// searchmap to flag featured pins/cards and sort them first.
let _allFeatured: Set<string> | null = null
export function getAllFeaturedSlugs(): Set<string> {
  if (!_allFeatured) {
    _allFeatured = new Set(Object.values(featuredCityListings).flat())
  }
  return _allFeatured
}
