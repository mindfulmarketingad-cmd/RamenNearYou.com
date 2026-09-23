import type { Restaurant } from './restaurants'

const BROTH_KEYWORDS: { label: string; terms: string[] }[] = [
  { label: 'tonkotsu', terms: ['tonkotsu','pork bone broth','hakata ramen','hakata style','jinya ramen','tatsu-ya','tatsuya ramen','ramen tatsu'] },
  { label: 'tsukemen', terms: ['tsukemen','dipping ramen','dipping noodle','okiboru'] },
  { label: 'miso', terms: ['miso ramen','miso broth','miso soup','miso base','moonlight miso','sapporo ramen','sapporo style','red miso','white miso','miso tare','miso'] },
  { label: 'shoyu', terms: ['shoyu','soy sauce broth','soy broth','tokyo ramen','tokyo style','tokyo-style','shoyu tare','soy-based'] },
  { label: 'shio', terms: ['shio','salt broth','shio tare','salt-based ramen','clear broth ramen','shio ramen'] },
  { label: 'chicken', terms: ['tori paitan','chicken broth','chicken ramen','chicken-based','tori ramen','paitan','kin notori','kin no tori','chicken bone broth','poultry broth'] },
  { label: 'spicy', terms: ['spicy','tantanmen','volcano','chili ramen','fire ramen','spicy miso'] },
]

const BROTH_PROSE: Record<string, string> = {
  tonkotsu: 'The kitchen is known for its tonkotsu broth — a rich, milky pork bone stock that simmers for hours until it develops that signature deep, creamy umami flavor. Tonkotsu fans know that great ramen starts with great bones, and the commitment to long-simmered stock shows in every bowl. Topped with chashu pork, soft-boiled eggs, and thin straight noodles, a classic tonkotsu bowl here is a benchmark for the style.',
  tsukemen: 'The specialty here is tsukemen — a dipping-style ramen where thick, chewy noodles are served separately from a concentrated, intensely flavored dipping broth. Diners dip each bite into the deep, rich broth rather than submerging the noodles, which lets you control the broth-to-noodle ratio with every mouthful. It\'s a uniquely interactive way to eat ramen, and one that rewards slow, intentional dining.',
  miso: 'Miso ramen is the star of the menu — hearty, warming bowls built on a bold fermented soybean paste base that adds depth, earthiness, and a gentle sweetness. The kitchen typically blends red and white miso for a balanced flavor profile, then enriches the broth with aromatics, garlic, and toasted sesame. Topped with corn, butter, and thick-cut chashu, the bowls here lean into classic Hokkaido-style tradition.',
  shoyu: 'The house specialty is shoyu ramen — a clear, amber-tinted soy sauce-seasoned broth that represents the original Tokyo style. Light yet deeply savory, the broth is carefully crafted from chicken and dashi stock, seasoned with a house tare that balances salt, sweetness, and umami. Served with wavy noodles, sliced chashu, and bamboo shoots, it\'s an approachable and satisfying bowl that works for both ramen newcomers and seasoned enthusiasts.',
  shio: 'The specialty is shio ramen — a light, delicate salt-based broth that is often considered the most refined of all ramen styles. The clear golden broth showcases the quality of the underlying stock: clean, nuanced, and deeply savory without the weight of a pork or soy-heavy base. Shio ramen demands excellent technique and high-quality ingredients, and the results speak for themselves.',
  chicken: 'The kitchen focuses on tori paitan — a creamy, opaque chicken bone broth that offers all the richness of tonkotsu with a lighter, cleaner flavor profile. Long-simmered chicken bones create a silky, collagen-rich stock that is then seasoned with a house tare and finished with aromatics. It\'s a style that has gained a devoted following for being indulgent but not overpowering.',
  spicy: 'Spice lovers will find plenty to love here — the menu features bold, heat-forward bowls that range from a gentle tingle to full-on fire. Think tantanmen-style broths loaded with chili oil and ground sesame, or volcanic ramen topped with blazing-hot chili pastes and pickled peppers. The heat is always balanced against a deep, satisfying broth base, so you never sacrifice flavor for burn.',
}

const GENERIC_BROTH = 'The menu covers a range of ramen styles, from rich tonkotsu and earthy miso to clean shoyu and delicate shio broths. Whether you prefer a creamy, opaque broth or a clear, savory one, there\'s a bowl to suit every palate. The noodles are cooked to order, and toppings — including chashu pork, soft-boiled eggs, nori, and bamboo shoots — complete each bowl with thoughtful balance.'

export function detectBrothType(r: Restaurant): string | null {
  const text = `${r.name} ${r.description ?? ''} ${r.subtypes ?? ''}`.toLowerCase()
  const name = r.name.toLowerCase()
  if (name.includes('jinya ramen') || name.includes('tatsu-ya') || name.includes('ramen tatsu')) return 'tonkotsu'
  if (name.includes('okiboru')) return 'tsukemen'
  if (name.includes('moonlight miso')) return 'miso'
  for (const { label, terms } of BROTH_KEYWORDS) {
    if (terms.some(t => text.includes(t))) return label
  }
  return null
}

