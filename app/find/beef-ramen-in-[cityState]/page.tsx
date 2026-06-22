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
  const title = `Beef Ramen in ${c.city}, ${c.stateCode} | Best Beef Ramen | RamenNearYou`
  const description = `Find beef ramen in ${c.city}, ${c.stateCode}. Browse restaurants serving beef ramen and beef-broth bowls near ${c.city} — filter by location, price, and hours.`
  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/find/beef-ramen-in-${cityState}` },
    openGraph: {
      title: `Beef Ramen in ${c.city}, ${c.stateCode}`,
      description,
      url: `${BASE_URL}/find/beef-ramen-in-${cityState}`,
      siteName: 'RamenNearYou',
      type: 'website',
    },
  }
}

export default async function BeefRamenCapitalPage(
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
        name: `Where can I find beef ramen in ${c.city}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Use the map above to find restaurants serving beef ramen in ${c.city}, ${c.stateCode}. Enter your ZIP code or click "Use my location" to sort beef ramen spots by distance.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What is beef ramen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Beef ramen features a beef-based broth or beef toppings such as braised short rib, brisket, or thin-sliced steak. It is less traditional than pork-based tonkotsu but increasingly popular, offering a deep, hearty, savory flavor.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is beef ramen the same as Lanzhou beef noodle soup?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'They are related but distinct. Lanzhou beef noodle soup is a Chinese hand-pulled noodle dish with a clear beef broth, while beef ramen typically refers to Japanese-style ramen made with a beef broth or beef toppings. Both are great options for beef lovers.',
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
            initialQuery="beef"
            initialCenter={{ lat: c.lat, lng: c.lng }}
            pageTitle={`Beef Ramen in ${c.city}, ${c.stateCode}`}
            pageDescription={`Showing restaurants serving beef ramen in ${c.city}. Enter your ZIP or use your location to sort by distance.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Beef Ramen in {c.city}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              The map above shows ramen restaurants in {c.city}, {c.stateCode} serving beef ramen —
              from beef-broth bowls to short rib, brisket, and sliced-steak toppings. The map is
              already centered on {c.city}, so just enter your ZIP code or hit &quot;Use my
              location&quot; to sort by distance from wherever you are.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Use the Filters button to narrow further — price range, open now, or open late —
              on top of your beef search.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: `Where can I find beef ramen in ${c.city}?`,
                  a: `The map above shows ${c.city} restaurants serving beef ramen. Enter your ZIP or click "Use my location" to sort by distance from your current location.`,
                },
                {
                  q: 'What is beef ramen?',
                  a: 'Beef ramen features a beef-based broth or beef toppings such as braised short rib, brisket, or thin-sliced steak. It offers a deep, hearty, savory flavor and has grown in popularity alongside traditional pork ramen.',
                },
                {
                  q: 'Is beef ramen the same as Lanzhou beef noodle soup?',
                  a: 'Related but distinct. Lanzhou beef noodle soup is a Chinese hand-pulled dish with a clear beef broth, while beef ramen usually means Japanese-style ramen with a beef broth or beef toppings.',
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
                <a href="/find/beef-ramen" className="hover:text-[#B57F50] underline">Beef Ramen Near Me</a>
                {' · '}
                <a href={`/find/miso-ramen-in-${cityState}`} className="hover:text-[#B57F50] underline">
                  Miso Ramen in {c.city}, {c.stateCode}
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

          <FindCrossLinks currentHref={`/find/beef-ramen-in-${cityState}`} />
          <Footer />
        </div>
      </main>
    </>
  )
}
