import type { Metadata } from 'next'
import { restaurants } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Best Shio Ramen Near Me — Top-Rated Spots Near You',
  description: 'Craving shio ramen near you? Browse the best shio ramen restaurants near me — light, clear salt-based broth, ranked by rating with maps, hours & reviews.',
  alternates: { canonical: 'https://www.ramennearyou.com/shio-ramen-near-me' },
  openGraph: {
    title: 'Best Shio Ramen Near Me — Top-Rated Spots Near You',
    description: 'Find the best shio ramen near you — light, clear salt-based broth, delicate and savory, ranked by rating with maps, hours & reviews.',
    url: 'https://www.ramennearyou.com/shio-ramen-near-me',
  },
}

const brothInfo = {
  type: 'Shio',
  slug: 'shio-ramen-near-me',
  headline: 'Shio Ramen Near Me',
  subhead: 'Find the best shio ramen restaurants near you — light, clear, salt-seasoned broth that lets every ingredient shine. The oldest and most delicate style of Japanese ramen.',
  intro: '',
  whatIs: 'Shio ("salt") ramen is the oldest of the ramen styles, defined by its light, clear, golden broth seasoned primarily with salt rather than soy sauce or miso. The broth is typically built from chicken, seafood, seaweed, and vegetables, producing a clean, delicate, savory bowl that highlights the purity of its ingredients. Shio is the lightest mainstream ramen style — bright and refreshing rather than heavy — and is usually paired with thin, straight noodles and toppings like chashu, menma (bamboo shoots), green onions, and a soft-boiled egg.',
  characteristics: [
    'Light, clear, golden broth seasoned mainly with salt',
    'Often built from chicken, seafood, kombu (kelp), and vegetables',
    'The lightest and most delicate mainstream ramen style',
    'Thin, straight noodles let the clean broth take center stage',
    'Classic toppings: chashu, menma (bamboo shoots), green onions, soft-boiled egg',
    'The oldest style of ramen, dating back to Japan’s early ramen shops',
  ],
  jsonLdName: 'Best Shio Ramen Restaurants Near Me',
}

const sorted = [...restaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 300)

export default function ShioRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={sorted} />
}
