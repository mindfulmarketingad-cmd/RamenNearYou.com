import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ChevronRight, Ticket } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AdSquare from '@/components/ad-square'
import { stateGroups, totalExperiences, totalRamenExperiences, experienceImage } from '@/lib/experiences'

const URL = 'https://www.ramennearyou.com/experiences'

export const metadata: Metadata = {
  title: 'Ramen & Food Experiences by State | Classes, Tours & Tastings',
  description:
    'Book ramen making classes, noodle workshops, food tours and tastings across the US. Browse experiences by state.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Ramen & Food Experiences by State',
    description: 'Ramen classes, noodle workshops, food tours and tastings across the US.',
    url: URL,
  },
}

// Snapshot is refreshed by the nightly sync; a day of staleness is fine and
// keeps these pages static.
export const revalidate = 86400

export default function ExperiencesHubPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Ramen & Food Experiences by State',
    url: URL,
    description:
      'Ramen making classes, noodle workshops, food tours and tastings across the United States.',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="min-h-screen bg-page">
        <Navbar />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-soft mb-5">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink">Experiences</span>
          </nav>

          <header className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight mb-3">
              Ramen &amp; Food Experiences by State
            </h1>
            <p className="text-ink-soft text-[15px] leading-relaxed max-w-2xl">
              Ramen making classes and noodle workshops first, then the best food tours,
              tastings and cooking classes in each state. {totalExperiences > 0
                ? `${totalExperiences.toLocaleString()} experiences across ${stateGroups.length} state${stateGroups.length === 1 ? '' : 's'}, ${totalRamenExperiences.toLocaleString()} of them ramen.`
                : 'Pick a state to see what’s on.'}
            </p>
          </header>

          {stateGroups.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line/12 bg-raised px-4 py-14 text-center">
              <Ticket className="w-6 h-6 text-brand mx-auto mb-3" />
              <p className="font-serif text-lg font-bold text-ink">No experiences loaded yet</p>
              <p className="text-sm text-ink-soft mt-1.5 max-w-md mx-auto leading-relaxed">
                Run the Viator sync to populate this page — it pulls ramen classes and
                general food experiences and groups them by state.
              </p>
              <a
                href="https://www.viator.com/searchResults/all?text=Ramen+experiences&pid=P00320180&mcid=42383&medium=link"
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
              >
                <Ticket className="w-4 h-4" /> Browse ramen experiences on Viator
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stateGroups.map((g) => (
                <Link
                  key={g.stateSlug}
                  href={`/experiences/${g.stateSlug}`}
                  className="group bg-surface border border-line/8 rounded-2xl overflow-hidden hover:border-brand/45 hover:shadow-[0_2px_12px_rgba(30,32,38,0.06)] transition-all"
                >
                  <div className="relative aspect-[16/9] bg-sunken">
                    {g.cover && (
                      <Image
                        src={experienceImage(g.cover)}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 360px"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3.5">
                      <p className="font-serif text-lg font-bold text-white leading-tight">{g.stateName}</p>
                      <p className="text-white/80 text-xs">
                        {g.count} experience{g.count === 1 ? '' : 's'}
                        {g.ramenCount > 0 && ` · ${g.ramenCount} ramen`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
                    <span className="flex items-center gap-1 text-xs text-ink-soft">
                      <MapPin className="w-3 h-3 shrink-0" /> {g.stateName}
                    </span>
                    <span className="text-xs font-semibold text-brand-ink group-hover:underline">
                      View all →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="my-8 min-h-[250px]">
            <AdSquare />
          </div>

          <p className="text-[11px] text-ink-soft/80">
            Experiences are booked through Viator. We may earn a commission at no extra cost to you.
          </p>
        </div>

        <Footer />
      </main>
    </>
  )
}
