import type { Metadata } from 'next'
import { getRestaurantsByService } from '@/lib/restaurants'
import BrothTypeNearMePage from '@/components/broth-type-near-me-page'

export const metadata: Metadata = {
  title: 'Vegetarian Ramen Near Me — Find Local Vegetarian Ramen Restaurants',
  description: 'Find the best vegetarian ramen near you. Browse top-rated ramen restaurants serving hearty vegetable broths, miso bowls, and meat-free options.',
  alternates: { canonical: 'https://www.ramennearyou.com/vegetarian-ramen-near-me' },
  openGraph: {
    title: 'Vegetarian Ramen Near Me — Find Local Vegetarian Ramen Restaurants',
    description: 'Find the best vegetarian ramen near you. Hearty meat-free bowls with rich vegetable broths.',
    url: 'https://www.ramennearyou.com/vegetarian-ramen-near-me',
  },
}

const brothInfo = {
  type: 'Vegetarian',
  slug: 'vegetarian-ramen-near-me',
  headline: 'Vegetarian Ramen Near Me',
  subhead: 'Find the best vegetarian ramen restaurants near you — hearty vegetable broths, miso-based soups, and egg-topped bowls. Satisfying, meat-free ramen for plant-forward diners.',
  intro: '',
  whatIs: 'Vegetarian ramen skips the meat but, unlike strictly vegan ramen, may include dairy or eggs — think a soft-boiled marinated egg (ajitama) or a swirl of butter in a Hokkaido-style miso bowl. The broth leans on vegetables, mushrooms, kombu, and miso for body and umami. It’s a great middle ground for diners who want a rich, comforting bowl without pork or chicken while still enjoying classic toppings like egg, corn, and butter.',
  characteristics: [
    'Vegetable- and mushroom-forward broths with kombu and miso for umami',
    'May include eggs (ajitama) or dairy, unlike fully vegan ramen',
    'Hokkaido-style miso with corn and butter is a popular vegetarian choice',
    'Toppings include soft-boiled egg, tofu, corn, scallions, and bamboo shoots',
    'Hearty and warming without any pork or chicken',
    'Ideal for vegetarians who still want a traditional ramen experience',
  ],
  jsonLdName: 'Best Vegetarian Ramen Restaurants Near Me',
}

const list = getRestaurantsByService('Vegetarian').sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 300)

export default function VegetarianRamenNearMePage() {
  return <BrothTypeNearMePage broth={brothInfo} restaurants={list} />
}
