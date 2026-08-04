import Link from 'next/link'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import UgcFeature from '@/components/ugc-feature'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import PseoListicle from '@/components/pseo-listicle'
import { phoToListicleItems } from '@/lib/listicle-items'
import type { PhoCity } from '@/lib/pho'
import { phoCityParam } from '@/lib/pho'
import { buildPhoCitySections } from '@/lib/pho-city-content'

export default function PhoCityFindPage({
  city,
  nearbyCities,
}: {
  city: PhoCity
  nearbyCities: Array<{ city: string; citySlug: string; stateCode: string; count: number }>
}) {
  const { cityName, stateName, stateCode, stateSlug, citySlug, listings } = city
  const count = listings.length
  const sections = buildPhoCitySections(city, nearbyCities)
  const cityStateParam = `${citySlug}-${stateCode.toLowerCase()}`
  const ramenCityHref = `/find/${cityStateParam}`

  const faqs = [
    {
      q: `How many pho restaurants are in ${cityName}, ${stateCode}?`,
      a: `There are ${count} pho ${count === 1 ? 'restaurant' : 'restaurants'} listed in ${cityName}, ${stateName} on RamenNearYou.`,
    },
    {
      q: `What is the best pho restaurant in ${cityName}?`,
      a: listings[0]
        ? `By rating, ${listings[0].name}${listings[0].rating != null ? ` at ${listings[0].rating.toFixed(1)} stars` : ''} currently leads ${cityName}. I'd still open the listing and skim recent reviews before deciding.`
        : `Use the map above to browse pho restaurants in and around ${cityName}.`,
    },
    {
      q: `Is pho different from ramen?`,
      a: `Yes. Pho is a Vietnamese dish built on a clear beef or chicken broth with flat rice noodles, finished by the diner with fresh herbs and lime. Ramen is Japanese, uses alkaline wheat noodles, and arrives with a richer, pre-composed broth.`,
    },
  ]

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const mapSlot = (
    <ErrorBoundary fallback={null}>
      <HomeMapHero
        initialCenter={{ lat: listings[0]?.latitude ?? 39.5, lng: listings[0]?.longitude ?? -98.35 }}
        initialFlags={['pho']}
        regionBoundary={{ cityName, stateName, citySlug, stateSlug }}
        pageTitle={`Pho Restaurants in ${cityName} ${stateCode}`}
        pageDescription={`There are ${count} pho restaurants in ${cityName} ${stateName}.`}
      />
    </ErrorBoundary>
  )

  const listicleItems = phoToListicleItems(listings.slice(0, 24))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main className="min-h-screen bg-white">
        <Navbar />

        <PseoListicle
          breadcrumb={[
            { label: 'Ramen Near You', href: '/' },
            { label: 'Pho Restaurants', href: '/find/pho-restaurants' },
            { label: `${cityName}, ${stateCode}` },
          ]}
          title={`${count} Pho Restaurant${count === 1 ? '' : 's'} in ${cityName}, ${stateCode}`}
          subtitle={`Every pho restaurant we track in ${cityName}, ranked by rating and review volume. Search by name, or switch to the map.`}
          items={listicleItems}
          noun="pho restaurant"
          nounPlural="pho restaurants"
          searchPlaceholder="Search by name..."
          filterLabel="Highlight"
          primaryCtaLabel="View details"
          mapSlot={mapSlot}
        />

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <div className="mb-6">
              <AdUnitInArticle />
            </div>

            {/* SEO content */}
            {sections.map((s, i) => (
              <div key={s.id} className={i > 0 ? 'mt-8' : ''}>
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">{s.heading}</h2>
                {s.paragraphs.map((html, j) => (
                  <p key={j} className="text-[#6B6862] text-sm leading-relaxed mb-3.5" dangerouslySetInnerHTML={{ __html: html }} />
                ))}
              </div>
            ))}

            <p className="text-[#6B6862] text-sm leading-relaxed mt-8 mb-8">
              Ready to look outside {cityName}? Browse{' '}
              <Link href={ramenCityHref} className="text-[#96602F] hover:underline">
                ramen restaurants in {cityName}, {stateCode}
              </Link>{' '}
              or every{' '}
              <Link href={`/${stateSlug}`} className="text-[#96602F] hover:underline">
                ramen restaurant in {stateName}
              </Link>.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <details key={q} className="group border border-black/8 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                    {q}
                    <span className="text-[#96602F] shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-black/8">
              <p className="text-xs text-[#6B6862]">
                Also browsing:{' '}
                <Link href={ramenCityHref} className="hover:text-[#96602F] underline">
                  Ramen in {cityName}, {stateCode}
                </Link>
                {' · '}
                <Link href={`/${stateSlug}`} className="hover:text-[#96602F] underline">
                  Ramen in {stateName}
                </Link>
                {' · '}
                <Link href="/find/pho-restaurants" className="hover:text-[#96602F] underline">Pho Restaurants Near Me</Link>
                {' · '}
                <Link href="/partners" className="hover:text-[#96602F] underline">Partners Directory</Link>
              </p>
            </div>
          </section>

          <UgcFeature seed={`/find/${phoCityParam(citySlug, stateCode)}`} />
          <FindCrossLinks currentHref={`/find/${phoCityParam(citySlug, stateCode)}`} />
          <Footer />
        </div>
      </main>
    </>
  )
}
