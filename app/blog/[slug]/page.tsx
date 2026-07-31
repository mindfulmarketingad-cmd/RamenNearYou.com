import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Phone, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getBlogPost, blogPosts } from '@/lib/blog-posts'
import type { RestaurantCard } from '@/lib/blog-posts'
import { getRestaurantBySlug } from '@/lib/restaurants'
import { getReviewSlug, hasReviewPage } from '@/lib/reviews'
import BlogScrollMapWrapper from '@/components/blog-scroll-map-wrapper'
import AdUnit from '@/components/ad-unit'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import { splitHtmlForAds } from '@/lib/split-html-for-ads'
import { extractToc } from '@/lib/blog-toc'
import type { MapCard } from '@/components/blog-scroll-map'
import { getPerfectFor, slugifyAuthor } from '@/lib/perfect-for'
import { CITY_GUIDE_REDIRECTS } from '@/lib/city-guide-migration'
import { pickStockPhoto } from '@/lib/stock-photos'
import { getCityListicleParams, matchCityListicle } from '@/lib/city-listicles'
import CityRamenListicle from './city-ramen-listicle'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return [
    ...blogPosts.filter((post) => !CITY_GUIDE_REDIRECTS[post.slug]).map((post) => ({ slug: post.slug })),
    ...getCityListicleParams().map((slug) => ({ slug })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (CITY_GUIDE_REDIRECTS[slug]) return {}

  const cityListicle = matchCityListicle(slug)
  if (cityListicle) {
    const { cityName, stateCode, totalCount } = cityListicle
    const title = `5 Best Ramen Restaurants in ${cityName}, ${stateCode}`
    const description = `The 5 highest-rated ramen restaurants in ${cityName}, ${stateCode}, ranked by Google rating and review count from the ${totalCount} ramen spots we track in the area — with hours, ratings, and what makes each one worth a visit.`
    const url = `https://www.ramennearyou.com/blog/${slug}`
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, type: 'article', url },
    }
  }

  const post = getBlogPost(slug)
  if (!post) return {}
  const url = `https://www.ramennearyou.com/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.date,
    },
  }
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= full ? 'text-amber-400 fill-amber-400' : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-[#1E2026]/20'}`}
        />
      ))}
    </span>
  )
}

