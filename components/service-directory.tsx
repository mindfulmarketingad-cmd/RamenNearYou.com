import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { SERVICE_PAGES } from '@/lib/city-filter-pages'

const BLURB: Record<string, string> = {
  Tonkotsu: 'Rich, creamy pork-bone broth',
  Spicy: 'Bold, chili-forward heat',
  Miso: 'Hearty fermented soybean broth',
  Shoyu: 'Clear, classic soy-seasoned broth',
  Vegan: 'Plant-based bowls, full umami',
  Vegetarian: 'Meat-free, veggie-forward',
  Korean: 'Ramyeon-inspired & kimchi broths',
  Japanese: 'Authentic regional styles',
}

export default function ServiceDirectory() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-sunken border-t border-line/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-brand-ink text-xs font-medium uppercase tracking-widest mb-2">Browse by Style</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">
          Find Ramen by Broth &amp; Style
        </h2>
        <p className="text-ink-soft text-sm sm:text-base max-w-xl leading-relaxed mb-10">
          From rich tonkotsu to plant-based bowls — explore every style of ramen near you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SERVICE_PAGES.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-center justify-between gap-3 px-5 py-4 rounded-none bg-surface border border-line/5 hover:border-brand/40 transition-colors"
            >
              <span>
                <span className="block text-ink font-semibold text-sm group-hover:text-brand-ink transition-colors">
                  {s.label} Near Me
                </span>
                <span className="block text-ink-soft text-xs mt-0.5">{BLURB[s.broth]}</span>
              </span>
              <ChevronRight className="w-4 h-4 text-brand-ink/50 group-hover:text-brand-ink shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
