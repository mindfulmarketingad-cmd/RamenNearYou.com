export type AffiliateProduct = {
  id: string
  name: string
  image: string
  affiliateUrl: string
  badge?: string
  tags?: string[]
}

export const ceramicRamenBowls: AffiliateProduct[] = [
  {
    id: 'ceramic-set-1',
    name: 'Ceramic Ramen Bowl Set of 2',
    image: 'https://m.media-amazon.com/images/I/81TftH6jeQL._AC_SL1500_.jpg',
    affiliateUrl: 'https://amzn.to/3QH3tH5',
    badge: 'Popular Pick',
    tags: ['Set of 2', 'Ceramic'],
  },
  {
    id: 'ceramic-set-2',
    name: 'Ceramic Ramen Bowl Set of 2',
    image: 'https://m.media-amazon.com/images/I/81wqiCi4lYL._AC_SL1500_.jpg',
    affiliateUrl: 'https://amzn.to/4vOp8vN',
    tags: ['Set of 2', 'Ceramic'],
  },
]
