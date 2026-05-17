import type { Metadata } from 'next'
import { restaurants } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Spicy Ramen Near Me — Find Local Spicy Ramen Restaurants',
  description: 'Find the best spicy ramen near you. Browse top-rated ramen restaurants serving tantanmen, volcano ramen, and bold spicy broths in your area.',
  alternates: { canonical: 'https://www.ramennearyou.com/spicy-ramen-near-me' },
  openGraph: {
    title: 'Spicy Ramen Near Me — Find Local Spicy Ramen Restaurants',
    description: 'Find the best spicy ramen near you. Top-rated ramen restaurants serving bold, heat-packed bowls.',
    url: 'https://www.ramennearyou.com/spicy-ramen-near-me',
  },
}

const brothInfo = {
  type: 'Spicy',
  slug: 'spicy-ramen-near-me',
  headline: 'Spicy Ramen Near Me',
  subhead: 'Find the best spicy ramen restaurants near you — from tantanmen and volcano ramen to fire-spiced broths with bold, tongue-tingling heat.',
  intro: '',
  whatIs: 'Spicy ramen is ramen built around heat — chili oil, gochujang, doubanjiang, or house-made spice blends layered into the broth. The most common style is tantanmen (tan tan ramen), a Japanese adaptation of Chinese dan dan noodles with a sesame-chili broth. Volcano ramen, tori paitan spicy, and ghost pepper ramen are other popular formats. The heat level can range from mild tingle to face-melting — most restaurants let you choose.',
  characteristics: [
    'Rich chili oil or spice paste blended into the base broth',
    'Common toppings include minced pork, scallions, sesame seeds, and soft-boiled egg',
    'Broth base is usually pork or chicken, infused with heat from doubanjiang or chili paste',
    'Spice level is often adjustable — great for both heat lovers and newcomers',
    'Tantanmen is the most widely available style at Japanese ramen shops',
    'Best paired with cold beer or a light sake to balance the heat',
  ],
  jsonLdName: 'Best Spicy Ramen Restaurants Near Me',
}

const sorted = [...restaurants].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

export default function SpicyRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={sorted} />
}
