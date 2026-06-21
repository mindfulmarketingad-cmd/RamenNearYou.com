import capitalsRaw from './places-capital-supplements.json'
import majorCitiesRaw from './places-major-cities.json'

export interface PlacesRestaurant {
  placeId: string
  name: string
  address: string
  rating: number | null
  reviewCount: number
  priceLevel: number | null
  photo: string | null
  latitude: number | null
  longitude: number | null
  openNow: boolean | null
  googleMapsUrl: string
}

const supplements: Record<string, PlacesRestaurant[]> = {
  ...(capitalsRaw as Record<string, PlacesRestaurant[]>),
  ...(majorCitiesRaw as Record<string, PlacesRestaurant[]>),
}

export function getPlacesSupplements(param: string): PlacesRestaurant[] {
  return supplements[param] ?? []
}
