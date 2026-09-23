import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ChevronRight, Ticket, Clock, Check } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import {
  allExperienceParams,
  getStateGroup,
  getExperience,
  getStateExperiences,
  experienceImage,
  formatPrice,
  formatDuration,
} from '@/lib/experiences'
import { parseDescription, factBullets } from '@/lib/experience-description'

interface Props {
  params: Promise<{ state: string; experience: string }>
}

// The snapshot these pages render from is a build-time JSON import, so their
// output cannot change without a deploy — and a deploy invalidates everything
// anyway. A timed window would only buy ISR cache writes that re-render
// identical HTML, so there is no window: cache until the next deploy.
// (lib/viator-experiences.json is refreshed by the nightly sync workflow, which
// commits it and therefore triggers that deploy.)
export const revalidate = false
// dynamicParams must stay true. With it false, an unknown state (say
// /experiences/wyoming, which has no ramen experiences) doesn't match this
// route at all and falls through to the /[city]/[state] catch-all, which
// permanent-redirects to /find/experiences-wy — a 308 to a 404. Matching here
// and calling notFound() gives a clean 404 instead.
export const dynamicParams = true

export async function generateStaticParams() {
  return allExperienceParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, experience } = await params
  const e = getExperience(state, experience)
  const g = getStateGroup(state)
  if (!e || !g) return {}

  const url = `https://www.ramennearyou.com/experiences/${state}/${experience}`
  const where = e.cityName ? `${e.cityName}, ${g.stateName}` : g.stateName
  const description =
    (e.description || `Book ${e.title} in ${where}.`).slice(0, 155)

  return {
    title: `${e.title} | ${where}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: e.title,
      description,
      url,
      images: [{ url: experienceImage(e), alt: e.title }],
    },
  }
}

const FLAG_LABELS: Record<string, string> = {
  FREE_CANCELLATION: 'Free cancellation available',
  LIKELY_TO_SELL_OUT: 'Likely to sell out',
  SKIP_THE_LINE: 'Skip the line',
  PRIVATE_TOUR: 'Private tour',
  NEW_ON_VIATOR: 'New on Viator',
}

export default async function ExperiencePage({ params }: Props) {
  const { state, experience } = await params
  const e = getExperience(state, experience)
  const group = getStateGroup(state)
  if (!e || !group) notFound()

  const url = `https://www.ramennearyou.com/experiences/${state}/${experience}`
  const price = formatPrice(e)
  const duration = formatDuration(e.durationMinutes)
  const where = e.cityName ? `${e.cityName}, ${group.stateName}` : group.stateName

  // Only claim an aggregateRating when Viator actually reported one — an
  // invented rating in structured data is a manual-action risk.
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: e.title,
    description: e.description || undefined,
    url,
    image: experienceImage(e),
    address: {
      '@type': 'PostalAddress',
      addressLocality: e.cityName ?? undefined,
      addressRegion: group.stateCode,
      addressCountry: 'US',
    },
    ...(e.rating != null && e.reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Number(e.rating.toFixed(1)),
            reviewCount: e.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }

  const others = getStateExperiences(state).filter((o) => o.slug !== e.slug).slice(0, 4)

  const blocks = parseDescription(e.description)
  // Only fall back to fact bullets when the supplier didn't supply their own —
  // otherwise the two lists say overlapping things right next to each other.
  const bullets = blocks.some((b) => b.type === 'ul') ? [] : factBullets(e)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="min-h-screen bg-page">
        <Navbar />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft mb-5">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/experiences" className="hover:text-ink transition-colors">Experiences</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/experiences/${state}`} className="hover:text-ink transition-colors">{group.stateName}</Link>
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight mb-3">
            {e.title}
          </h1>

          <div className="flex items-center gap-2.5 flex-wrap mb-5">
            {e.category === 'ramen' && (
              <span className="px-2 py-0.5 rounded-full bg-brand/12 border border-brand/30 text-[10px] font-bold text-brand-ink">
                RAMEN
              </span>
            )}
            {e.rating != null && (
              <span className="flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i <= Math.round(e.rating!) ? 'text-amber-400 fill-amber-400' : 'text-ink/20'}`}
                    />
                  ))}
                </span>
                <span className="text-sm font-bold text-ink tabular-nums">{e.rating.toFixed(1)}</span>
                {e.reviewCount > 0 && (
                  <span className="text-sm text-ink-soft tabular-nums">{e.reviewCount.toLocaleString()} reviews</span>
                )}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-ink-soft">
              <MapPin className="w-3.5 h-3.5 shrink-0" /> {where}
            </span>
            {duration && (
              <span className="flex items-center gap-1 text-sm text-ink-soft">
                <Clock className="w-3.5 h-3.5 shrink-0" /> {duration}
              </span>
            )}
          </div>

          <div className="relative w-full h-60 sm:h-80 rounded-2xl overflow-hidden mb-4 bg-sunken">
            <Image
              src={experienceImage(e)}
              alt={e.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              unoptimized
            />
          </div>

          {e.gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mb-6">
              {e.gallery.slice(1, 5).map((src) => (
                <div key={src} className="relative aspect-square rounded-lg overflow-hidden bg-sunken">
                  <Image src={src} alt="" fill className="object-cover" sizes="160px" unoptimized />
                </div>
              ))}
            </div>
          )}

          {/* Booking card */}
          <div className="bg-surface rounded-2xl border border-line/8 p-6 mb-6">
            <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
              <div>
                <p className="text-xs text-ink-soft mb-0.5">Booked on Viator</p>
                {price ? (
                  <p className="font-serif text-2xl font-bold text-ink">
                    From {price}{' '}
                    <span className="text-sm font-sans font-normal text-ink-soft">per person</span>
                  </p>
                ) : (
                  <p className="font-serif text-xl font-bold text-ink">See live pricing</p>
                )}
              </div>
              <a
                href={e.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
              >
                <Ticket className="w-4 h-4" /> Check Availability
              </a>
            </div>

            {e.flags.length > 0 && (
              <ul className="space-y-2 pt-4 border-t border-line/8">
                {e.flags
                  .filter((f) => FLAG_LABELS[f])
                  .map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      {FLAG_LABELS[f]}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* Overview — prose, then a bulleted list, the way Viator lays out
              its own product pages. Bullets come from the supplier's own
              highlight lines where the description has them; where it doesn't,
              they're facts restated from the product data rather than copy we
              made up about someone else's tour. */}
          {(blocks.length > 0 || bullets.length > 0) && (
            <div className="bg-surface rounded-2xl border border-line/8 p-6 sm:p-8 mb-6">
              <h2 className="font-serif text-2xl font-bold text-ink mb-4">Overview</h2>

              {blocks.map((b, i) =>
                b.type === 'p' ? (
                  <p key={i} className="text-ink-mid text-[15px] leading-relaxed mb-4 last:mb-0">
                    {b.text}
                  </p>
                ) : (
                  <ul key={i} className="list-disc pl-5 space-y-2 mb-4 last:mb-0 marker:text-ink-faint">
                    {b.items.map((item) => (
                      <li key={item} className="text-ink-mid text-[15px] leading-relaxed pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              )}

              {bullets.length > 0 && (
                <ul className="list-disc pl-5 space-y-2 mt-4 marker:text-ink-faint">
                  {bullets.map((b) => (
                    <li key={b} className="text-ink-mid text-[15px] leading-relaxed pl-1">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="bg-surface rounded-2xl border border-line/8 p-6 text-center mb-6">
            <p className="font-serif text-lg font-bold text-ink mb-1">Ready to book?</p>
            <p className="text-sm text-ink-soft mb-4">Check live dates and availability on Viator.</p>
            <a
              href={e.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand hover:bg-brand-hi text-white text-sm font-bold transition-colors"
            >
              <Ticket className="w-4 h-4" /> Check Availability
            </a>
          </div>

          {others.length > 0 && (
            <section className="mb-6">
              <h2 className="font-serif text-xl font-bold text-ink mb-3">
                More in {group.stateName}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/experiences/${state}/${o.slug}`}
                    className="group bg-surface border border-line/8 rounded-xl overflow-hidden hover:border-brand/45 transition-colors"
                  >
                    <div className="relative aspect-[4/3] bg-sunken">
                      <Image src={experienceImage(o)} alt="" fill className="object-cover" sizes="180px" unoptimized />
                    </div>
                    <p className="text-xs font-semibold text-ink leading-snug p-2.5 line-clamp-2 group-hover:text-brand-ink transition-colors">
                      {o.title}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <Link href={`/experiences/${state}`} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline">
            ← All {group.stateName} experiences
          </Link>

          <p className="text-[11px] text-ink-soft/80 mt-8">
            Booked through Viator. We may earn a commission at no extra cost to you. Prices and
            availability are shown as of the last sync and are confirmed on Viator at checkout.
          </p>
        </div>

        <Footer />
      </main>
    </>
  )
}
