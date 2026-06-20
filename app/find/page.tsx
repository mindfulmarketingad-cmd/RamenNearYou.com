import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CAPITAL_CITIES } from '@/lib/capital-cities'

export const metadata: Metadata = {
  title: 'Find Ramen Near Me | Browse by Filter | RamenNearYou',
  description: 'Find ramen restaurants near you filtered by what matters — open late, open now, tonkotsu, vegan, spicy, and more.',
  alternates: { canonical: 'https://www.ramennearyou.com/find' },
}

const CATEGORIES = [
  {
    heading: 'By Hours',
    pages: [
      { href: '/find/ramen-open-now', label: 'Ramen Open Now Near Me' },
      { href: '/find/ramen-open-late', label: 'Ramen Open Late Near Me' },
      { href: '/find/ramen-lunch', label: 'Ramen for Lunch Near Me' },
    ],
  },
  {
    heading: 'By Broth',
    pages: [
      { href: '/find/tonkotsu-ramen', label: 'Tonkotsu Ramen Near Me' },
      { href: '/find/miso-ramen', label: 'Miso Ramen Near Me' },
      { href: '/find/shoyu-ramen', label: 'Shoyu Ramen Near Me' },
      { href: '/find/shio-ramen', label: 'Shio Ramen Near Me' },
      { href: '/find/chicken-ramen', label: 'Chicken Ramen Near Me' },
      { href: '/find/beef-ramen', label: 'Beef Ramen Near Me' },
      { href: '/find/black-garlic-ramen', label: 'Black Garlic Ramen Near Me' },
    ],
  },
  {
    heading: 'By Style',
    pages: [
      { href: '/find/tsukemen', label: 'Tsukemen Near Me' },
      { href: '/find/mazemen', label: 'Mazemen Near Me' },
      { href: '/find/tantanmen', label: 'Tantanmen Near Me' },
      { href: '/find/thick-noodle-ramen', label: 'Thick Noodle Ramen Near Me' },
      { href: '/find/thin-noodle-ramen', label: 'Thin Noodle Ramen Near Me' },
      { href: '/find/rich-ramen', label: 'Rich & Creamy Ramen Near Me' },
      { href: '/find/light-ramen', label: 'Light & Clean Ramen Near Me' },
    ],
  },
  {
    heading: 'By Spice',
    pages: [
      { href: '/find/spicy-ramen', label: 'Spicy Ramen Near Me' },
      { href: '/find/extra-spicy-ramen', label: 'Extra Spicy Ramen Near Me' },
    ],
  },
  {
    heading: 'By Diet & Price',
    pages: [
      { href: '/find/vegan-ramen', label: 'Vegan Ramen Near Me' },
      { href: '/find/cheap-ramen', label: 'Ramen Under $15 Near Me' },
    ],
  },
  {
    heading: 'By Occasion',
    pages: [
      { href: '/find/ramen-date-night', label: 'Date Night Ramen Near Me' },
      { href: '/find/ramen-bars', label: 'Ramen Bars Near Me' },
      { href: '/find/ramen-restaurants', label: 'Ramen Restaurants Near Me' },
    ],
  },
]

export default function FindHubPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Find Ramen Near Me</h1>
        <p className="text-[#6B6862] text-sm mb-10">
          Browse ramen restaurants filtered by what you need right now.
        </p>

        <div className="space-y-8">
          {CATEGORIES.map(cat => (
            <div key={cat.heading}>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
                {cat.heading}
              </h2>
              <ul className="space-y-1">
                {cat.pages.map(p => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="block text-sm text-[#1E2026] hover:text-[#B57F50] hover:underline py-1 transition-colors"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* State Capitals */}
          <div>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6862] mb-3">
              By State Capital
            </h2>
            <ul className="columns-2 sm:columns-3 gap-x-6 space-y-1">
              {CAPITAL_CITIES.map(c => (
                <li key={c.param} className="break-inside-avoid">
                  <Link
                    href={`/find/${c.param}`}
                    className="block text-sm text-[#1E2026] hover:text-[#B57F50] hover:underline py-1 transition-colors"
                  >
                    {c.city}, {c.stateCode}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
