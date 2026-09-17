import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ChevronRight, Check, Ticket } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AdSquare from '@/components/ad-square'
import AdVertical from '@/components/ad-vertical'
import { experiences, getExperience, experienceImage } from '@/lib/experiences'

interface Props {
  params: Promise<{ experience: string }>
}

export async function generateStaticParams() {
  return experiences.map((e) => ({ experience: e.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { experience: slug } = await params
  const e = getExperience(slug)
  if (!e) return {}
  const url = `https://www.ramennearyou.com/experiences/${slug}`
  return {
    title: e.metaTitle,
    description: e.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: e.metaTitle,
      description: e.metaDescription,
      url,
      images: [{ url: experienceImage(e), alt: e.name }],
    },
  }
}

export default async function ExperiencePage({ params }: Props) {
  const { experience: slug } = await params
  const e = getExperience(slug)
  if (!e) notFound()

  const url = `https://www.ramennearyou.com/experiences/${e.slug}`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: e.name,
    description: e.description,
    url,
    image: experienceImage(e),
    address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: e.country },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: e.rating,
      reviewCount: e.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="min-h-screen bg-[#ECEAE4]">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[#6B6862] mb-5">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/experiences" className="hover:text-[#1E2026] transition-colors">Experiences</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{e.city}</span>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] leading-tight mb-3">
            {e.name}
          </h1>

          <div className="flex items-center gap-2.5 flex-wrap mb-5">
            <span className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i <= Math.floor(e.rating) ? 'text-amber-400 fill-amber-400' : 'text-[#1E2026]/20'}`}
                />
              ))}
            </span>
            <span className="text-sm font-bold text-[#1E2026]">{e.rating.toFixed(1)}</span>
            <span className="text-sm text-[#6B6862]">{e.reviewCount.toLocaleString()} reviews</span>
            <span className="flex items-center gap-1 text-sm text-[#6B6862]">
              <MapPin className="w-3.5 h-3.5 shrink-0" /> {e.destination}
            </span>
          </div>

          <div className="relative w-full h-60 sm:h-80 rounded-2xl overflow-hidden mb-6 bg-[#F5F4F0]">
            <Image src={experienceImage(e)} alt={e.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority unoptimized />
          </div>

          {/* Booking card */}
          <div className="bg-white rounded-2xl border border-black/8 p-6 mb-6">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="text-xs text-[#6B6862] mb-0.5">{e.category}</p>
                <p className="font-serif text-2xl font-bold text-[#1E2026]">
                  From {e.priceFrom} <span className="text-sm font-sans font-normal text-[#6B6862]">per person</span>
                </p>
              </div>
              <a
                href={e.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
              >
                <Ticket className="w-4 h-4" /> Check Availability
              </a>
            </div>
            <ul className="space-y-2 pt-4 border-t border-black/8">
              {e.perks.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-[#1E2026]">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-black/8 p-6 sm:p-8 mb-6">
            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">About this experience</h2>
            <p className="text-[#3F3D39] text-[15px] leading-relaxed mb-6">{e.description}</p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">What you&apos;ll do</h2>
            <ul className="space-y-2.5">
              {e.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-[15px] text-[#3F3D39]">
                  <Check className="w-4 h-4 text-[#96602F] shrink-0 mt-1" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 min-h-[250px]">
            <AdSquare />
          </div>

          <div className="bg-white rounded-2xl border border-black/8 p-6 text-center mb-6">
            <p className="font-serif text-lg font-bold text-[#1E2026] mb-1">Ready to book?</p>
            <p className="text-sm text-[#6B6862] mb-4">
              Check live dates and availability on Viator.
            </p>
            <a
              href={e.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
            >
              <Ticket className="w-4 h-4" /> Check Availability
            </a>
          </div>

          <div className="mb-6 min-h-[600px] max-w-xs mx-auto">
            <AdVertical />
          </div>

          <Link href="/experiences" className="inline-flex items-center gap-1 text-sm font-semibold text-[#96602F] hover:underline">
            ← All ramen experiences
          </Link>

          <p className="text-[11px] text-[#6B6862]/80 mt-8">
            Booked through Viator. We may earn a commission at no extra cost to you.
          </p>
        </div>

        <Footer />
      </main>
    </>
  )
}
