import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCitiesForBroth, getRestaurantsByBrothAndCity } from '@/lib/restaurants'
import BrothCityPage, { type BrothCityConfig } from '@/components/broth-city-page'

interface Props { params: Promise<{ city: string; state: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return getCitiesForBroth('Spicy', 2).map((c) => ({ city: c.citySlug, state: c.stateSlug }))
}

const config: BrothCityConfig = {
  broth: 'Spicy',
  slug: 'spicy',
  nearMeSlug: 'spicy-ramen-near-me',
  tagline: 'Bold, heat-packed broths for spice lovers. Browse the best spicy ramen in {{city}}, {{stateCode}}.',
  whatIs: 'Spicy ramen covers a family of heat-forward styles — from tantanmen (a sesame-chili broth inspired by Chinese dan dan noodles) to volcano ramen loaded with chili oil, doubanjiang, and ground pork. Heat levels range from a gentle warming tingle to face-melting bowls designed to challenge. The restaurants listed above have been identified as serving spicy ramen in {{city}}, {{stateCode}}.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, state } = await params
  const list = getRestaurantsByBrothAndCity('Spicy', city, state)
  if (!list.length) return {}
  const { city: cityName, state: stateName, stateCode } = list[0]
  const title = `Best Spicy Ramen in ${cityName}, ${stateCode} — Top-Rated Spots`
  const url = `https://www.ramennearyou.com/spicy/${city}/${state}`
  return {
    title,
    description: `Find the best spicy ramen in ${cityName}, ${stateCode}. Browse ${list.length} top-rated restaurants serving bold, heat-packed bowls. Ratings, menus, and directions.`,
    alternates: { canonical: url },
    openGraph: { title, description: `${list.length} top-rated spicy ramen restaurants in ${cityName}, ${stateCode}.`, url },
  }
}

export default async function SpicyCityPage({ params }: Props) {
  const { city, state } = await params
  const list = getRestaurantsByBrothAndCity('Spicy', city, state)
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
