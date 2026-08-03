import Link from 'next/link'
import type { Metadata } from 'next'
import { MapPin, Star, ChevronRight, Map as MapIcon, BookOpen, MessageSquare, ChefHat, Store } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import SearchBox from './search-box'
import NearMeResults from './near-me-results'
import SearchExploreLinks from './search-explore-links'
import { searchSite, type SearchHit } from '@/lib/site-search'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  const query = q?.trim()
  return {
    title: query ? `"${query}" — Search` : 'Search Ramen Restaurants, Guides & Reviews',
    description: query
      ? `Search results for "${query}" across ramen restaurants, pho listings, guides, reviews, and map searches.`
      : 'Search everything on RamenNearYou — restaurants, pho listings, guides, reviews, and map searches. Ask in plain English, like "best ramen in Phoenix" or "closest ramen near me".',
    alternates: { canonical: 'https://www.ramennearyou.com/search' },
    // Query permutations are infinite and thin; only the landing page is worth
    // indexing, though links out of a results page are still worth following.
    robots: query ? { index: false, follow: true } : undefined,
  }
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
              : 'text-[#1E2026]/20'
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
    <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-[#1E2026] mb-4">
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
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-black/8 hover:border-[#B57F50]/50 transition-colors group"
          >
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-[#1E2026] group-hover:text-[#96602F] transition-colors truncate">
                {h.title}
              </span>
              {(h.subtitle || h.meta) && (
                <span className="block text-xs text-[#6B6862] mt-0.5 truncate">
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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  // ── Landing state: one search bar, Google-homepage style ────────────────
  if (!query) {
    return (
      <main className="min-h-screen bg-[#F5F4F0]">
        <Navbar />
        {/* The bar still owns the first screenful; the link hub sits below the
            fold so browsing is one scroll away without competing with it. */}
        <div className="flex flex-col items-center justify-center px-4 sm:px-6 min-h-[calc(100vh-14rem)] py-16">
          <div className="w-full max-w-2xl text-center">
            <div className="text-5xl mb-5" aria-hidden="true">🍜</div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">
              Search Ramen Near You
            </h1>
            <p className="text-[#6B6862] text-sm sm:text-base mb-8 max-w-lg mx-auto">
              Ask in plain English. We&apos;ll pull matching restaurants, pho listings, guides,
              reviews, and map searches from across the site.
            </p>
            <SearchBox size="hero" autoFocus />
          </div>
        </div>
        <SearchExploreLinks />
        <Footer />
      </main>
    )
  }

  // ── Results state ───────────────────────────────────────────────────────
  const r = searchSite(query)
  const { intent } = r
  const hasAnything = r.total > 0 || intent.nearMe
  const cityLabel = intent.city ? `${intent.city.city}, ${intent.city.stateCode}` : null

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />

      <div className="pt-24 pb-6 px-4 sm:px-6 bg-white border-b border-black/8">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-4">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/search" className="hover:text-[#1E2026] transition-colors">Search</Link>
          </nav>
          <SearchBox initialQuery={query} size="compact" />
          {/* Say out loud how the query was read — if we picked the wrong city
              or missed a "near me", the visitor can see why and rephrase. */}
          <p className="text-xs text-[#6B6862] mt-3">
            {r.total > 0
              ? <>Results for <span className="text-[#1E2026] font-semibold">&ldquo;{query}&rdquo;</span></>
              : <>No matches for <span className="text-[#1E2026] font-semibold">&ldquo;{query}&rdquo;</span></>}
            {cityLabel && <> · reading this as <span className="text-[#96602F] font-semibold">{cityLabel}</span></>}
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/8 hover:border-[#B57F50]/50 transition-colors group"
                >
                  <span className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#ECEAE4]">
                    <RestaurantImage src={x.photo} alt={x.name} fill className="object-cover" sizes="56px" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-sm text-[#1E2026] group-hover:text-[#96602F] transition-colors truncate">
                      {x.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#6B6862] mt-0.5 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />{x.city}, {x.stateCode}
                    </span>
                    {x.rating != null && (
                      <span className="flex items-center gap-1.5 mt-1">
                        <StarRating rating={x.rating} />
                        <span className="text-xs text-[#6B6862]">
                          {x.rating.toFixed(1)}{x.reviewCount ? ` (${x.reviewCount.toLocaleString()})` : ''}
                        </span>
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#96602F] shrink-0" />
                </Link>
              ))}
            </div>
            {r.restaurants.length > 10 && intent.city && (
              <Link
                href={`/find/${intent.city.citySlug}-${intent.city.stateCode.toLowerCase()}`}
                className="inline-block mt-3 text-sm text-[#96602F] hover:underline"
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/8 hover:border-[#16a34a]/50 transition-colors group"
                >
                  <span className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#ECEAE4]">
                    <RestaurantImage src={p.photo} alt={p.name} fill className="object-cover" sizes="56px" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-semibold text-sm text-[#1E2026] group-hover:text-[#16a34a] transition-colors truncate">
                      {p.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#6B6862] mt-0.5 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />{p.city}, {p.stateCode}
                    </span>
                    {p.rating != null && (
                      <span className="flex items-center gap-1.5 mt-1">
                        <StarRating rating={p.rating} />
                        <span className="text-xs text-[#6B6862]">
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
            <p className="text-[#1E2026] font-semibold mb-2">Nothing matched that search.</p>
            <p className="text-[#6B6862] text-sm mb-6 max-w-md mx-auto">
              Try a city (&ldquo;ramen in Chicago&rdquo;), a broth style (&ldquo;tonkotsu&rdquo;),
              a restaurant name, or a ZIP code.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link href="/find" className="px-4 py-2 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold transition-colors">
                Browse the map
              </Link>
              <Link href="/cities" className="px-4 py-2 rounded-full bg-white border border-black/10 text-[#1E2026] text-xs font-semibold hover:border-[#B57F50]/50 transition-colors">
                Browse by city
              </Link>
              <Link href="/blog" className="px-4 py-2 rounded-full bg-white border border-black/10 text-[#1E2026] text-xs font-semibold hover:border-[#B57F50]/50 transition-colors">
                Read the blog
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Also shown under results, not just on the empty state — a search that
          returned something narrow is still a good place to offer the browse
          route out. */}
      <SearchExploreLinks />
      <Footer />
    </main>
  )
}
