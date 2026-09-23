import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCitiesForBroth, getRestaurantsByBrothAndCity } from '@/lib/restaurants'
import BrothCityPage, { type BrothCityConfig } from '@/components/broth-city-page'

interface Props { params: Promise<{ city: string; state: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return getCitiesForBroth('Vegan', 5).map((c) => ({ city: c.citySlug, state: c.stateSlug }))
}

const config: BrothCityConfig = {
  broth: 'Vegan',
  slug: 'vegan',
  nearMeSlug: 'vegan-ramen-near-me',
  tagline: 'Plant-based broths with full, satisfying umami depth. Browse the best vegan ramen in {{city}}, {{stateCode}}.',
  whatIs: 'Vegan ramen replaces the traditional animal-based broths with deeply flavored plant stocks — kombu (kelp), shiitake mushrooms, miso, and vegetables — to build the same umami richness without meat or dairy. Great vegan ramen is indistinguishable in depth from its meat-based counterparts. Toppings typically include roasted mushrooms, crispy tofu, corn, bamboo shoots, and nori. The restaurants listed above offer vegan ramen options in {{city}}, {{stateCode}}.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, state } = await params
  const list = getRestaurantsByBrothAndCity('Vegan', city, state)
  if (!list.length) return {}
  const { city: cityName, state: stateName, stateCode } = list[0]
  const title = `Best Vegan Ramen in ${cityName}, ${stateCode} — Top-Rated Spots`
  const url = `https://www.ramennearyou.com/vegan/${city}/${state}`
  return {
    title,
    description: `Find the best vegan ramen in ${cityName}, ${stateCode}. Browse ${list.length} restaurants with plant-based ramen options. Ratings, menus, and directions.`,
    alternates: { canonical: url },
    openGraph: { title, description: `${list.length} restaurants serving vegan ramen in ${cityName}, ${stateCode}.`, url },
  }
}

export default async function VeganCityPage({ params }: Props) {
  const { city, state } = await params
  const list = getRestaurantsByBrothAndCity('Vegan', city, state)
  if (!list.length) notFound()
  const { city: cityName, state: stateName, stateCode } = list[0]
  return (
    <BrothCityPage
      config={config}
      cityName={cityName}
      stateName={stateName}
      stateCode={stateCode}
      citySlug={city}
      stateSlug={state}
      restaurants={list}
    />
  )
}
