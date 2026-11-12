// Registry of curated ramen neighborhood pages: /find/ramen-restaurants-{slug}-{state}.
// Each entry is a real, well-known neighborhood with a hand-picked centroid and
// radius tuned against the live dataset so every page clears a minimum listing
// count (no thin, empty, or near-empty pages). Restaurants are matched at
// request time by straight-line distance from the centroid, scoped to the
// neighborhood's parent city so we never pull in a same-named neighborhood
// from a different metro.
import { restaurants, type Restaurant } from './restaurants'
import { STATE_CODE_TO_SLUG, STATE_CODE_TO_NAME } from './state-lookups'

export interface NeighborhoodDef {
  /** URL slug, unique when combined with stateCode, e.g. "midtown" + "GA". */
  slug: string
  /** Display name, e.g. "Midtown". */
  name: string
  cityName: string
  citySlug: string
  stateCode: string
  lat: number
  lng: number
  radiusMi: number
  /** One or two sentences on the neighborhood's general character — real,
   *  widely-known facts about the area itself, not fabricated restaurant claims. */
  vibe: string
}

export const NEIGHBORHOODS: NeighborhoodDef[] = [
  { slug: 'midtown', name: 'Midtown', cityName: 'Atlanta', citySlug: 'atlanta', stateCode: 'GA', lat: 33.7827, lng: -84.3833, radiusMi: 1.3, vibe: "Atlanta's densest walkable core, anchored by Piedmont Park, the Fox Theatre, and a cluster of high-rises that make it the city's most convenient neighborhood for a quick meal between errands." },
  { slug: 'buckhead', name: 'Buckhead', cityName: 'Atlanta', citySlug: 'atlanta', stateCode: 'GA', lat: 33.8484, lng: -84.3733, radiusMi: 3.0, vibe: "Atlanta's upscale shopping and dining district, home to Lenox Square and Phipps Plaza, with a dinner crowd that tends to dress up and linger over the meal." },
  { slug: 'poncey-highland', name: 'Poncey-Highland', cityName: 'Atlanta', citySlug: 'atlanta', stateCode: 'GA', lat: 33.7712, lng: -84.3527, radiusMi: 2.0, vibe: "A walkable, historic pocket between Ponce City Market and Virginia-Highland known for its independent restaurants, bars, and easy access to the Atlanta BeltLine." },

  { slug: 'wicker-park', name: 'Wicker Park', cityName: 'Chicago', citySlug: 'chicago', stateCode: 'IL', lat: 41.9088, lng: -87.6796, radiusMi: 1.0, vibe: "Chicago's arts-and-nightlife neighborhood on the near Northwest Side, known for indie boutiques, live-music venues, and a dense late-night restaurant scene." },
  { slug: 'logan-square', name: 'Logan Square', cityName: 'Chicago', citySlug: 'chicago', stateCode: 'IL', lat: 41.9289, lng: -87.7079, radiusMi: 1.0, vibe: "A boulevard-lined neighborhood that has become one of Chicago's most talked-about food destinations, mixing century-old greystones with a wave of chef-driven restaurants." },
  { slug: 'lincoln-park', name: 'Lincoln Park', cityName: 'Chicago', citySlug: 'chicago', stateCode: 'IL', lat: 41.9214, lng: -87.6513, radiusMi: 1.2, vibe: "A leafy North Side neighborhood built around its namesake park and zoo, popular with young professionals and families and lined with a mix of casual and upscale dining." },
  { slug: 'river-north', name: 'River North', cityName: 'Chicago', citySlug: 'chicago', stateCode: 'IL', lat: 41.8919, lng: -87.6346, radiusMi: 1.0, vibe: "One of the densest dining districts in the country, packed into the blocks just north of the Chicago River and steps from the Magnificent Mile." },
  { slug: 'lakeview', name: 'Lakeview', cityName: 'Chicago', citySlug: 'chicago', stateCode: 'IL', lat: 41.9403, lng: -87.6549, radiusMi: 1.2, vibe: "A sprawling North Side neighborhood home to Wrigley Field, with a restaurant scene that ranges from sports-bar casual to date-night spots along Southport Avenue." },

  { slug: 'montrose', name: 'Montrose', cityName: 'Houston', citySlug: 'houston', stateCode: 'TX', lat: 29.7433, lng: -95.3905, radiusMi: 1.3, vibe: "Houston's longtime arts-and-LGBTQ-culture neighborhood, known for walkable streets, a strong independent restaurant scene, and proximity to the Museum District." },
  { slug: 'midtown', name: 'Midtown', cityName: 'Houston', citySlug: 'houston', stateCode: 'TX', lat: 29.7396, lng: -95.3778, radiusMi: 2.0, vibe: "A dense, rapidly redeveloped stretch just south of Downtown Houston, popular with young professionals for its walkability and concentration of bars and restaurants." },
  { slug: 'heights', name: 'The Heights', cityName: 'Houston', citySlug: 'houston', stateCode: 'TX', lat: 29.8010, lng: -95.3985, radiusMi: 1.5, vibe: "A historic streetcar suburb turned trendy dining destination, centered on 19th Street and White Oak Drive with a mix of century-old bungalows and new restaurants." },

  { slug: 'capitol-hill', name: 'Capitol Hill', cityName: 'Seattle', citySlug: 'seattle', stateCode: 'WA', lat: 47.6231, lng: -122.3212, radiusMi: 1.2, vibe: "Seattle's most nightlife-heavy neighborhood, known for its LGBTQ history, live-music venues, and one of the city's densest concentrations of restaurants per block." },
  { slug: 'ballard', name: 'Ballard', cityName: 'Seattle', citySlug: 'seattle', stateCode: 'WA', lat: 47.6690, lng: -122.3830, radiusMi: 1.3, vibe: "A former fishing-and-maritime town annexed into Seattle, now known for its Sunday farmers market, breweries, and a lively strip of restaurants along Ballard Avenue." },
  { slug: 'university-district', name: 'University District', cityName: 'Seattle', citySlug: 'seattle', stateCode: 'WA', lat: 47.6615, lng: -122.3131, radiusMi: 1.2, vibe: "The neighborhood surrounding the University of Washington, with a student-driven restaurant scene heavy on quick, affordable, and late-night options." },

  { slug: 'japantown', name: 'Japantown', cityName: 'San Francisco', citySlug: 'san-francisco', stateCode: 'CA', lat: 37.7850, lng: -122.4297, radiusMi: 1.0, vibe: "One of only three surviving Japantowns in the United States, centered on the Japan Center mall and a natural home base for authentic Japanese food in San Francisco." },
  { slug: 'mission-district', name: 'Mission District', cityName: 'San Francisco', citySlug: 'san-francisco', stateCode: 'CA', lat: 37.7599, lng: -122.4148, radiusMi: 1.0, vibe: "San Francisco's sunniest, most food-obsessed neighborhood, known for its murals, taquerias, and one of the city's most diverse restaurant scenes." },
  { slug: 'soma', name: 'SoMa', cityName: 'San Francisco', citySlug: 'san-francisco', stateCode: 'CA', lat: 37.7785, lng: -122.4056, radiusMi: 1.0, vibe: "South of Market is San Francisco's tech and convention hub, with a lunch-and-happy-hour restaurant scene built around the office towers and Moscone Center." },

  { slug: 'koreatown', name: 'Koreatown', cityName: 'Los Angeles', citySlug: 'los-angeles', stateCode: 'CA', lat: 34.0589, lng: -118.3005, radiusMi: 1.3, vibe: "One of LA's most densely packed dining neighborhoods, famous for 24-hour restaurants, karaoke, and a Korean food scene that draws visitors from across the city." },
  { slug: 'sawtelle', name: 'Sawtelle', cityName: 'Los Angeles', citySlug: 'los-angeles', stateCode: 'CA', lat: 34.0367, lng: -118.4489, radiusMi: 1.0, vibe: "Known as Little Osaka, this stretch of Sawtelle Boulevard on LA's Westside is one of the most concentrated strips of Japanese restaurants in Southern California." },
  { slug: 'downtown-la', name: 'Downtown LA', cityName: 'Los Angeles', citySlug: 'los-angeles', stateCode: 'CA', lat: 34.0407, lng: -118.2468, radiusMi: 1.3, vibe: "LA's historic core, anchored by the Arts District, Little Tokyo, and Grand Central Market, with a restaurant scene that spans century-old institutions and new openings." },
  { slug: 'hollywood', name: 'Hollywood', cityName: 'Los Angeles', citySlug: 'los-angeles', stateCode: 'CA', lat: 34.0928, lng: -118.3287, radiusMi: 1.5, vibe: "The neighborhood synonymous with the entertainment industry, with a dining scene along Hollywood Boulevard and Sunset that ranges from tourist-facing to genuinely excellent." },

  { slug: 'chinatown', name: 'Chinatown', cityName: 'Las Vegas', citySlug: 'las-vegas', stateCode: 'NV', lat: 36.1268, lng: -115.2000, radiusMi: 1.3, vibe: "Las Vegas's Spring Mountain Road corridor, widely regarded by locals as the best area in the city for Asian food away from the Strip." },
  { slug: 'strip', name: 'The Strip', cityName: 'Las Vegas', citySlug: 'las-vegas', stateCode: 'NV', lat: 36.1147, lng: -115.1728, radiusMi: 1.5, vibe: "The famous stretch of Las Vegas Boulevard lined with the city's biggest resorts, where celebrity-chef restaurants sit alongside quick counter-service spots inside the casinos." },
  { slug: 'downtown', name: 'Downtown', cityName: 'Las Vegas', citySlug: 'las-vegas', stateCode: 'NV', lat: 36.1699, lng: -115.1398, radiusMi: 1.5, vibe: "Old Las Vegas, centered on the Fremont Street Experience, with a more local, less tourist-driven restaurant scene than the Strip." },

  { slug: 'rino', name: 'RiNo', cityName: 'Denver', citySlug: 'denver', stateCode: 'CO', lat: 39.7649, lng: -104.9789, radiusMi: 1.3, vibe: "Denver's River North Art District, a former industrial corridor now covered in murals and packed with breweries and restaurants housed in converted warehouses." },
  { slug: 'capitol-hill', name: 'Capitol Hill', cityName: 'Denver', citySlug: 'denver', stateCode: 'CO', lat: 39.7326, lng: -104.9769, radiusMi: 1.3, vibe: "One of Denver's oldest and most densely populated neighborhoods, ringing the State Capitol with a walkable mix of historic mansions and casual restaurants." },
  { slug: 'lodo', name: 'LoDo', cityName: 'Denver', citySlug: 'denver', stateCode: 'CO', lat: 39.7526, lng: -104.9990, radiusMi: 1.2, vibe: "Lower Downtown, Denver's historic warehouse district turned dining and nightlife hub, anchored by Union Station and Coors Field." },

  { slug: 'pearl-district', name: 'Pearl District', cityName: 'Portland', citySlug: 'portland', stateCode: 'OR', lat: 45.5285, lng: -122.6813, radiusMi: 1.0, vibe: "A former warehouse district turned upscale Portland neighborhood, known for art galleries, converted lofts, and a dense concentration of restaurants near Powell's Books." },
  { slug: 'southeast-portland', name: 'Southeast Portland', cityName: 'Portland', citySlug: 'portland', stateCode: 'OR', lat: 45.5122, lng: -122.6205, radiusMi: 1.5, vibe: "A sprawling, food-cart-heavy stretch of Portland along Hawthorne and Division, considered by many locals to be the city's real culinary center." },
  { slug: 'alberta-arts', name: 'Alberta Arts District', cityName: 'Portland', citySlug: 'portland', stateCode: 'OR', lat: 45.5592, lng: -122.6462, radiusMi: 1.2, vibe: "A Northeast Portland strip built around independent galleries and monthly Art Walks, with a restaurant scene that grew up alongside the neighborhood's creative reputation." },

  { slug: 'east-village', name: 'East Village', cityName: 'New York', citySlug: 'new-york', stateCode: 'NY', lat: 40.7265, lng: -73.9815, radiusMi: 1.0, vibe: "A historically bohemian Manhattan neighborhood that remains one of the city's most concentrated late-night restaurant scenes, especially along St. Marks Place." },
  { slug: 'hells-kitchen', name: "Hell's Kitchen", cityName: 'New York', citySlug: 'new-york', stateCode: 'NY', lat: 40.7638, lng: -73.9918, radiusMi: 1.0, vibe: "A Midtown West neighborhood shaped by its proximity to Broadway theaters, with a restaurant density built to serve pre- and post-show crowds every night of the week." },
  { slug: 'chelsea', name: 'Chelsea', cityName: 'New York', citySlug: 'new-york', stateCode: 'NY', lat: 40.7465, lng: -74.0014, radiusMi: 1.0, vibe: "A Manhattan neighborhood known for its art galleries, the High Line, and Chelsea Market, drawing a steady mix of locals and visitors to its restaurants." },
  { slug: 'upper-west-side', name: 'Upper West Side', cityName: 'New York', citySlug: 'new-york', stateCode: 'NY', lat: 40.7870, lng: -73.9754, radiusMi: 1.2, vibe: "A residential Manhattan neighborhood bordering Central Park, with a restaurant scene geared toward families and longtime locals rather than nightlife." },

  { slug: 'williamsburg', name: 'Williamsburg', cityName: 'Brooklyn', citySlug: 'brooklyn', stateCode: 'NY', lat: 40.7081, lng: -73.9571, radiusMi: 1.3, vibe: "Brooklyn's best-known neighborhood for its food and nightlife scene, with a waterfront that draws Manhattan visitors across the bridge every weekend." },
  { slug: 'park-slope', name: 'Park Slope', cityName: 'Brooklyn', citySlug: 'brooklyn', stateCode: 'NY', lat: 40.6710, lng: -73.9814, radiusMi: 1.3, vibe: "A brownstone-lined Brooklyn neighborhood bordering Prospect Park, known for its family-friendly pace and a Fifth Avenue restaurant strip that draws locals over tourists." },
]

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export const NEIGHBORHOOD_PREFIX = 'ramen-restaurants-'

