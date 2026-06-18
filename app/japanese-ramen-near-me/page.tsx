import type { Metadata } from 'next'
import { getRestaurantsByService } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Best Japanese Ramen Near Me — Top-Rated Spots Near You',
  description: 'Find the best Japanese ramen near you. Browse top-rated restaurants serving authentic Tokyo shoyu, Sapporo miso, and Hakata tonkotsu ramen.',
  alternates: { canonical: 'https://www.ramennearyou.com/japanese-ramen-near-me' },
  openGraph: {
    title: 'Best Japanese Ramen Near Me — Top-Rated Spots Near You',
    description: 'Find the best Japanese ramen near you. Authentic Tokyo, Sapporo, and Hakata styles.',
    url: 'https://www.ramennearyou.com/japanese-ramen-near-me',
  },
}

const brothInfo = {
  type: 'Japanese',
  slug: 'japanese-ramen-near-me',
  headline: 'Japanese Ramen Near Me',
  subhead: 'Find authentic Japanese ramen restaurants near you — from traditional Tokyo shoyu to Sapporo miso and Hakata tonkotsu. Real Japanese ramen crafted with generations of technique.',
  intro: '',
  whatIs: 'Japanese ramen is the original — a craft refined across regions for over a century. Each region has its signature: Tokyo’s clear shoyu (soy) broth, Sapporo’s hearty miso, Hakata’s rich tonkotsu, and Kitakata’s flat noodles. Authentic Japanese ramen shops obsess over broth depth, tare seasoning, noodle texture, and toppings like chashu pork, ajitama egg, menma, and nori. It’s the benchmark every other style is measured against.',
  characteristics: [
    'Regional styles: Tokyo shoyu, Sapporo miso, Hakata tonkotsu, and more',
    'Broth, tare (seasoning), and noodles are each crafted with precision',
    'Classic toppings: chashu pork, ajitama egg, menma (bamboo), nori, scallions',
    'Emphasis on authenticity and traditional Japanese technique',
    'Noodle texture is tuned to each broth — thin and straight to thick and wavy',
    'The gold standard that defines what great ramen should be',
  ],
  jsonLdName: 'Best Japanese Ramen Restaurants Near Me',
}

const list = getRestaurantsByService('Japanese').sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 300)

export default function JapaneseRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={list} />
}
