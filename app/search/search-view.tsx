'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { MapPin, Star, ChevronRight, Map as MapIcon, BookOpen, MessageSquare, ChefHat, Store, Loader2 } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'
import SearchBox from './search-box'
import NearMeResults from './near-me-results'
import { searchSite, type SearchCorpus, type SearchHit, type SiteSearchResults } from '@/lib/site-search'

// The results half of /search. The page is static HTML, so the query is read
// from the URL here in the browser and run against the static search index
// (/data/search-index.json, built by lib/site-search-corpus.ts). With no
// query, the server-rendered landing state passed in as `landing` shows.

let _corpus: Promise<SearchCorpus> | null = null
function loadCorpus(): Promise<SearchCorpus> {
  _corpus ??= fetch('/data/search-index.json').then((r) => r.json())
  return _corpus
}

function StarRating({ rating }: { rating: number | null }) {
  if (rating == null) return null
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= full ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50'
              : 'text-ink/20'
          }`}
        />
      ))}
    </span>
  )
}

function SectionHeading({ icon: Icon, children, accent = '#96602F' }: {
  icon: typeof MapIcon; children: React.ReactNode; accent?: string
}) {
  return (
    <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-ink mb-4">
      <Icon className="w-4 h-4" style={{ color: accent }} />
      {children}
    </h2>
  )
}

function LinkList({ hits, accent = '#96602F' }: { hits: SearchHit[]; accent?: string }) {
  return (
    <ul className="space-y-2">
      {hits.map(h => (
        <li key={h.href}>
          <Link
            href={h.href}
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-line/8 hover:border-brand/50 transition-colors group"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink group-hover:text-brand-ink transition-colors truncate">
                {h.title}
              </span>
              {(h.subtitle || h.meta) && (
                <span className="block text-xs text-ink-soft mt-0.5 truncate">
                  {[h.subtitle, h.meta].filter(Boolean).join(' · ')}
                </span>
              )}
            </span>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: accent }} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function SearchView({ landing }: { landing: ReactNode }) {
  const params = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const [r, setR] = useState<SiteSearchResults | null>(null)

  useEffect(() => {
    if (!query) return
    let cancelled = false
    setR(null)
    loadCorpus().then((corpus) => { if (!cancelled) setR(searchSite(query, corpus)) })
    return () => { cancelled = true }
  }, [query])

  useEffect(() => {
    document.title = query ? `"${query}" — Search | Ramen Near You` : 'Search Ramen Restaurants, Guides & Reviews | Ramen Near You'
  }, [query])

  if (!query) return <>{landing}</>
  if (!r) {
    return (
      <div className="flex items-center justify-center gap-2 py-32 text-ink-soft text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Searching…
      </div>
    )
  }

  const { intent } = r
  const hasAnything = r.total > 0 || intent.nearMe
  const cityLabel = intent.city ? `${intent.city.city}, ${intent.city.stateCode}` : null

  return (
    <>
      <div className="pt-24 pb-6 px-4 sm:px-6 bg-surface border-b border-line/8">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-soft mb-4">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/search" className="hover:text-ink transition-colors">Search</Link>
          </nav>
          <SearchBox initialQuery={query} size="compact" />
          {/* Say out loud how the query was read — if we picked the wrong city
              or missed a "near me", the visitor can see why and rephrase. */}
          <p className="text-xs text-ink-soft mt-3">
            {r.total > 0
              ? <>Results for <span className="text-ink font-semibold">&ldquo;{query}&rdquo;</span></>
              : <>No matches for <span className="text-ink font-semibold">&ldquo;{query}&rdquo;</span></>}
            {cityLabel && <> · reading this as <span className="text-brand-ink font-semibold">{cityLabel}</span></>}
            {intent.nearMe && <> · sorting by distance from you</>}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {intent.nearMe && <NearMeResults phoOnly={intent.phoIntent} />}

        {r.findPages.length > 0 && (
          <section className="mb-10">
            <SectionHeading icon={MapIcon}>Search the map</SectionHeading>
            <LinkList hits={r.findPages} />
          </section>
        )}

        {r.restaurants.length > 0 && (
          <section className="mb-10">
            <SectionHeading icon={Store}>
              {cityLabel ? `Ramen restaurants in ${cityLabel}` : 'Ramen restaurants'}
            </SectionHeading>
            <div className="space-y-2">
              {r.restaurants.slice(0, 10).map(x => (
                <Link
                  key={`${x.citySlug}-${x.slug}`}
                  href={`/${x.citySlug}/${x.stateSlug}/${x.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-line/8 hover:border-brand/50 transition-colors group"
                >
                  <span className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-page">
                    <RestaurantImage src={x.photo} alt={x.name} fill className="object-cover" sizes="56px" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-sm text-ink group-hover:text-brand-ink transition-colors truncate">
                      {x.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-ink-soft mt-0.5 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />{x.city}, {x.stateCode}
                    </span>
                    {x.rating != null && (
                      <span className="flex items-center gap-1.5 mt-1">
                        <StarRating rating={x.rating} />
                        <span className="text-xs text-ink-soft">
                          {x.rating.toFixed(1)}{x.reviewCount ? ` (${x.reviewCount.toLocaleString()})` : ''}
                        </span>
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-brand-ink shrink-0" />
                </Link>
              ))}
            </div>
            {r.restaurants.length > 10 && intent.city && (
              <Link
                href={`/find/${intent.city.citySlug}-${intent.city.stateCode.toLowerCase()}`}
                className="inline-block mt-3 text-sm text-brand-ink hover:underline"
              >
                See all {r.restaurants.length}+ in {cityLabel} on the map →
              </Link>
            )}
          </section>
        )}

        {r.pho.length > 0 && (
          <section className="mb-10">
            <SectionHeading icon={Store} accent="#16a34a">
              {cityLabel ? `Pho restaurants in ${cityLabel}` : 'Pho restaurants'}
            </SectionHeading>
            <div className="space-y-2">
              {r.pho.slice(0, 8).map(p => (
                <Link
                  key={p.slug}
                  href={`/partners/${p.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-line/8 hover:border-[#16a34a]/50 transition-colors group"
                >
                  <span className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-page">
                    <RestaurantImage src={p.photo} alt={p.name} fill className="object-cover" sizes="56px" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-sm text-ink group-hover:text-[#16a34a] transition-colors truncate">
                      {p.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-ink-soft mt-0.5 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />{p.city}, {p.stateCode}
                    </span>
                    {p.rating != null && (
                      <span className="flex items-center gap-1.5 mt-1">
                        <StarRating rating={p.rating} />
                        <span className="text-xs text-ink-soft">
                          {p.rating.toFixed(1)} ({p.reviewCount.toLocaleString()})
                        </span>
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#16a34a] shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {r.blog.length > 0 && (
          <section className="mb-10">
            <SectionHeading icon={BookOpen}>Guides &amp; articles</SectionHeading>
            <LinkList hits={r.blog} />
          </section>
        )}

        {r.reviews.length > 0 && (
          <section className="mb-10">
            <SectionHeading icon={MessageSquare}>Review pages</SectionHeading>
            <LinkList hits={r.reviews} />
          </section>
        )}

        {r.recipes.length > 0 && (
          <section className="mb-10">
            <SectionHeading icon={ChefHat}>Recipes</SectionHeading>
            <LinkList hits={r.recipes} />
          </section>
        )}

        {!hasAnything && (
          <div className="text-center py-12">
            <p className="text-ink font-semibold mb-2">Nothing matched that search.</p>
            <p className="text-ink-soft text-sm mb-6 max-w-md mx-auto">
              Try a city (&ldquo;ramen in Chicago&rdquo;), a broth style (&ldquo;tonkotsu&rdquo;),
              a restaurant name, or a ZIP code.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/find" className="px-4 py-2 rounded-full bg-brand hover:bg-brand-hi text-white text-xs font-semibold transition-colors">
                Browse the map
              </Link>
              <Link href="/cities" className="px-4 py-2 rounded-full bg-surface border border-line/10 text-ink text-xs font-semibold hover:border-brand/50 transition-colors">
                Browse by city
              </Link>
              <Link href="/blog" className="px-4 py-2 rounded-full bg-surface border border-line/10 text-ink text-xs font-semibold hover:border-brand/50 transition-colors">
                Read the blog
              </Link>
            </div>
          </div>
        )}
      </div>

    </>
  )
}
