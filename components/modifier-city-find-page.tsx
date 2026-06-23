import Link from 'next/link'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import FindCrossLinks from '@/components/find-cross-links'
import { Loader2 } from 'lucide-react'
import type { ResolvedCity } from '@/lib/find-city'
import type { FindModifier } from '@/lib/find-modifiers'

export default function ModifierCityFindPage({
  modifier,
  city,
  cityState,
}: {
  modifier: FindModifier
  city: ResolvedCity
  cityState: string
}) {
  const title = modifier.title(city.cityName, city.stateName)
  const faqs = modifier.faqs(city.cityName, city.stateCode)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
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
            initialBowls={modifier.filter.initialBowls}
            initialFlags={modifier.filter.initialFlags}
            initialQuery={modifier.filter.initialQuery}
            initialCenter={{ lat: city.lat, lng: city.lng }}
            pageTitle={title}
            pageDescription={`Showing ${modifier.metaNoun} in ${city.cityName}. Enter your ZIP or use your location to sort by distance.`}
          />
        </ErrorBoundary>

        <div className="relative z-10 bg-white">
          <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            {/* Breadcrumb anchor text */}
            <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#9B9490] mb-6">
              <Link href="/" className="hover:text-[#B57F50] transition-colors">Ramen Near You</Link>
              <span>/</span>
              <Link href={modifier.hubHref} className="hover:text-[#B57F50] transition-colors">{modifier.hubLabel}</Link>
              <span>/</span>
              <Link href={`/${city.stateSlug}`} className="hover:text-[#B57F50] transition-colors">Ramen in {city.stateName}</Link>
              <span>/</span>
              <span className="text-[#6B6862]">{city.cityName}</span>
            </nav>

            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              {title}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              When I am after {modifier.metaNoun} in {city.cityName}, the map above is where I start. It is
              already filtered toward {modifier.metaNoun}, so the moment you drop in your ZIP code or tap
              &quot;Use my location,&quot; the closest options around {city.cityName}, {city.stateCode} sort
              straight to the top. From there it is easy to compare ratings, hours, and photos and pick the
              bowl you actually want.
            </p>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-3">
              What makes great {modifier.metaNoun}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-6">{modifier.about}</p>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-3">
              How I find the best {modifier.metaNoun} in {city.cityName}
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              My approach is simple: I favor shops that specialize rather than do a little of everything, and I
              trust a strong rating that holds up across plenty of reviews over a perfect score from just a
              few. In {city.cityName}, I open a couple of listings, skim the most recent reviews and the
              photos, and go with the bowl that looks carefully made. The map keeps everything sorted by
              distance, so you are never trading quality for a long drive.
            </p>
            <h3 className="text-[#1E2026] font-semibold text-base mb-2 mt-6">
              Tips for ordering {modifier.metaNoun}
            </h3>
            <ul className="space-y-2.5 mb-6">
              {[
                `Sort by distance once you set your location so the nearest ${modifier.metaNoun} in ${city.cityName} is on top.`,
                'Open a few listings and read the most recent reviews — fresh, specific praise is the best signal.',
                'Use the Filters button to stack on what matters: open now, price, or dietary needs.',
                'Ask the shop for noodle firmness and spice level so the bowl arrives exactly how you like it.',
              ].map((t) => (
                <li key={t} className="flex gap-2.5 text-[#6B6862] text-sm leading-relaxed">
                  <span className="text-[#B57F50] shrink-0 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-8">
              Prefer to widen the search? You can browse all{' '}
              <Link href={`/find/${city.citySlug}-${city.stateCode.toLowerCase()}`} className="text-[#B57F50] hover:underline">
                ramen in {city.cityName}, {city.stateCode}
              </Link>{' '}
              or jump to{' '}
              <Link href={modifier.hubHref} className="text-[#B57F50] hover:underline">{modifier.hubLabel.toLowerCase()} near you</Link>{' '}
              nationwide.
            </p>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
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
                <Link href={modifier.hubHref} className="hover:text-[#B57F50] underline">{modifier.hubLabel} Near Me</Link>
                {' · '}
                <Link href={`/find/${city.citySlug}-${city.stateCode.toLowerCase()}`} className="hover:text-[#B57F50] underline">
                  Ramen in {city.cityName}, {city.stateCode}
                </Link>
                {' · '}
                <Link href={`/${city.stateSlug}`} className="hover:text-[#B57F50] underline">
                  Ramen in {city.stateName}
                </Link>
              </p>
            </div>
          </section>

          <FindCrossLinks currentHref={`/find/${cityState}`} />
          <Footer />
        </div>
      </main>
    </>
  )
}
