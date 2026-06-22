import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'
import { CAPITAL_CITIES } from '@/lib/capital-cities'

const BASE_URL = 'https://www.ramennearyou.com'

// Build lookup: "montgomery-alabama" → CapitalCity
const CAPITAL_BY_SLUG = Object.fromEntries(
  CAPITAL_CITIES.map(c => [`${c.citySlug}-${c.stateSlug}`, c])
)

export function generateStaticParams() {
  return CAPITAL_CITIES.map(c => ({ cityState: `${c.citySlug}-${c.stateSlug}` }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ cityState: string }> }
): Promise<Metadata> {
  const { cityState } = await params
  const c = CAPITAL_BY_SLUG[cityState]
  if (!c) return {}
  const title = `Ramen Open Late in ${c.city}, ${c.stateCode} | Late Night Ramen | RamenNearYou`
  const description = `Find ramen restaurants open late in ${c.city}, ${c.stateCode}. Browse spots open until 10 PM or later near ${c.city} — filter by broth, price, and hours.`
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/find/ramen-open-late-in-${cityState}` },
    openGraph: {
      title: `Ramen Open Late in ${c.city}, ${c.stateCode}`,
      description,
      url: `${BASE_URL}/find/ramen-open-late-in-${cityState}`,
      siteName: 'RamenNearYou',
      type: 'website',
    },
  }
}

export default async function RamenOpenLateCapitalPage(
  { params }: { params: Promise<{ cityState: string }> }
) {
  const { cityState } = await params
  const c = CAPITAL_BY_SLUG[cityState]
  if (!c) notFound()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What ramen restaurants are open late in ${c.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use the map above to find ramen restaurants open until 10 PM or later in ${c.city}, ${c.stateCode}. Enter your ZIP code or click "Use my location" to sort spots by distance.`,
        },
      },
      {
        '@type': 'Question',
        name: `Does ${c.city} have late-night ramen?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes — the map above shows ramen restaurants in ${c.city} that stay open until 10 PM or later. Availability varies by neighborhood, so use your ZIP code or location to find the closest late-night option.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What time do ramen restaurants usually close?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most ramen restaurants close between 9 PM and 10 PM. Late-night spots typically stay open until 11 PM, midnight, or beyond — especially in larger cities.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-white">
        <Navbar />
        <ErrorBoundary
          fallback={
            <section className="pt-16 bg-[#F5F4F0]">
              <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
              </div>
            </section>
          }
        >
          <HomeMapHero
            initialFlags={['open-late']}
            initialCenter={{ lat: c.lat, lng: c.lng }}
            pageTitle={`Ramen Open Late in ${c.city}, ${c.stateCode}`}
            pageDescription={`Showing ramen restaurants in ${c.city} open until 10 PM or later. Enter your ZIP or use your location to sort by distance.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Late Night Ramen in {c.city}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              The map above shows every ramen restaurant in {c.city}, {c.stateCode} that stays
              open until 10 PM or later — pre-filtered so you don&apos;t have to search through
              closed listings at the end of the night. The map is already centered on {c.city},
              so just enter your ZIP code or hit &quot;Use my location&quot; to sort by
              distance from wherever you are.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Use the Filters button to stack additional criteria — broth type, price range,
              open past midnight — on top of the late-night filter.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `What ramen restaurants are open late in ${c.city}?`,
                  a: `The map above shows ${c.city} ramen spots open until 10 PM or later. Enter your ZIP or click "Use my location" to sort by distance from your current location.`,
                },
                {
                  q: `Does ${c.city} have late-night ramen?`,
                  a: `Yes — the map is pre-filtered to show ${c.city} ramen restaurants that stay open late. Availability varies by neighborhood, so use the location search to find the closest one.`,
                },
                {
                  q: 'What time do ramen restaurants usually close?',
                  a: 'Most ramen restaurants close between 9 PM and 10 PM. Late-night spots typically stay open until 11 PM, midnight, or beyond — especially in larger cities.',
                },
              ].map(({ q, a }) => (
                <details key={q} className="group border border-black/8 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                    {q}
                    <span className="text-[#B57F50] shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-black/8">
              <p className="text-xs text-[#9B9490]">
                Also browsing:{' '}
                <a href="/find/ramen-open-late" className="hover:text-[#B57F50] underline">Ramen Open Late Near Me</a>
                {' · '}
                <a href={`/find/${c.citySlug}-${c.stateCode.toLowerCase()}`} className="hover:text-[#B57F50] underline">
                  Ramen in {c.city}, {c.stateCode}
                </a>
                {' · '}
                <a href={`/${c.stateSlug}`} className="hover:text-[#B57F50] underline">
                  Ramen in {c.stateSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </a>
              </p>
            </div>
          </section>

          <FindCrossLinks currentHref={`/find/ramen-open-late-in-${cityState}`} />
          <Footer />
        </div>
      </main>
    </>
  )
}
