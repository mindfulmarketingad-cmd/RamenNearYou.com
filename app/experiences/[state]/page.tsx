import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ChevronRight, Ticket, Clock } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AdSquare from '@/components/ad-square'
import AdInFeed from '@/components/ad-infeed'
import {
  stateGroups,
  getStateGroup,
  getStateExperiences,
  splitByCategory,
  experienceImage,
  formatPrice,
  formatDuration,
  type Experience,
} from '@/lib/experiences'

interface Props {
  params: Promise<{ state: string }>
}

export const revalidate = 86400
// dynamicParams must stay true. With it false, an unknown state (say
// /experiences/wyoming, which has no ramen experiences) doesn't match this
// route at all and falls through to the /[city]/[state] catch-all, which
// permanent-redirects to /find/experiences-wy — a 308 to a 404. Matching here
// and calling notFound() gives a clean 404 instead.
export const dynamicParams = true

export async function generateStaticParams() {
  return stateGroups.map((g) => ({ state: g.stateSlug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params
  const g = getStateGroup(state)
  if (!g) return {}
  const url = `https://www.ramennearyou.com/experiences/${g.stateSlug}`
  const title = `Ramen & Food Experiences in ${g.stateName} | Classes & Tours`
  const description = `${g.count} ramen classes, noodle workshops, food tours and tastings in ${g.stateName}. Compare prices and book.`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  }
}

// One row, shared by both sections so the ramen list and the food list can't
// drift apart visually.
function ExperienceRow({ e, rank, stateSlug }: { e: Experience; rank: number; stateSlug: string }) {
  const price = formatPrice(e)
  const duration = formatDuration(e.durationMinutes)
  const href = `/experiences/${stateSlug}/${e.slug}`

  return (
    <article className="bg-surface border border-line/8 rounded-xl overflow-hidden hover:border-brand/45 transition-colors">
      <div className="flex items-stretch gap-3 p-3 sm:p-4">
        <div className="relative shrink-0 w-[84px] h-[84px] sm:w-[110px] sm:h-[110px] rounded-lg overflow-hidden bg-sunken">
          <Image src={experienceImage(e)} alt={e.title} fill className="object-cover" sizes="110px" unoptimized />
          <span className="absolute top-1 left-1 flex items-center justify-center w-5 h-5 rounded-full bg-contrast/85 text-white text-[10px] font-bold tabular-nums">
            {rank}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-sm text-ink leading-snug">
            <Link href={href} className="hover:text-brand-ink transition-colors">{e.title}</Link>
          </h3>

          <div className="flex items-center gap-2 flex-wrap mt-1">
            {e.category === 'ramen' && (
              <span className="px-1.5 py-0.5 rounded-full bg-brand/12 border border-brand/30 text-[10px] font-bold text-brand-ink">
                RAMEN
              </span>
            )}
            {e.rating != null && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-ink tabular-nums">{e.rating.toFixed(1)}</span>
                {e.reviewCount > 0 && (
                  <span className="text-xs text-ink-soft tabular-nums">({e.reviewCount.toLocaleString()})</span>
                )}
              </span>
            )}
            {e.cityName && (
              <span className="flex items-center gap-1 text-xs text-ink-soft">
                <MapPin className="w-3 h-3 shrink-0" /> {e.cityName}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1 text-xs text-ink-soft">
                <Clock className="w-3 h-3 shrink-0" /> {duration}
              </span>
            )}
          </div>

          {e.description && (
            <p className="text-xs text-ink-mid mt-1.5 leading-snug line-clamp-2">{e.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-2.5">
            {price && <span className="text-sm font-bold text-ink">From {price}</span>}
            <a
              href={e.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-brand hover:bg-brand-hi text-white text-xs font-bold transition-colors"
            >
              <Ticket className="w-3.5 h-3.5" /> Check Availability
            </a>
            <Link href={href} className="text-xs font-semibold text-brand-ink hover:underline">
              Details →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export default async function StateExperiencesPage({ params }: Props) {
  const { state } = await params
  const group = getStateGroup(state)
  if (!group) notFound()

  const items = getStateExperiences(state)
  const { ramen, food } = splitByCategory(state)
  const url = `https://www.ramennearyou.com/experiences/${group.stateSlug}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Ramen Experiences in ${group.stateName}`,
    url,
    numberOfItems: items.length,
    itemListElement: items.slice(0, 30).map((e, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: e.title,
      url: `${url}/${e.slug}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="min-h-screen bg-page">
        <Navbar />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-soft mb-5">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/experiences" className="hover:text-ink transition-colors">Experiences</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink">{group.stateName}</span>
          </nav>

          <header className="mb-6">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight mb-2">
              Ramen &amp; Food Experiences in {group.stateName}
            </h1>
            <p className="text-ink-soft text-sm">
              {group.ramenCount > 0 && (
                <>{group.ramenCount} ramen experience{group.ramenCount === 1 ? '' : 's'}</>
              )}
              {group.ramenCount > 0 && group.foodCount > 0 && ' and '}
              {group.foodCount > 0 && (
                <>{group.foodCount} food &amp; drink experience{group.foodCount === 1 ? '' : 's'}</>
              )}
              {' '}you can book, ranked by rating and review volume.
            </p>
          </header>

          {ramen.length > 0 && (
            <section className="mb-8">
              {food.length > 0 && (
                <h2 className="font-serif text-xl font-bold text-ink mb-3">
                  Ramen experiences
                </h2>
              )}
              <div className="space-y-3">
                {ramen.map((e, i) => (
                  <div key={e.slug}>
                    <ExperienceRow e={e} rank={i + 1} stateSlug={group.stateSlug} />
                    {i === 4 && <div className="my-3"><AdInFeed /></div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {food.length > 0 && (
            <section className="mb-8">
              {ramen.length > 0 && (
                <>
                  <h2 className="font-serif text-xl font-bold text-ink mb-1">
                    More food &amp; drink in {group.stateName}
                  </h2>
                  <p className="text-xs text-ink-soft mb-3">
                    Food tours, tastings and cooking classes worth a detour.
                  </p>
                </>
              )}
              <div className="space-y-3">
                {food.map((e, i) => (
                  <div key={e.slug}>
                    <ExperienceRow e={e} rank={i + 1} stateSlug={group.stateSlug} />
                    {ramen.length === 0 && i === 4 && <div className="my-3"><AdInFeed /></div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="my-8 min-h-[250px]">
            <AdSquare />
          </div>

          <Link href="/experiences" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:underline">
            ← All states
          </Link>

          <p className="text-[11px] text-ink-soft/80 mt-8">
            Booked through Viator. We may earn a commission at no extra cost to you.
          </p>
        </div>

        <Footer />
      </main>
    </>
  )
}
