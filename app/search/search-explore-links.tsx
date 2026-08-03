import Link from 'next/link'
import { getCities } from '@/lib/restaurants'
import { getPhoStats, getPhoCities, phoCityParam } from '@/lib/pho'
import { getCityListicleEntries } from '@/lib/city-listicles'

// Internal-link hub for /search. The landing page is the only indexable state
// (query permutations are noindex), so without this it's a dead end for both
// crawlers and anyone who'd rather browse than type. Everything here is built
// from live data so the links can't drift out of sync with what we actually
// have pages for.

const BROTH_STYLES = [
  { href: '/find/tonkotsu-ramen', label: 'Tonkotsu' },
  { href: '/find/miso-ramen', label: 'Miso' },
  { href: '/find/shoyu-ramen', label: 'Shoyu' },
  { href: '/find/shio-ramen', label: 'Shio' },
  { href: '/find/spicy-ramen', label: 'Spicy' },
  { href: '/find/tsukemen', label: 'Tsukemen' },
  { href: '/find/vegan-ramen', label: 'Vegan' },
  { href: '/find/vegetarian-ramen', label: 'Vegetarian' },
  { href: '/find/chicken-ramen', label: 'Chicken' },
  { href: '/find/light-ramen', label: 'Light & clean' },
]

const WHEN_WHERE = [
  { href: '/find/ramen-open-now', label: 'Open now' },
  { href: '/find/ramen-open-late', label: 'Open late' },
  { href: '/find/ramen-delivery', label: 'Delivery' },
  { href: '/find/ramen-takeout', label: 'Takeout' },
  { href: '/find/ramen-reservations', label: 'Takes reservations' },
  { href: '/find/ramen-family-friendly', label: 'Family friendly' },
  { href: '/find/cheap-ramen', label: 'Under $15' },
  { href: '/find/ramen-hidden-gems', label: 'Hidden gems' },
  { href: '/find/top-rated-ramen', label: 'Top rated' },
  { href: '/find/pho-restaurants', label: 'Pho restaurants' },
]

const GUIDES = [
  { href: '/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen', label: 'The 4 types of ramen, explained' },
  { href: '/blog/what-are-ramen-noodles-made-of', label: 'What are ramen noodles made of?' },
  { href: '/blog/how-to-eat-ramen-noodles-the-right-way', label: 'How to eat ramen the right way' },
  { href: '/blog/is-ramen-healthier-than-pasta', label: 'Is ramen healthier than pasta?' },
  { href: '/blog/what-are-the-healthiest-noodles-you-can-eat', label: 'The healthiest noodles you can eat' },
  { href: '/blog/best-ramen-for-diabetics', label: 'Is ramen good for diabetics?' },
  { href: '/blog/ramen-vs-udon-whats-the-difference', label: 'Ramen vs. udon' },
  { href: '/blog/are-pho-and-ramen-the-same', label: 'Are pho and ramen the same?' },
  { href: '/blog/what-is-pho-made-of', label: 'What is pho made of?' },
  { href: '/blog/how-long-does-ramen-last-in-the-fridge', label: 'How long does ramen last in the fridge?' },
]

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#96602F] mb-3">{title}</h3>
      {children}
    </div>
  )
}

function Chips({ items, accent = false }: { items: { href: string; label: string }[]; accent?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(i => (
        <Link
          key={i.href}
          href={i.href}
          className={`px-3 py-1.5 rounded-full bg-white border text-xs transition-colors ${
            accent
              ? 'border-[#16a34a]/25 text-[#16a34a] hover:border-[#16a34a]/60'
              : 'border-black/8 text-[#3F3D39] hover:border-[#B57F50]/50 hover:text-[#96602F]'
          }`}
        >
          {i.label}
        </Link>
      ))}
    </div>
  )
}

function Links({ items }: { items: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map(i => (
        <li key={i.href}>
          <Link href={i.href} className="text-sm text-[#3F3D39] hover:text-[#96602F] hover:underline">
            {i.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function SearchExploreLinks() {
  const topCities = getCities().slice(0, 18)
  const phoStats = getPhoStats()
  const topPhoCities = getPhoCities().slice(0, 8)
  const topListicles = getCityListicleEntries().slice(0, 10)

  return (
    <section aria-label="Browse the site" className="border-t border-black/8 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-1">Or just browse</h2>
        <p className="text-[#6B6862] text-sm mb-10">
          Every one of these is a live page — no search required.
        </p>

        <div className="space-y-10">
          <Group title="By broth &amp; style">
            <Chips items={BROTH_STYLES} />
          </Group>

          <Group title="By hours, price &amp; features">
            <Chips items={WHEN_WHERE} />
          </Group>

          <Group title="Ramen by city">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {topCities.map(c => (
                <Link
                  key={`${c.citySlug}-${c.stateCode}`}
                  href={`/find/${c.citySlug}-${c.stateCode.toLowerCase()}`}
                  className="text-sm text-[#3F3D39] hover:text-[#96602F] hover:underline"
                >
                  {c.city}, {c.stateCode}
                </Link>
              ))}
              <Link href="/cities" className="text-sm font-semibold text-[#96602F] hover:underline">
                All cities →
              </Link>
            </div>
          </Group>

          {topListicles.length > 0 && (
            <Group title="Best ramen roundups">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {topListicles.map(l => (
                  <Link key={l.href} href={l.href} className="text-sm text-[#3F3D39] hover:text-[#96602F] hover:underline">
                    {l.label.replace('5 Best Ramen Restaurants in ', '')}
                  </Link>
                ))}
                <Link href="/blog" className="text-sm font-semibold text-[#96602F] hover:underline">
                  All guides →
                </Link>
              </div>
            </Group>
          )}

          {topPhoCities.length > 0 && (
            <Group title={`Pho — ${phoStats.restaurants} listings in ${phoStats.cities} cities`}>
              <Chips
                accent
                items={[
                  ...topPhoCities.map(c => ({
                    href: `/find/${phoCityParam(c.citySlug, c.stateCode)}`,
                    label: `${c.city}, ${c.stateCode}`,
                  })),
                  { href: '/partners', label: 'All pho listings' },
                ]}
              />
            </Group>
          )}

          <div className="grid sm:grid-cols-2 gap-10">
            <Group title="Guides &amp; explainers">
              <Links items={GUIDES} />
            </Group>

            <Group title="Elsewhere on the site">
              <Links
                items={[
                  { href: '/find', label: 'Full ramen search map' },
                  { href: '/cities', label: 'Browse every city & state' },
                  { href: '/reviews', label: 'Restaurant reviews' },
                  { href: '/recipes', label: 'Ramen recipes' },
                  { href: '/blog', label: 'The blog' },
                  { href: '/partners', label: 'Partner restaurants' },
                  { href: '/broth', label: 'Browse by broth type' },
                  { href: '/comparisons', label: 'Broth comparisons' },
                  { href: '/faq', label: 'Frequently asked questions' },
                  { href: '/featured-listing', label: 'Get your restaurant featured' },
                ]}
              />
            </Group>
          </div>
        </div>
      </div>
    </section>
  )
}
