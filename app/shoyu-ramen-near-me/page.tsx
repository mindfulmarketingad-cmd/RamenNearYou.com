import type { Metadata } from 'next'
import { restaurants } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Shoyu Ramen Near Me — Find Local Shoyu Ramen Restaurants',
  description: 'Find the best shoyu ramen near you. Browse top-rated ramen restaurants serving classic Tokyo-style soy sauce broth — clear, savory, and perfectly balanced.',
  alternates: { canonical: 'https://www.ramennearyou.com/shoyu-ramen-near-me' },
  openGraph: {
    title: 'Shoyu Ramen Near Me — Find Local Shoyu Ramen Restaurants',
    description: 'Find the best shoyu ramen near you. Classic Tokyo-style soy sauce broth — clear, savory, and balanced.',
    url: 'https://www.ramennearyou.com/shoyu-ramen-near-me',
  },
}

const brothInfo = {
  type: 'Shoyu',
  slug: 'shoyu-ramen-near-me',
  headline: 'Shoyu Ramen Near Me',
  subhead: 'Find the best shoyu ramen restaurants near you — the classic Tokyo-style soy sauce broth that defined ramen. Clear, savory, and perfectly balanced with every topping.',
  intro: '',
  whatIs: 'Shoyu ramen is the original Tokyo ramen style — a clear, amber-colored broth made from chicken or pork stock seasoned with soy sauce (shoyu) tare. It\'s lighter than tonkotsu and more savory than shio, sitting in a perfect middle ground that pairs beautifully with every classic topping. Because the broth is translucent and delicate, the quality of the ingredients stands out — this style rewards great technique and well-sourced components.',
  characteristics: [
    'Clear to amber-colored broth seasoned with a soy sauce-based tare',
    'Base is usually chicken, sometimes pork — lighter and more refined than tonkotsu',
    'Classic toppings: chashu pork, menma (bamboo), narutomaki, nori, soft-boiled egg',
    'Thin, straight noodles are traditional for Tokyo shoyu style',
    'More versatile and widely available than miso or tonkotsu — most ramen shops offer it',
    'A great entry point for first-time ramen eaters due to its approachable, balanced flavor',
  ],
  jsonLdName: 'Best Shoyu Ramen Restaurants Near Me',
}

const sorted = [...restaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

export default function ShoyuRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={sorted} />
}
