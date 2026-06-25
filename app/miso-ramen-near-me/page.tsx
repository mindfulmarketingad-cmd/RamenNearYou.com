import type { Metadata } from 'next'
import { restaurants } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Best Miso Ramen Near Me — Top-Rated Spots Near You',
  description: 'Craving miso ramen near you? Browse the best miso ramen restaurants near me — rich Hokkaido-style miso broth, ranked by rating with maps, hours & reviews.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/miso-ramen' },
  openGraph: {
    title: 'Best Miso Ramen Near Me — Top-Rated Spots Near You',
    description: 'Find the best miso ramen near you — rich, fermented Hokkaido-style miso broth, ranked by rating with maps, hours & reviews.',
    url: 'https://www.ramennearyou.com/find/miso-ramen',
  },
}

const brothInfo = {
  type: 'Miso',
  slug: 'miso-ramen-near-me',
  headline: 'Miso Ramen Near Me',
  subhead: 'Find the best miso ramen restaurants near you — bold, fermented miso broth with deep savory flavor, creamy texture, and classic Hokkaido-style toppings.',
  intro: '',
  whatIs: 'Miso ramen originated in Sapporo, Hokkaido and is one of the richest, most warming styles of ramen. The broth is built on a base of chicken or pork stock seasoned with fermented miso paste — white miso for a milder sweetness, red miso for deeper, earthier flavor. Hokkaido-style miso ramen is famous for its toppings: sweet corn, a pat of butter, bamboo shoots, ground pork, and thick, wavy noodles that hold up in the hearty broth.',
  characteristics: [
    'Base broth of chicken or pork stock mixed with fermented miso tare',
    'White miso (shiro) gives a sweet, mild flavor; red miso (aka) gives depth and earthiness',
    'Classic Hokkaido toppings: corn, butter, bamboo shoots, bean sprouts, ground pork',
    'Thick, wavy noodles are traditional — they hold up to the rich broth',
    'Often richer and more filling than shoyu or shio styles',
    'Pairs well with garlic chips, sesame oil drizzle, and a soft-boiled marinated egg',
  ],
  jsonLdName: 'Best Miso Ramen Restaurants Near Me',
}

const sorted = [...restaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 300)

export default function MisoRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={sorted} />
}
