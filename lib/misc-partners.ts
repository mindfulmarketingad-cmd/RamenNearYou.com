// A small holding area for DB rows that turned out not to be real ramen
// restaurants — landmarks, malls, or other non-restaurant POIs the original
// scrape mismatched into the ramen dataset (e.g. "Old Sacramento Waterfront",
// a 28-acre historic district, not a restaurant). Pulling a row out of
// restaurants.json into here removes it from ramen city pages, counts, and
// the sitemap's restaurant listing, while still giving it a home at
// /partners/{slug} (redirected there from its old /{city}/{state}/{slug}
// URL in next.config.js) so existing inbound links and the blog listicle
// that mentions it don't 404.
import miscPartnersData from './misc-partners.json'
import type { Restaurant } from './restaurants'
import type { PhoRestaurant } from './pho'

export const miscPartners: Restaurant[] = miscPartnersData as Restaurant[]

const BY_SLUG = new Map(miscPartners.map(r => [r.slug, r]))

export function getMiscPartnerBySlug(slug: string): Restaurant | null {
  return BY_SLUG.get(slug) ?? null
}

export function getAllMiscPartnerSlugs(): string[] {
  return miscPartners.map(r => r.slug)
}

// Adapts a misc-partner Restaurant into the PhoRestaurant shape so it can
// flow through the same /partners/{slug} page as pho listings — the two
// types already share nearly every field name. Pho-only fields (reviewTags,
// typicalTimeSpent, reservationLinks, verified) get honest empty defaults;
// the page renders those sections conditionally, so nothing false is shown.
export function miscPartnerToPhoShape(r: Restaurant): PhoRestaurant {
  return {
    name: r.name,
    slug: r.slug,
    citySlug: r.citySlug,
    city: r.city,
    state: r.state,
    stateCode: r.stateCode,
    county: r.county,
    street: r.street,
    address: r.address,
    postalCode: r.postalCode,
    latitude: r.latitude ?? 0,
    longitude: r.longitude ?? 0,
    phone: r.phone,
    website: r.website,
    rating: r.rating,
    reviewCount: r.reviewCount,
    reviewsPerScore: r.reviewsPerScore,
    reviewsLink: '',
    reviewTags: [],
    photo: r.photo,
    photosCount: r.photosCount,
    logo: r.logo,
    description: r.description,
    type: r.subtypes.split(',')[0]?.trim() ?? '',
    subtypes: r.subtypes,
    hours: r.hours,
    typicalTimeSpent: '',
    menuLink: r.menuLink,
    orderLinks: r.orderLinks,
    reservationLinks: '',
    googleMapsLink: r.googleMapsLink,
    placeId: r.placeId,
    verified: false,
    amenities: {
      delivery: r.amenities.delivery, takeout: r.amenities.takeout, dineIn: r.amenities.dineIn,
      outdoorSeating: r.amenities.outdoorSeating, alcohol: r.amenities.alcohol,
      veganOptions: r.amenities.veganOptions, vegetarianOptions: r.amenities.vegetarianOptions,
      acceptsReservations: r.amenities.acceptsReservations, wheelchairAccessible: r.amenities.wheelchairAccessible,
      casual: r.amenities.casual, cozy: r.amenities.cozy, trendy: r.amenities.trendy,
      familyFriendly: r.amenities.familyFriendly, parking: r.amenities.parking, creditCards: r.amenities.creditCards,
    },
  }
}
