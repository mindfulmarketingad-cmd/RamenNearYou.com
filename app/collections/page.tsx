import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CollectionsSearch from './collections-search'

export const metadata: Metadata = {
  title: 'Ramen Collections | Bowls, Cookers & Accessories',
  description:
    'Shop our hand-picked ramen collections — ceramic bowls, electric ramen cookers and more. Everything you need to enjoy ramen at home.',
  alternates: { canonical: 'https://www.ramennearyou.com/collections' },
}

const COLLECTIONS = [
  {
    heading: 'Bowls',
    pages: [
      { href: '/collections/ceramic-ramen-bowls', label: 'Ceramic Ramen Bowls' },
    ],
  },
  {
    heading: 'Cooking',
    pages: [
      { href: '/collections/ramen-cookers', label: 'Ramen Cookers' },
    ],
  },
]

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="pt-24 pb-16 max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Collections</h1>
        <p className="text-[#6B6862] text-sm mb-8">
          Hand-picked ramen gear — bowls, cookers and accessories for eating ramen at home.
        </p>

        <CollectionsSearch collections={COLLECTIONS} />
      </div>
      <Footer />
    </main>
  )
}
