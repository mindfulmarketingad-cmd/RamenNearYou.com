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
      '/images/products/stainless-steel-chopsticks.jpg',
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
  {
    slug: 'sakura-chopsticks',
    name: 'Sakura Stainless Steel Chopsticks (5 Pairs)',
    tagline: "Japanese cherry blossom design meets food-grade steel — beautiful, practical, and built to last.",
    description:
      'Five pairs of food-grade 304 stainless steel chopsticks with a permanent laser-engraved sakura (cherry blossom) pattern. Lightweight, non-slip square body, dishwasher safe, and packaged in an elegant gift box.',
    rating: 4.6,
    reviewCount: 8423,
    images: [
      '/images/products/sakura-chopsticks.jpg',
    ],
    affiliateUrl: 'https://amzn.to/4oeNrRh',
    badge: 'Top Rated',
    category: 'Ramen Accessories',
    metaTitle: 'Sakura Stainless Steel Chopsticks 5 Pairs | Japanese Cherry Blossom Design',
    metaDescription:
      'Food-grade 304 stainless steel chopsticks with laser-engraved sakura pattern. Non-slip, dishwasher safe, 5 pairs. Perfect gift for ramen lovers.',
    features: [
      {
        icon: '🌸',
        title: 'Permanent Sakura Pattern',
        description:
          'Laser-engraved cherry blossom design that never fades or peels — unlike painted or printed chopsticks that wear off with washing.',
      },
      {
        icon: '🛡️',
        title: 'Food-Grade 304 Stainless Steel',
        description:
          'Made from 18/8 stainless steel — the same material used in premium flatware. Rust-proof, hygienic, and built to last for years.',
      },
      {
        icon: '✋',
        title: 'Non-Slip Square Design',
        description:
          'Square profile is easy to hold and won\'t roll off the table. Etched tip grips noodles, tofu, and vegetables with precision — great for beginners too.',
      },
      {
        icon: '🧼',
        title: 'Dishwasher Safe',
        description:
          'Solid stainless construction means no hidden pores where bacteria can hide. Toss them in the dishwasher or rinse by hand — no special care needed.',
      },
      {
        icon: '🎁',
        title: 'Elegant Gift Set',
        description:
          'Five pairs in a beautiful gift box. An ideal present for Christmas, birthdays, anniversaries, or anyone who loves Japanese cuisine.',
      },
    ],
    specs: [
      { label: 'Material', value: '304 (18/8) Stainless Steel' },
      { label: 'Quantity', value: '5 Pairs (10 chopsticks)' },
      { label: 'Pattern', value: 'Laser-engraved Sakura (permanent)' },
      { label: 'Body Shape', value: 'Square (anti-roll)' },
      { label: 'Dishwasher Safe', value: 'Yes' },
      { label: 'Gift Box Included', value: 'Yes' },
    ],
  },
  {
    slug: 'japanese-ramen-bowl-set',
    name: 'Japanese Ceramic Ramen Bowl Set (2 Bowls + Spoons + Chopsticks)',
    tagline: "Restaurant-quality ceramic, kiln-fired glazes, and a complete dining set — everything you need for the perfect bowl.",
    description:
      'Two large 40 oz ceramic ramen bowls with authentic Japanese kiln-transmutation glazes, paired with wooden spoons and chopsticks. Lead-free, cadmium-free, microwave and dishwasher safe — a beautiful set for home or gifting.',
    rating: 4.7,
    reviewCount: 6214,
    images: [
      '/images/products/ramen-bowl-set.jpg',
    ],
    affiliateUrl: 'https://amzn.to/4ecu0nB',
    badge: 'Staff Pick',
    category: 'Ramen Bowls',
    metaTitle: 'Japanese Ceramic Ramen Bowl Set | 40oz Bowls with Spoons & Chopsticks',
    metaDescription:
      'Lead-free ceramic ramen bowls with kiln-fired glazes. 40oz capacity, microwave & dishwasher safe. Set of 2 bowls, spoons, and chopsticks — perfect for ramen at home.',
    features: [
      {
        icon: '🏺',
        title: 'Kiln Transmutation Glaze',
        description:
          'Each bowl is fired using advanced kiln transmutation technology — carefully controlling temperature and humidity to create stunning multi-color glazes. Every bowl is subtly one-of-a-kind.',
      },
      {
        icon: '🛡️',
        title: 'Lead-Free & Cadmium-Free Ceramic',
        description:
          'Non-porous surface resists food odors, stains, and bacteria. No toxic chemicals leaching into your food — a safer, healthier choice than melamine alternatives.',
      },
      {
        icon: '🍜',
        title: 'Authentic Japanese Style',
        description:
          'Traditional Japanese design elevates any Asian-inspired dish — ramen, pho, udon, salads, soups, dumplings, and more. The 8-inch diameter and 40 oz capacity hold generous portions without spilling.',
      },
      {
        icon: '🔥',
        title: 'Microwave, Oven & Dishwasher Safe',
        description:
          'Versatile enough for everyday use. Microwave, oven, freezer, and dishwasher safe — go from prep to table to cleanup without any fuss.',
      },
      {
        icon: '🎁',
        title: 'Complete Dining Set',
        description:
          'Includes 2 ceramic bowls, 2 wooden spoons, and 2 pairs of chopsticks, beautifully packaged. An ideal gift for housewarmings, weddings, birthdays, or holidays.',
      },
    ],
    specs: [
      { label: 'Material', value: 'Lead-free, Cadmium-free Ceramic' },
      { label: 'Quantity', value: '2 Bowls, 2 Spoons, 2 Pairs Chopsticks' },
      { label: 'Capacity', value: '40 oz per bowl' },
      { label: 'Diameter', value: '8 inches' },
      { label: 'Microwave Safe', value: 'Yes' },
      { label: 'Dishwasher Safe', value: 'Yes' },
      { label: 'Oven Safe', value: 'Yes' },
      { label: 'Freezer Safe', value: 'Yes' },
    ],
  },
]

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}
