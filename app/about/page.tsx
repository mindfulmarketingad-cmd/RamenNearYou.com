import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Star, Utensils, Phone } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About RamenNearYou',
  description: 'Meet John Jackson, the founder and author of RamenNearYou — the most trusted ramen restaurant directory in the United States. Find top-rated ramen near you by city, broth type, and more.',
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
            I built RamenNearYou to be the most comprehensive directory of ramen restaurants in the United States —
            helping food lovers like me find their perfect bowl, one city at a time.
          </p>
        </div>
      </section>

      {/* Meet the author */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative aspect-[3/2] rounded-2xl overflow-hidden border border-black/5 shadow-sm">
              <Image
                src="/images/john-jackson.jpg"
                alt="John Jackson, founder of RamenNearYou"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Meet the Author</p>
              <h2 className="font-serif text-3xl font-bold text-[#1E2026] mb-4">
                Hi, I&apos;m John Jackson
              </h2>
              <p className="text-[#6B6862] leading-relaxed mb-4">
                I&apos;m the founder and author behind RamenNearYou. My obsession with ramen started years ago,
                slurping my way through tiny shops and big-city institutions — and getting frustrated every time
                I landed in a new town and couldn&apos;t quickly find a great bowl.
              </p>
              <p className="text-[#6B6862] leading-relaxed">
                So I decided to build the resource I always wished existed. Everything you read on this site,
                I write and curate myself — from the city guides to the broth breakdowns to the recipes on the blog.
                If ramen is your thing too, you&apos;re in good company.
              </p>
            </div>
          </div>
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
                To me, ramen is more than a meal — it&apos;s an experience. Whether you&apos;re chasing a perfectly rich tonkotsu
                broth, a spicy tantanmen that hits every note, or a vegan bowl that surprises you at every sip,
                the right bowl is out there.
              </p>
              <p className="text-[#6B6862] leading-relaxed">
                I built RamenNearYou to cut through the noise. No generic food blogs. No outdated lists.
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
                description: 'Visit the restaurant and enjoy. Ramen owners can claim and manage their listings.',
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
            I compile restaurant information on RamenNearYou from publicly available sources and verified
            owner submissions. I work hard to keep listings accurate, but hours, menus, and contact details
            can change — so I always recommend confirming directly with the restaurant before your visit.
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
              className="px-6 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white font-medium text-sm transition-colors"
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
