import type { Metadata } from 'next'
import { restaurants } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Best Tonkotsu Ramen Near Me — Top-Rated Spots Near You',
  description: 'Craving tonkotsu ramen near you? Browse the best tonkotsu ramen restaurants near me — rich, creamy pork bone broth, ranked by rating with maps, hours & reviews.',
  alternates: { canonical: 'https://www.ramennearyou.com/tonkotsu-ramen-near-me' },
  openGraph: {
    title: 'Best Tonkotsu Ramen Near Me — Top-Rated Spots Near You',
    description: 'Find the best tonkotsu ramen near you — rich, creamy pork bone broth, ranked by rating with maps, hours & reviews.',
    url: 'https://www.ramennearyou.com/tonkotsu-ramen-near-me',
  },
}

const brothInfo = {
  type: 'Tonkotsu',
  slug: 'tonkotsu-ramen-near-me',
  headline: 'Tonkotsu Ramen Near Me',
  subhead: 'Find the best tonkotsu ramen restaurants near you — rich, creamy pork bone broth slow-simmered for hours until silky smooth. The boldest, most indulgent bowl in Japanese ramen.',
  intro: '',
  whatIs: 'Tonkotsu ramen originated in Fukuoka, Japan and is defined by its thick, milky-white broth made from pork bones boiled at high heat for 8–18 hours. This long cook time breaks down collagen into gelatin, creating the signature creamy, rich consistency. Tonkotsu is the most umami-forward style of ramen — intensely savory, slightly fatty, and deeply satisfying. It pairs with thin straight noodles and is typically topped with chashu pork belly, a soft-boiled marinated egg, green onions, and black garlic oil.',
  characteristics: [
    'Milky white, opaque broth made from pork neck bones and trotters boiled 8–18 hours',
    'Thick, rich, and creamy — the most filling style of ramen',
    'Thin, straight noodles hold up well in the heavy broth',
    'Classic toppings: chashu pork belly, soft-boiled egg, green onions, black garlic oil (mayu)',
    'Often finished with sesame seeds, pickled ginger, and nori',
    'Originated in Hakata (Fukuoka), Japan — the spiritual home of tonkotsu ramen',
  ],
  jsonLdName: 'Best Tonkotsu Ramen Restaurants Near Me',
}

const sorted = [...restaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 300)

export default function TonkotsuRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={sorted} />
}
