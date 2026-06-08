export interface ProductFeature {
  icon: string
  title: string
  description: string
}

export interface Product {
  slug: string
  name: string
  tagline: string
  description: string
  price: string
  originalPrice?: string
  rating: number
  reviewCount: number
  images: string[]
  affiliateUrl: string
  features: ProductFeature[]
  specs: { label: string; value: string }[]
  badge?: string
  category: string
  metaTitle: string
  metaDescription: string
}

export const products: Product[] = [
  {
    slug: 'stainless-steel-chopsticks',
    name: 'Stainless Steel Chopsticks (5 Pairs)',
    tagline: "Reusable, dishwasher-safe, laser-engraved — the last chopsticks you'll ever need.",
    description:
      'Upgrade your ramen nights with these food-grade 304 stainless steel chopsticks. Five uniquely engraved pairs so every family member gets their own set. Non-slip square body, anti-slip etched tip, and fully dishwasher safe.',
    price: '$14.99',
    originalPrice: '$19.99',
    rating: 4.5,
    reviewCount: 12847,
    images: [
      'https://m.media-amazon.com/images/I/71YoW3FMblL._AC_SL1000_.jpg',
      'https://m.media-amazon.com/images/I/71YoW3FMblL._AC_SL1000_.jpg',
    ],
    affiliateUrl: 'https://amzn.to/4odbos2',
    badge: 'Best Seller',
    category: 'Ramen Accessories',
    metaTitle: 'Stainless Steel Chopsticks 5 Pairs | Reusable & Dishwasher Safe',
    metaDescription:
      'Food-grade 304 stainless steel chopsticks with laser-engraved patterns. Non-slip, dishwasher safe, 5 pairs per set. Perfect for ramen at home.',
    features: [
      {
        icon: '🛡️',
        title: 'Food-Grade 304 Stainless Steel',
        description:
          'Made from 18/8 stainless steel — the same material used in high-quality flatware. Rust-proof, durable, and weighing 33g per pair for a solid, premium feel.',
      },
      {
        icon: '✨',
        title: 'Unique Laser-Engraved Patterns',
        description:
          'Each of the 5 pairs features a different permanent laser-engraved design. Patterns never fade, and each family member can claim their own pair.',
      },
      {
        icon: '✋',
        title: 'Non-Slip Square Body',
        description:
          'Square profile prevents rolling on the table and feels natural in the hand. Reinforced etching at the tip gives extra grip when picking up noodles and toppings.',
      },
      {
        icon: '🧼',
        title: 'Dishwasher Safe & Easy to Clean',
        description:
          'Solid stainless construction means no hidden pores to trap bacteria or food residue — unlike wood or bamboo. Toss them in the dishwasher and they come out spotless.',
      },
      {
        icon: '♻️',
        title: 'Reusable & Indestructible',
        description:
          'No splintering, no warping, no mold. These chopsticks handle every temperature from boiling broth to the dishwasher cycle without degrading.',
      },
    ],
    specs: [
      { label: 'Material', value: '304 (18/8) Stainless Steel' },
      { label: 'Quantity', value: '5 Pairs (10 chopsticks)' },
      { label: 'Weight', value: '33g per pair' },
      { label: 'Body Shape', value: 'Square (anti-roll)' },
      { label: 'Pattern', value: 'Laser-engraved (permanent, 5 unique designs)' },
      { label: 'Dishwasher Safe', value: 'Yes' },
      { label: 'Gift Box Included', value: 'Yes' },
    ],
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