// Simple hash from string for stable variation
function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

export function expandDescription(r: Restaurant): string {
  const existing = r.description?.trim() ?? ''
  const wordCount = existing ? existing.split(/\s+/).length : 0
  if (wordCount >= 300) return existing

  const hash = hashStr(r.slug)
  const brothType = detectBrothType(r)
  const brothParagraph = brothType && BROTH_PROSE[brothType] ? BROTH_PROSE[brothType] : GENERIC_BROTH

  // Amenities sentences
  const amenityParts: string[] = []
  if (r.amenities.dineIn)               amenityParts.push('dine-in seating')
  if (r.amenities.takeout)              amenityParts.push('takeout')
  if (r.amenities.delivery)             amenityParts.push('delivery')
  if (r.amenities.outdoorSeating)       amenityParts.push('outdoor seating')
  if (r.amenities.acceptsReservations)  amenityParts.push('reservations')
  if (r.amenities.alcohol)              amenityParts.push('a full bar')
  if (r.amenities.parking)              amenityParts.push('on-site parking')

  const amenitySentence = amenityParts.length > 0
    ? `${r.name} offers ${amenityParts.slice(0, -1).join(', ')}${amenityParts.length > 1 ? ' and ' : ''}${amenityParts[amenityParts.length - 1]}, making it easy to enjoy a great bowl however works best for you.`
    : `${r.name} is conveniently located in ${r.city}, ${r.stateCode} and welcomes guests looking for a satisfying ramen experience.`

  const veganSentence = (r.amenities.veganOptions || r.amenities.vegetarianOptions)
    ? `The menu also includes ${r.amenities.veganOptions ? 'vegan' : ''}${r.amenities.veganOptions && r.amenities.vegetarianOptions ? ' and ' : ''}${r.amenities.vegetarianOptions ? 'vegetarian' : ''} options, so everyone at the table can find something delicious.`
    : ''

  const ratingSentence = r.rating && r.reviewCount > 0
    ? `${r.name} has earned a ${r.rating.toFixed(1)}-star rating from ${r.reviewCount.toLocaleString()} reviews, reflecting a consistent track record of quality and hospitality. Guests frequently highlight the depth of the broth, the quality of the toppings, and the welcoming atmosphere as standout elements of the experience.`
    : `${r.name} has built a loyal following in ${r.city} thanks to its commitment to quality ingredients and carefully crafted broths.`

  const priceSentence = r.priceRange
    ? pick([
        `With a price range of ${r.priceRange}, it offers solid value for a sit-down ramen experience.`,
        `Priced at ${r.priceRange}, the restaurant hits a sweet spot between quality and accessibility.`,
        `At ${r.priceRange}, it's an approachable option for both a casual weeknight bowl and a more intentional ramen outing.`,
      ], hash)
    : 'Pricing is reasonable for the quality and portion size you receive.'

  const locationIntros = [
    `${r.name} is a ramen restaurant located in ${r.city}, ${r.stateCode}.`,
    `Situated in ${r.city}, ${r.stateCode}, ${r.name} has become a go-to destination for ramen lovers in the area.`,
    `In the heart of ${r.city}, ${r.stateCode}, ${r.name} serves up some of the most satisfying ramen bowls in the region.`,
    `${r.name} brings serious ramen craftsmanship to ${r.city}, ${r.stateCode}, offering a menu built around quality broths and fresh ingredients.`,
  ]

  const closingParas = [
    `Whether you're a longtime ramen devotee or just discovering the world of Japanese noodle soups, ${r.name} is well worth a visit. The combination of thoughtfully crafted broths, quality toppings, and genuine hospitality makes it a standout in the ${r.city} dining scene. Come hungry, come curious, and expect to leave satisfied.`,
    `If you're searching for great ramen in ${r.city}, ${r.stateCode}, ${r.name} is a strong contender. The attention to detail in every bowl — from the broth to the noodle cook time to the toppings — reflects a kitchen that takes ramen seriously. It's the kind of place you'll want to return to, trying a different bowl each time.`,
    `${r.name} is the kind of ramen spot that earns repeat visits. The menu rewards exploration, and the kitchen's commitment to the craft is evident in every bowl that comes out. For anyone in ${r.city} craving a proper ramen experience, this is a place to know.`,
  ]

  const intro = pick(locationIntros, hash)
  const closing = pick(closingParas, hash + 1)

  // Build paragraphs
  const paragraphs: string[] = []

  if (existing) {
    paragraphs.push(existing)
  } else {
    paragraphs.push(intro)
  }

  paragraphs.push(brothParagraph)
  paragraphs.push(ratingSentence + (priceSentence ? ' ' + priceSentence : ''))

  const practicalParts = [amenitySentence, veganSentence].filter(Boolean).join(' ')
  if (practicalParts) paragraphs.push(practicalParts)

  paragraphs.push(closing)

  const full = paragraphs.join('\n\n')
  return full
}
