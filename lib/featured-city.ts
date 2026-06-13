// Maps "citySlug:stateSlug" to an ordered list of featured restaurant slugs.
// Featured restaurants appear first on the city page with a brown Verified badge.
const featuredCityListings: Record<string, string[]> = {
  'port-washington:new-york': ['ikedo-ramen'],
}

export function getFeaturedSlugsForCity(citySlug: string, stateSlug: string): string[] {
  return featuredCityListings[`${citySlug}:${stateSlug}`] ?? []
}