function RestaurantCardItem({ card }: { card: RestaurantCard }) {
  return (
    <article className="flex flex-col sm:flex-row bg-[#ffffff] rounded-xl border border-black/5 overflow-hidden hover:border-[#B57F50]/40 transition-colors">
      {/* Photo */}
      <div className="relative w-full sm:w-52 shrink-0 h-48 sm:h-auto bg-[#F5F4F0]">
        {card.photo ? (
          <Image
            src={card.photo}
            alt={card.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#ffffff]" />
        )}
        <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#B57F50] flex items-center justify-center text-[#1E2026] text-xs font-bold">
          {card.rank}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        <div>
          <h2 className="font-semibold text-[#1E2026] text-lg leading-snug mb-1">{card.name}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <StarRating rating={card.rating} />
            <span className="text-[#1E2026]/70 text-xs">{card.rating.toFixed(1)} ({card.reviewCount.toLocaleString()}+ reviews)</span>
            <span className="text-[#1E2026]/20 text-xs">·</span>
            {card.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-[#B57F50]/15 text-[#96602F] text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>

        <p className="text-[#6B6862] text-sm leading-relaxed">{card.description}</p>

        <div className="flex flex-col gap-1 text-xs text-[#6B6862]/70">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#96602F] shrink-0" />
            {card.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#96602F] shrink-0" />
            {card.address}
          </span>
        </div>

        <div className="mt-auto pt-1">
          <Link
            href={`/${card.citySlug}/${card.stateSlug}/${card.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#c8934f] text-xs font-semibold transition-colors border border-[#B57F50]/20"
          >
            View Listing <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  if (CITY_GUIDE_REDIRECTS[slug]) permanentRedirect(CITY_GUIDE_REDIRECTS[slug])

  const cityListicle = matchCityListicle(slug)
  if (cityListicle) {
    const title = `5 Best Ramen Restaurants in ${cityListicle.cityName}, ${cityListicle.stateCode}`
    const url = `https://www.ramennearyou.com/blog/${slug}`
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: title,
      itemListElement: cityListicle.top5.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Restaurant',
          name: r.name,
          url: `https://www.ramennearyou.com/${r.citySlug}/${r.stateSlug}/${r.slug}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: r.street || undefined,
            addressLocality: r.city,
            addressRegion: r.stateCode,
            postalCode: r.postalCode || undefined,
            addressCountry: 'US',
          },
          ...(r.rating != null && r.reviewCount > 0
            ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: r.rating, reviewCount: r.reviewCount, bestRating: 5, worstRating: 1 } }
            : {}),
        },
      })),
    }
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.ramennearyou.com/blog' },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    }
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <CityRamenListicle city={cityListicle} />
      </>
    )
  }

  const post = getBlogPost(slug)
  if (!post) notFound()

  // Every post needs a featured image — fall back to a deterministic stock
  // photo for the handful of posts that don't have a real headerImage set.
  const headerImage = post.headerImage ?? pickStockPhoto(post.slug)

  // Table of contents built from the post's own H2s. This also strips any old
  // hand-rolled "Quick Navigation" block and stamps ids onto headings that lack
  // one, so every post gets the same numbered TOC and render tocHtml (not
  // post.content) below.
  const { headings, html: tocHtml } = extractToc(post.content)
  // Skip only on short posts that don't have enough headings for a TOC to help.
  const showToc = headings.length >= 3

  // Two in-article ads, spread evenly through the body copy.
  const contentParts = splitHtmlForAds(tocHtml, 2)

  // Enrich restaurant cards with lat/lng for map layout
  const hasCards = post.restaurantCards && post.restaurantCards.length > 0
  const enrichedCards: MapCard[] = hasCards
    ? post.restaurantCards!.map((card) => {
        const r = getRestaurantBySlug(card.slug)
        return {
          rank: card.rank,
          slug: card.slug,
          citySlug: r?.citySlug ?? card.citySlug,
          stateSlug: r?.stateSlug ?? card.stateSlug,
          name: card.name,
          rating: card.rating,
          reviewCount: card.reviewCount,
          address: card.address,
          phone: card.phone,
          description: card.description,
          photo: card.photo,
          tags: card.tags,
          lat: r?.latitude ?? card.lat ?? null,
          lng: r?.longitude ?? card.lng ?? null,
          perfectFor: r ? getPerfectFor(r) : undefined,
          reviewSlug: r && hasReviewPage(getReviewSlug(r)) ? getReviewSlug(r) : undefined,
        }
      })
    : []

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'RamenNearYou',
      url: 'https://www.ramennearyou.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RamenNearYou',
      url: 'https://www.ramennearyou.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.ramennearyou.com/blog/${post.slug}`,
    },
    image: headerImage.startsWith('http') ? headerImage : `https://www.ramennearyou.com${headerImage}`,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://www.ramennearyou.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.h1 ?? post.title, item: `https://www.ramennearyou.com/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {post.additionalSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.additionalSchema) }} />
      )}
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10 lg:items-start">
        <div className={hasCards ? '' : 'max-w-2xl'}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap pt-2">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-[#1E2026] transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{post.h1 ?? post.title}</span>
          </nav>

          <article className="mt-4">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#B57F50]/20 text-[#96602F]">
                  {post.category}
                </span>
                <span className="text-xs text-[#6B6862]/60">{post.date}</span>
                <span className="text-xs text-[#6B6862]/60">·</span>
                <span className="text-xs text-[#6B6862]/60">{post.readTime}</span>
              </div>

              {post.imageFirst && (
                <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-6">
                  <Image
                    src={headerImage}
                    alt={post.headerImageAlt ?? post.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized={!post.headerImage}
                  />
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E2026] leading-tight mb-4">
                {post.h1 ?? post.title}
              </h1>

              <div className="mb-5">
                <AdUnitInArticle />
              </div>

              <p className="text-[#6B6862] text-lg leading-relaxed mb-5">{post.description}</p>
              {post.author && (
                <Link
                  href={`/authors/${slugifyAuthor(post.author.name)}`}
                  className="inline-flex items-center gap-2.5 group"
                >
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={36}
                    height={36}
                    className="rounded-full border border-black/8"
                    unoptimized
                  />
                  <div>
                    <p className="text-sm font-medium text-[#1E2026] group-hover:text-[#96602F] transition-colors">{post.author.name}</p>
                    <p className="text-xs text-[#6B6862]/60">Contributor profile →</p>
                  </div>
                </Link>
              )}
            </header>

            {!post.imageFirst && (
              <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-8">
                <Image
                  src={headerImage}
                  alt={post.headerImageAlt ?? post.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={!post.headerImage}
                />
              </div>
            )}

            {showToc && (
              <nav
                aria-label="Table of contents"
                className="mb-8 rounded-xl border border-[#B57F50]/25 bg-[#F5F4F0] p-5"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#96602F] mb-3">
                  Table of Contents
                </p>
                <ol className="space-y-1.5">
                  {headings.map((h, i) => (
                    <li key={h.id} className="flex gap-2.5 text-[15px] leading-snug">
                      <span className="text-[#96602F] font-semibold tabular-nums shrink-0">{i + 1}.</span>
                      <a href={`#${h.id}`} className="text-[#1E2026] hover:text-[#96602F] hover:underline">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {contentParts.map((chunk, i) => (
              <div key={i}>
                <div className="prose-ramen" dangerouslySetInnerHTML={{ __html: chunk }} />
                {i < contentParts.length - 1 && (
                  <div className="my-6">
                    <AdUnitInArticle />
                  </div>
                )}
              </div>
            ))}

            {hasCards && (
              <section className="mt-10 mb-6 bg-[#F5F4F0] border border-black/5 rounded-2xl p-6 sm:p-8">
                <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-3">
                  How we ranked these restaurants
                </h2>
                <p className="text-[#6B6862] text-sm leading-relaxed">
                  {post.rankingNote ?? `We ranked these ${enrichedCards.length} spots by analyzing the sentiment of their Google reviews — reading what real diners said about the broth, noodles, service, and overall experience, not just star averages. Restaurants that consistently drew praise for ramen quality across hundreds of reviews ranked highest. Review count, recency, and recurring criticism (long waits, watery broth, inconsistent service) were all factored in to surface the spots locals actually keep coming back to.`}
                </p>
              </section>
            )}

            {hasCards && (
              <BlogScrollMapWrapper cards={enrichedCards} listHeading={post.listHeading} />
            )}

            {!hasCards && post.listHeading && (
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mt-10 mb-6">
                {post.listHeading}
              </h2>
            )}

            {post.outroContent && (
              <div
                className="prose-ramen mt-10"
                dangerouslySetInnerHTML={{ __html: post.outroContent }}
              />
            )}

            <div className="mt-10">
              <AdUnit />
            </div>
          </article>

          <div className="mt-16 pt-8 border-t border-black/8">
            <p className="text-[#6B6862] text-sm mb-4">Looking for great ramen near you?</p>
            <Link
              href="/cities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-[#B57F50] text-white font-medium text-sm hover:bg-[#c8934f] transition-colors"
            >
              Browse Ramen Restaurants →
            </Link>
          </div>
        </div>

          {/* Side rail — reserved space/dimensions for a sticky sidebar ad,
              desktop only (below lg the ad units already run inline in the
              article body). */}
          <aside className="hidden lg:block sticky top-24 w-[300px] shrink-0 space-y-6 self-start">
            <div className="min-h-[250px]">
              <AdUnit />
            </div>
            <div className="min-h-[600px]">
              <AdUnit />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
