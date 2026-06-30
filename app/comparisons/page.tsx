import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ComparisonsSearch from './comparisons-search'
import { getAllComparisons, BROTHS, BROTH_ORDER } from '@/lib/broth-comparisons'

export const metadata: Metadata = {
  title: 'Ramen Broth Comparisons | Tonkotsu vs. Miso vs. Shoyu & More',
  description:
    'Side-by-side guides to every major ramen broth type — tonkotsu, shoyu, miso, shio, spicy and vegan. Learn how the broth, seasoning, noodles and toppings differ, and which to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/comparisons' },
}

// Group every comparison under its lead broth, so each matchup appears once in
// a simple, organized list (mirrors the /find hub format).
function getCategories() {
  const all = getAllComparisons()
  return BROTH_ORDER.map((key) => ({
    heading: `${BROTHS[key].name} Ramen`,
    pages: all
      .filter((c) => c.a.key === key)
      .map((c) => ({ href: `/comparisons/${c.slug}`, label: `${c.a.name} vs. ${c.b.name} Ramen` })),
  })).filter((cat) => cat.pages.length > 0)
}

export default function ComparisonsIndexPage() {
  const categories = getCategories()

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Ramen Broth Comparisons</h1>
        <p className="text-[#6B6862] text-sm mb-8">
          Tonkotsu, shoyu, miso, shio, spicy or vegan — compare any two broth types side by side and
          know exactly what to order.
        </p>

        <ComparisonsSearch categories={categories} />
      </div>
      <Footer />
    </main>
  )
}
