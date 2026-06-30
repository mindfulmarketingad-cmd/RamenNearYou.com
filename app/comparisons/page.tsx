import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, ArrowRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getAllComparisons, BROTHS, BROTH_ORDER } from '@/lib/broth-comparisons'

export const metadata: Metadata = {
  title: 'Ramen Broth Comparisons | Tonkotsu vs. Miso vs. Shoyu & More',
  description:
    'Side-by-side guides to every major ramen broth type — tonkotsu, shoyu, miso, shio, spicy and vegan. Learn how the broth, seasoning, noodles and toppings differ, and which to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/comparisons' },
}

export default function ComparisonsIndexPage() {
  const comparisons = getAllComparisons()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap pt-2">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Comparisons</span>
          </nav>

          <header className="text-center mb-12">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Know The Difference</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
              Ramen Broth Comparisons
            </h1>
            <p className="text-[#6B6862] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Tonkotsu, shoyu, miso, shio, spicy or vegan — every broth tells a different story. These
              side-by-side guides break down how each style differs in broth, seasoning, noodles and
              toppings, so you always know exactly what to order.
            </p>
          </header>

          {/* Broth type quick links */}
          <section className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">Explore by broth type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BROTH_ORDER.map((key) => {
                const b = BROTHS[key]
                return (
                  <Link
                    key={key}
                    href={b.nearMePath}
                    className="block p-4 rounded-xl border border-black/5 bg-white hover:border-[#B57F50]/40 transition-colors"
                  >
                    <p className="text-base font-semibold text-[#1E2026] mb-1">{b.name}</p>
                    <p className="text-[#6B6862] text-xs leading-snug">{b.tagline}</p>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* All comparisons */}
          <section>
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">All comparisons</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comparisons.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/comparisons/${c.slug}`}
                    className="group flex items-center justify-between gap-3 bg-white rounded-xl border border-black/5 p-5 hover:border-[#B57F50]/40 transition-colors"
                  >
                    <span className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors">
                      {c.a.name} vs. {c.b.name} Ramen
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#B57F50] shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
