import { pickStockPhoto } from './stock-photos'

// Viator affiliate experiences surfaced at /experiences and /experiences/{slug}.
//
// Every field here should come from the experience's own Viator listing —
// price, rating, and review count are claims shown to buyers, so they need to
// match the live listing rather than being estimated. `priceFrom` is the
// "From $X per person" figure Viator displays, which moves; re-check it when
// you touch a listing.
export interface Experience {
  slug: string
  name: string
  /** One-line hook used on the listicle card. */
  tagline: string
  description: string
  city: string
  country: string
  /** Filter facet — keep consistent across experiences in the same place. */
  destination: string
  /** Filter facet — e.g. "Cooking Class", "Food Tour". */
  category: string
  /** "From $130.28" figure on the Viator listing. */
  priceFrom: string
  rating: number
  reviewCount: number
  /** Real listing photography. Falls back to a stock ramen shot when unset. */
  image?: string
  affiliateUrl: string
  highlights: string[]
  /** Booking perks Viator lists (free cancellation, pay later, …). */
  perks: string[]
  metaTitle: string
  metaDescription: string
}

export const experiences: Experience[] = [
  {
    slug: 'authentic-ramen-making-experience-kyoto',
    name: 'Award-Winning Authentic Ramen Making Experience in Kyoto',
    tagline: 'Make ramen from scratch — noodles, broth, and all — at Ramen Factory Kyoto.',
    description:
      'Build a full bowl of ramen from scratch in Kyoto: mix and cut your own noodles, prepare the broth and toppings, then sit down and eat what you made. Run by Ramen Factory Kyoto, rated five stars by thousands of travelers and recommended by 100% of them. Instruction is hands-on and beginner-friendly, so no cooking experience is needed.',
    city: 'Kyoto',
    country: 'Japan',
    destination: 'Kyoto, Japan',
    category: 'Cooking Class',
    priceFrom: '$130.28',
    rating: 5,
    reviewCount: 2635,
    // No `image` yet — falls back to a stock ramen shot. Set it to the Viator
    // listing photo (and allow that hostname in next.config.mjs) when you have
    // one you're licensed to use.
    affiliateUrl:
      'https://www.viator.com/tours/Kyoto/Making-Ramen-from-scratch-and-Japanese-Souvenir-by-Ramen-Factory-Kyoto/d332-60659P1?pid=P00320180&mcid=42383&medium=link',
    highlights: [
      'Make noodles from scratch — mix, press, and cut your own',
      'Prepare the broth and toppings for your own bowl',
      'Eat what you cook, in the shop where you made it',
      'Beginner-friendly: no cooking experience needed',
      'Take home a Japanese souvenir from the class',
    ],
    perks: [
      'Free cancellation up to 24 hours before the experience starts',
      'Reserve now and pay later — secure your spot while staying flexible',
      'Discounted rates for children',
    ],
    metaTitle: 'Ramen Making Class in Kyoto | Award-Winning Authentic Experience',
    metaDescription:
      'Make ramen from scratch in Kyoto — noodles, broth, and toppings — at the award-winning Ramen Factory Kyoto. 5 stars from 2,635 reviews. Free cancellation up to 24 hours before.',
  },
]

export function getExperience(slug: string): Experience | undefined {
  return experiences.find((e) => e.slug === slug)
}

/** Listing photo when we have one, otherwise a stable stock shot. */
export function experienceImage(e: Experience): string {
  return e.image ?? pickStockPhoto(e.slug)
}

/** Facet values present in the data, for the /experiences filters. */
export function getExperienceFacets() {
  const destinations = [...new Set(experiences.map((e) => e.destination))].sort()
  const categories = [...new Set(experiences.map((e) => e.category))].sort()
  return { destinations, categories }
}
