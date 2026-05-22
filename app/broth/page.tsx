import { restaurants, getBrothTypes, BROTH_TYPES, type BrothType } from '@/lib/restaurants'
import BrothClient, { type BrothCard } from './broth-client'

const PER_TYPE_LIMIT = 60
const OVERALL_LIMIT = 100

function toCard(r: typeof restaurants[number], types: BrothType[]): BrothCard {
  return {
    slug: r.slug,
    citySlug: r.citySlug,
    stateSlug: r.stateSlug,
    name: r.name,
    photo: r.photo,
    city: r.city,
    stateCode: r.stateCode,
    rating: r.rating,
    reviewCount: r.reviewCount,
    types,
  }
}

export default function BrothPage() {
  const tagged = restaurants.map(r => ({ r, types: getBrothTypes(r) }))

  const counts: Record<string, number> = { All: restaurants.length }
  const topByType = {} as Record<BrothType, BrothCard[]>

  for (const type of BROTH_TYPES) {
    const ofType = tagged.filter(({ types }) => types.includes(type))
    counts[type] = ofType.length
    topByType[type] = ofType
      .sort((a, b) => (b.r.rating ?? 0) - (a.r.rating ?? 0))
      .slice(0, PER_TYPE_LIMIT)
      .map(({ r, types }) => toCard(r, types))
  }

  const topOverall = [...tagged]
    .sort((a, b) => (b.r.rating ?? 0) - (a.r.rating ?? 0))
    .slice(0, OVERALL_LIMIT)
    .map(({ r, types }) => toCard(r, types))

  return (
    <BrothClient
      counts={counts}
      topByType={topByType}
      topOverall={topOverall}
      perTypeLimit={PER_TYPE_LIMIT}
      overallLimit={OVERALL_LIMIT}
    />
  )
}
