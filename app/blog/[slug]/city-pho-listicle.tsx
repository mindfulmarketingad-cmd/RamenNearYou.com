import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Star, Phone, MapPin } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import AdUnit from '@/components/ad-unit'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import RestaurantImage from '@/components/restaurant-image'
import { phoCityParam } from '@/lib/pho'
import { pickStockPhoto } from '@/lib/stock-photos'
import { slugifyAuthor } from '@/lib/perfect-for'
import { buildPhoRestaurantReview, getPhoContextualLinks } from '@/lib/city-listicle-content'
import type { CityPhoListicle } from '@/lib/city-listicles'

const AUTHORS = [
  { name: 'Marcus Rivera', avatar: '/authors/marcus-rivera.svg' },
  { name: 'Maya Chen', avatar: '/authors/maya-chen.svg' },
  { name: 'Jackson Hewitt', avatar: '/authors/jackson-hewitt.svg' },
] as const

function pickAuthor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return AUTHORS[hash % AUTHORS.length]
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= full ? 'text-amber-400 fill-amber-400' : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-[#1E2026]/20'}`}
        />
      ))}
    </span>
  )
}

export default function CityPhoListicle({ city }: { city: CityPhoListicle }) {
  const { citySlug, stateCode, cityName, stateName, top5, totalCount } = city
  const title = `5 Best Pho Restaurants in ${cityName}, ${stateCode}`
  const author = pickAuthor(`${citySlug}-${stateCode}-pho`)
  const headerImage = top5[0]?.photo || pickStockPhoto(`${citySlug}-${stateCode}-pho-listicle`)
  const findParam = phoCityParam(citySlug, stateCode)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:items-start">
          <div>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap pt-2">
              <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/blog" className="hover:text-[#1E2026] transition-colors">Blog</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#1E2026]">{title}</span>
            </nav>

            <article className="mt-4">
              <header className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#16a34a]/15 text-[#16a34a]">Best Of · Pho</span>
                  <span className="text-xs text-[#6B6862]/60">{totalCount} pho spots tracked in {cityName}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E2026] leading-tight mb-4">
                  {title}
                </h1>

                <div className="mb-5"><AdUnitInArticle /></div>

                <p className="text-[#6B6862] text-lg leading-relaxed mb-5">
                  We looked at every pho restaurant we track in {cityName}, {stateName}, and ranked the five with
                  the strongest Google ratings and review volume. Here&apos;s exactly where to go, and why each one
                  made the list.
                </p>

                <Link href={`/authors/${slugifyAuthor(author.name)}`} className="inline-flex items-center gap-2.5 group">
                  <Image src={author.avatar} alt={author.name} width={36} height={36} className="rounded-full border border-black/8" unoptimized />
                  <div>
                    <p className="text-sm font-medium text-[#1E2026] group-hover:text-[#96602F] transition-colors">{author.name}</p>
                    <p className="text-xs text-[#6B6862]/60">Contributor profile →</p>
                  </div>
                </Link>
              </header>

              <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-8 bg-[#F5F4F0]">
                <RestaurantImage src={headerImage} alt={`Pho in ${cityName}, ${stateCode}`} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" priority />
              </div>

              {/* Table of contents */}
              <nav aria-label="Table of contents" className="mb-8 rounded-xl border border-[#16a34a]/25 bg-[#F5F4F0] p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#16a34a] mb-3">Table of Contents</p>
                <ol className="space-y-1.5">
                  {top5.map((p, i) => (
                    <li key={p.slug} className="flex gap-2.5 text-[15px] leading-snug">
                      <span className="text-[#16a34a] font-semibold tabular-nums shrink-0">{i + 1}.</span>
                      <a href={`#${p.slug}`} className="text-[#1E2026] hover:text-[#16a34a] hover:underline">{p.name}</a>
                    </li>
                  ))}
                  <li className="flex gap-2.5 text-[15px] leading-snug">
                    <span className="text-[#16a34a] font-semibold tabular-nums shrink-0">{top5.length + 1}.</span>
                    <a href="#keep-exploring" className="text-[#1E2026] hover:text-[#16a34a] hover:underline">Keep Exploring</a>
                  </li>
                </ol>
              </nav>

              {/* Ranking methodology note */}
              <section className="mb-8 bg-[#F5F4F0] border border-black/5 rounded-2xl p-6 sm:p-8">
                <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-3">How we ranked these restaurants</h2>
                <p className="text-[#6B6862] text-sm leading-relaxed">
                  We ranked every pho restaurant we track in {cityName} by Google rating first, then by review
                  count as the tiebreaker — the five below are the highest-rated spots with a meaningful number of
                  real diner reviews behind that score, not just a high average built on a handful of ratings.
                </p>
              </section>

              {/* Restaurant cards */}
              <div className="space-y-6">
                {top5.map((p, i) => {
                  const review = buildPhoRestaurantReview(p, i)
                  const ctxLinks = getPhoContextualLinks(p)
                  return (
                    <article key={p.slug} id={p.slug} className="scroll-mt-24 bg-white rounded-2xl border border-black/5 overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-56 shrink-0 h-48 sm:h-auto bg-[#F5F4F0]">
                          <RestaurantImage src={p.photo} alt={p.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 224px" />
                          <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-[#16a34a] flex items-center justify-center text-white text-sm font-bold shadow">
                            {i + 1}
                          </div>
                        </div>
                        <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3">
                          <div>
                            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1">{p.name}</h2>
                            <div className="flex flex-wrap items-center gap-2">
                              {p.rating != null && (
                                <>
                                  <StarRating rating={p.rating} />
                                  <span className="text-[#1E2026]/70 text-xs">{p.rating.toFixed(1)} ({p.reviewCount.toLocaleString()} reviews)</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 text-[#3F3D39] text-sm leading-relaxed">
                            {review.map((para, j) => <p key={j} dangerouslySetInnerHTML={{ __html: para }} />)}
                          </div>

                          <div className="flex flex-col gap-1 text-xs text-[#6B6862]/70">
                            {p.phone && (
                              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />{p.phone}</span>
                            )}
                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />{p.address}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-auto pt-1">
                            <Link
                              href={`/partners/${p.slug}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16a34a]/15 hover:bg-[#16a34a]/25 text-[#16a34a] text-xs font-semibold transition-colors border border-[#16a34a]/20"
                            >
                              View Listing <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                            {ctxLinks.map(l => (
                              <Link
                                key={l.href}
                                href={l.href}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F5F4F0] hover:bg-[#ECEAE4] text-[#1E2026] text-xs font-semibold transition-colors border border-black/8"
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>

              {top5.length > 2 && <div className="my-8"><AdUnitInArticle /></div>}

              {/* Keep exploring */}
              <section id="keep-exploring" className="scroll-mt-24 mt-10 bg-white rounded-2xl border border-black/5 p-6 sm:p-8">
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-3">Keep Exploring</h2>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                  <Link href={`/find/${findParam}`} className="text-[#16a34a] hover:underline">Pho near {cityName} on the map</Link>
                  <Link href="/partners" className="text-[#16a34a] hover:underline">All pho partner restaurants</Link>
                  <Link href="/find/pho-restaurants" className="text-[#16a34a] hover:underline">All pho restaurants</Link>
                  <Link href="/find" className="text-[#96602F] hover:underline">Search map</Link>
                  <Link href="/blog/what-is-pho-made-of" className="text-[#96602F] hover:underline">What is pho made of?</Link>
                  <Link href="/blog/is-pho-healthy" className="text-[#96602F] hover:underline">Is pho healthy?</Link>
                  <Link href="/blog/are-pho-and-ramen-the-same" className="text-[#96602F] hover:underline">Are pho and ramen the same?</Link>
                </div>
              </section>

              <div className="mt-10"><AdUnit /></div>
            </article>

            <div className="mt-16 pt-8 border-t border-black/8">
              <p className="text-[#6B6862] text-sm mb-4">Looking for great pho somewhere else?</p>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-[#16a34a] text-white font-medium text-sm hover:bg-[#128a3e] transition-colors"
              >
                Browse Pho Restaurants →
              </Link>
            </div>
          </div>

          <aside className="hidden lg:block sticky top-24 w-[300px] shrink-0 space-y-6 self-start">
            <div className="min-h-[250px]"><AdUnit /></div>
            <div className="min-h-[600px]"><AdUnit /></div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
