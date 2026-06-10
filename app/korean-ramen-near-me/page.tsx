import type { Metadata } from 'next'
import { getRestaurantsByService } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Korean Ramen Near Me — Find Local Korean Ramen Restaurants',
  description: 'Find the best Korean ramen near you. Browse top-rated spots serving spicy ramyeon-inspired bowls, kimchi broths, and Korean-Japanese fusion ramen.',
  alternates: { canonical: 'https://www.ramennearyou.com/korean-ramen-near-me' },
  openGraph: {
    title: 'Korean Ramen Near Me — Find Local Korean Ramen Restaurants',
    description: 'Find the best Korean ramen near you. Bold ramyeon-inspired bowls and kimchi broths.',
    url: 'https://www.ramennearyou.com/korean-ramen-near-me',
  },
}

const brothInfo = {
  type: 'Korean',
  slug: 'korean-ramen-near-me',
  headline: 'Korean Ramen Near Me',
  subhead: 'Find the best Korean ramen restaurants near you — bold, spicy ramyeon-inspired bowls, kimchi broths, and Korean-Japanese fusion spots serving unforgettable noodle dishes.',
  intro: '',
  whatIs: 'Korean ramen draws on the country’s love of ramyeon — instant-style noodles elevated into rich, spicy, deeply flavored bowls. Expect gochujang and gochugaru heat, kimchi-laced broths, and toppings like Korean BBQ pork, a runny egg, scallions, and melty cheese. Many spots blend Korean and Japanese techniques into a fusion style, pairing springy noodles with bold, fermented, spicy flavors that set Korean ramen apart from its Japanese cousins.',
  characteristics: [
    'Bold heat from gochujang and gochugaru (Korean chili)',
    'Kimchi and fermented flavors layered into the broth',
    'Toppings often include Korean BBQ pork, runny egg, scallions, and cheese',
    'Springy, chewy noodles inspired by Korean ramyeon',
    'Frequently a Korean-Japanese fusion of techniques and flavors',
    'Great for diners who love spice and deep, fermented umami',
  ],
  jsonLdName: 'Best Korean Ramen Restaurants Near Me',
}

const list = getRestaurantsByService('Korean').sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 300)

export default function KoreanRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={list} />
}
