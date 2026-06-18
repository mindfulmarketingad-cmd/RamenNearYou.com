import type { Metadata } from 'next'
import { getRestaurantsByService } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Best Vegan Ramen Near Me — Top-Rated Spots Near You',
  description: 'Find the best vegan ramen near you. Browse top-rated ramen restaurants serving plant-based broths with rich, umami-packed flavor — no meat required.',
  alternates: { canonical: 'https://www.ramennearyou.com/vegan-ramen-near-me' },
  openGraph: {
    title: 'Best Vegan Ramen Near Me — Top-Rated Spots Near You',
    description: 'Find the best vegan ramen near you. Plant-based broths with rich umami depth.',
    url: 'https://www.ramennearyou.com/vegan-ramen-near-me',
  },
}

const brothInfo = {
  type: 'Vegan',
  slug: 'vegan-ramen-near-me',
  headline: 'Vegan Ramen Near Me',
  subhead: 'Find the best vegan ramen restaurants near you — fully plant-based bowls with rich, umami-deep broths made from mushroom dashi, miso, soy milk, and sesame. Proof that ramen doesn’t need meat to be extraordinary.',
  intro: '',
  whatIs: 'Vegan ramen is ramen made entirely without animal products — no pork bones, chicken stock, eggs, or dairy. Instead, the broth builds deep umami from kombu (kelp), shiitake and other mushrooms, roasted vegetables, miso, soy milk, and sesame paste. The result can be every bit as rich and satisfying as a traditional bowl. Toppings swap chashu and eggs for marinated tofu, tempeh, corn, bamboo shoots, nori, scallions, and seasonal vegetables.',
  characteristics: [
    'Broth built from kombu, shiitake mushrooms, and roasted vegetables for deep umami',
    'Creamy versions use soy milk or sesame paste in place of pork fat',
    'Miso-based vegan broths are among the richest and most popular',
    'Toppings include marinated tofu, tempeh, corn, bamboo shoots, and fresh greens',
    'Always free of pork, chicken, dashi made from fish, eggs, and dairy',
    'Great option for plant-based eaters who still want a hearty, savory bowl',
  ],
  jsonLdName: 'Best Vegan Ramen Restaurants Near Me',
}

const list = getRestaurantsByService('Vegan').sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 300)

export default function VeganRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={list} />
}