export function neighborhoodParam(n: NeighborhoodDef): string {
  return `${NEIGHBORHOOD_PREFIX}${n.slug}-${n.stateCode.toLowerCase()}`
}

const PARAM_MAP = new Map(NEIGHBORHOODS.map(n => [neighborhoodParam(n), n]))

export function matchNeighborhood(param: string): NeighborhoodDef | null {
  return PARAM_MAP.get(param) ?? null
}

export function getNeighborhoodParams(): string[] {
  return NEIGHBORHOODS.map(neighborhoodParam)
}

/** Restaurants within the neighborhood's radius, scoped to its parent city so a
 *  same-named neighborhood elsewhere never bleeds in. Sorted by rating. */
export function getNeighborhoodRestaurants(n: NeighborhoodDef): Restaurant[] {
  return restaurants
    .filter(r => r.citySlug === n.citySlug && r.stateCode === n.stateCode && r.latitude && r.longitude)
    .filter(r => distanceMiles(n.lat, n.lng, r.latitude!, r.longitude!) <= n.radiusMi)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || ((b.reviewCount ?? 0) - (a.reviewCount ?? 0)))
}

/** Other curated neighborhoods in the same city, for internal linking. */
export function getSiblingNeighborhoods(n: NeighborhoodDef): NeighborhoodDef[] {
  return NEIGHBORHOODS.filter(o => o.citySlug === n.citySlug && o.stateCode === n.stateCode && o.slug !== n.slug)
}

/** All curated neighborhoods for a given city, for linking from the city hub page. */
export function getNeighborhoodsForCity(citySlug: string, stateCode: string): NeighborhoodDef[] {
  return NEIGHBORHOODS.filter(n => n.citySlug === citySlug && n.stateCode === stateCode)
}

export function neighborhoodStateSlug(n: NeighborhoodDef): string {
  return STATE_CODE_TO_SLUG[n.stateCode] ?? n.stateCode.toLowerCase()
}

export function neighborhoodStateName(n: NeighborhoodDef): string {
  return STATE_CODE_TO_NAME[n.stateCode] ?? n.stateCode
}
