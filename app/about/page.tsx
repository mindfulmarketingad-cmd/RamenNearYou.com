import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'
import { MapPin, Star, Utensils, Phone } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About RamenNearYou',
  description: 'Learn about RamenNearYou — the most trusted ramen restaurant directory in the United States. Find top-rated ramen near you by city, broth type, and more.',
  alternates: { canonical: 'https://www.ramennearyou.com/about' },
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-b border-black/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-5">
            The Ramen Directory Built for Ramen Lovers
          </h1>
          <p className="text-[#6B6862] text-lg leading-relaxed max-w-2xl mx-auto">
            RamenNearYou is the most comprehensive directory of ramen restaurants in the United States —
            helping food lovers find their perfect bowl, one city at a time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Our Mission</p>
              <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-4">
                Every city has great ramen. We help you find it.
              </h2>
              <p className="text-[#6B6862] leading-relaxed mb-4">
                Ramen is more than a meal — it&apos;s an experience. Whether you&apos;re chasing a perfectly rich tonkotsu
                broth, a spicy tantanmen that hits every note, or a vegan bowl that surprises you at every sip,
                the right bowl is out there.
              </p>
              <p className="text-[#6B6862] leading-relaxed">
                We built RamenNearYou to cut through the noise. No generic food blogs. No outdated lists.
                Just a clean, focused directory of real ramen restaurants — organized by city, broth type,
                amenities, and ratings — so you can find what you&apos;re looking for fast.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: 'Cities Covered', value: '100+' },
                { icon: Utensils, label: 'Restaurants Listed', value: '500+' },
                { icon: Star, label: 'Reviews Indexed', value: '50K+' },
                { icon: Phone, label: 'Catering Requests', value: 'Growing' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#F5F4F0] rounded-xl border border-black/5 p-5 text-center">
                  <Icon className="w-6 h-6 text-[#B57F50] mx-auto mb-2" />
                  <p className="text-[#1E2026] font-bold text-xl font-serif">{value}</p>
                  <p className="text-[#6B6862] text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-y border-black/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3 text-center">How It Works</p>
          <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-10 text-center">
            Finding great ramen near you is simple
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search by City or Broth',
                description: 'Browse our directory by city, or filter by broth type — tonkotsu, miso, shoyu, spicy, vegan, and more.',
              },
              {
                step: '02',
                title: 'Read Real Details',
                description: 'Each listing includes ratings, address, amenities, phone number, and the distance from your location.',
              },
              {
                step: '03',
                title: 'Find Your Bowl',
                description: 'Visit the restaurant and enjoy. Ramen owners can claim and update their listings for free.',
              },
            ].map(({ step, title, description }) => (
              <div key={step} className="flex flex-col gap-3">
                <span className="text-[#B57F50] font-serif text-4xl font-bold opacity-60">{step}</span>
                <h3 className="text-[#1E2026] font-semibold text-lg">{title}</h3>
                <p className="text-[#6B6862] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data disclaimer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Data &amp; Accuracy</p>
          <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-4">Our Data</h2>
          <p className="text-[#6B6862] leading-relaxed mb-4">
            Restaurant information on RamenNearYou is compiled from publicly available sources and verified
            owner submissions. We strive to keep listings accurate, but hours, menus, and contact details
            can change. We always recommend confirming directly with the restaurant before your visit.
          </p>
          <p className="text-[#6B6862] leading-relaxed">
            Restaurant owners can{' '}
            <Link href="/cities" className="text-[#B57F50] hover:underline">claim their listing</Link>
            {' '}to update their information, add photos, and keep their page current at no cost.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0] border-t border-black/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-4">Ready to find your next bowl?</h2>
          <p className="text-[#6B6862] mb-8">Browse ramen restaurants near you across the United States.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cities"
              className="px-6 py-3 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white font-medium text-sm transition-colors"
            >
              Browse by City
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg border border-black/8 hover:border-[#B57F50]/40 text-[#6B6862] hover:text-[#1E2026] font-medium text-sm transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
