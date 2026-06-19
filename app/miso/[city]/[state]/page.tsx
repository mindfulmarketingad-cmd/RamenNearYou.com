import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCitiesForBroth, getRestaurantsByBrothAndCity } from '@/lib/restaurants'
import BrothCityPage, { type BrothCityConfig } from '@/components/broth-city-page'

interface Props { params: Promise<{ city: string; state: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  return getCitiesForBroth('Miso', 2).map((c) => ({ city: c.citySlug, state: c.stateSlug }))
}

const config: BrothCityConfig = {
  broth: 'Miso',
  slug: 'miso',
  nearMeSlug: 'miso-ramen-near-me',
  tagline: 'Rich, fermented miso broth with deep umami and hearty toppings. Browse the best miso ramen in {{city}}, {{stateCode}}.',
  whatIs: 'Miso ramen is a northern Japanese style originating in Sapporo, Hokkaido. The broth is seasoned with fermented soybean paste (miso), giving it a rich, nutty, savory depth that is heartier than shoyu or shio. It pairs beautifully with wavy noodles and is typically topped with corn, butter, ground pork, bean sprouts, and a soft-boiled egg. The restaurants listed above serve miso ramen in {{city}}, {{stateCode}}.',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, state } = await params
  const list = getRestaurantsByBrothAndCity('Miso', city, state)
  if (!list.length) return {}
  const { city: cityName, state: stateName, stateCode } = list[0]
  const title = `Best Miso Ramen in ${cityName}, ${stateCode} — Top-Rated Spots`
  const url = `https://www.ramennearyou.com/miso/${city}/${state}`
  return {
    title,
    description: `Find the best miso ramen in ${cityName}, ${stateCode}. Browse ${list.length} top-rated restaurants serving rich, fermented miso broth. Ratings, menus, and directions.`,
    alternates: { canonical: url },
    openGraph: { title, description: `${list.length} top-rated miso ramen restaurants in ${cityName}, ${stateCode}.`, url },
  }
}

export default async function MisoCityPage({ params }: Props) {
  const { city, state } = await params
  const list = getRestaurantsByBrothAndCity('Miso', city, state)
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
