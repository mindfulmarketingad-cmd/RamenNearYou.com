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
  const title = `Ramen Open Now in ${c.city}, ${c.stateCode} | Ramen Open Right Now | RamenNearYou`
  const description = `Find ramen restaurants open now in ${c.city}, ${c.stateCode}. See which ramen spots near ${c.city} are open right now — filter by broth, price, and hours.`
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/find/ramen-open-now-in-${cityState}` },
    openGraph: {
      title: `Ramen Open Now in ${c.city}, ${c.stateCode}`,
      description,
      url: `${BASE_URL}/find/ramen-open-now-in-${cityState}`,
      siteName: 'RamenNearYou',
      type: 'website',
    },
  }
}

export default async function RamenOpenNowCapitalPage(
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
        name: `What ramen restaurants are open now in ${c.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use the map above to see ramen restaurants open right now in ${c.city}, ${c.stateCode}. Enter your ZIP code or click "Use my location" to sort open spots by distance.`,
        },
      },
      {
        '@type': 'Question',
        name: `How do I find ramen open right now near me in ${c.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The map above is pre-filtered to show only ramen restaurants currently open in ${c.city}. Enter your ZIP or use your location and the list will sort by distance so you can get to a bowl fast.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Are the open hours accurate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Open-now status is based on each restaurant\'s posted hours. Hours can change for holidays or special events, so it is always a good idea to call ahead before making a long trip.',
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
            initialFlags={['open-now']}
            initialCenter={{ lat: c.lat, lng: c.lng }}
            pageTitle={`Ramen Open Now in ${c.city}, ${c.stateCode}`}
            pageDescription={`Showing ramen restaurants in ${c.city} that are open right now. Enter your ZIP or use your location to sort by distance.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Ramen Open Right Now in {c.city}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              The map above shows every ramen restaurant in {c.city}, {c.stateCode} that is open
              right now — pre-filtered so you skip anything that&apos;s already closed. The map is
              already centered on {c.city}, so just enter your ZIP code or hit &quot;Use my
              location&quot; to sort by distance from wherever you are.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Use the Filters button to narrow further — broth type, price range, or open late —
              on top of the open-now filter.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `What ramen restaurants are open now in ${c.city}?`,
                  a: `The map above shows ${c.city} ramen spots that are open right now. Enter your ZIP or click "Use my location" to sort by distance from your current location.`,
                },
                {
                  q: `How do I find ramen open right now near me in ${c.city}?`,
                  a: `The map is pre-filtered to show only currently-open ramen restaurants in ${c.city}. Enter your ZIP or use your location and the list sorts by distance so you can get to a bowl fast.`,
                },
                {
                  q: 'Are the open hours accurate?',
                  a: 'Open-now status is based on each restaurant\'s posted hours. Hours can change for holidays or special events, so it\'s always smart to call ahead before a long trip.',
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
                <a href="/find/ramen-open-now" className="hover:text-[#B57F50] underline">Ramen Open Now Near Me</a>
                {' · '}
                <a href={`/find/ramen-open-late-in-${cityState}`} className="hover:text-[#B57F50] underline">
                  Ramen Open Late in {c.city}, {c.stateCode}
                </a>
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

          <FindCrossLinks currentHref={`/find/ramen-open-now-in-${cityState}`} />
          <Footer />
        </div>
      </main>
    </>
  )
}
