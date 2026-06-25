import Link from 'next/link'

// Canonical "ramen by broth/style near you" landing pages. Surfaced on
// high-impression state and city pages to funnel internal-link authority to
// the dedicated near-me pages — which (per Search Console) earn big impressions
// for "{broth} ramen near me" queries but were barely internally linked.
const BROTH_STYLE_LINKS = [
  { href: '/tonkotsu-ramen-near-me', label: 'Tonkotsu Ramen', emoji: '🍜' },
  { href: '/shoyu-ramen-near-me', label: 'Shoyu Ramen', emoji: '🍶' },
  { href: '/miso-ramen-near-me', label: 'Miso Ramen', emoji: '🥣' },
  { href: '/shio-ramen-near-me', label: 'Shio Ramen', emoji: '🧂' },
  { href: '/spicy-ramen-near-me', label: 'Spicy Ramen', emoji: '🌶️' },
  { href: '/vegan-ramen-near-me', label: 'Vegan Ramen', emoji: '🌱' },
  { href: '/vegetarian-ramen-near-me', label: 'Vegetarian Ramen', emoji: '🥬' },
  { href: '/japanese-ramen-near-me', label: 'Japanese Ramen', emoji: '🇯🇵' },
  { href: '/korean-ramen-near-me', label: 'Korean Ramen', emoji: '🇰🇷' },
]

interface Props {
  /** Optional place name to make the heading/intro contextual (e.g. a state). */
  place?: string
}

export default function BrothStyleLinks({ place }: Props) {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-black/5 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">
          Find Ramen by Broth &amp; Style Near You
        </h2>
        <p className="text-[#6B6862] text-sm mb-8">
          {place
            ? `Craving a specific bowl in ${place}? Jump straight to the broth or style you want, ranked by rating with maps and hours.`
            : 'Craving a specific bowl? Jump straight to the broth or style you want, ranked by rating with maps and hours.'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-0 border-t border-l border-black/10">
          {BROTH_STYLE_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-2.5 px-5 py-4 border-b border-r border-black/10 hover:bg-white transition-colors group"
            >
              <span aria-hidden className="text-base">{l.emoji}</span>
              <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#B57F50] transition-colors">
                {l.label} Near Me
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
