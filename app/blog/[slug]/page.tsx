import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Phone, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getBlogPost, blogPosts } from '@/lib/blog-posts'
import type { RestaurantCard } from '@/lib/blog-posts'
import { getRestaurantBySlug } from '@/lib/restaurants'
import BlogScrollMapWrapper from '@/components/blog-scroll-map-wrapper'
import type { MapCard } from '@/components/blog-scroll-map'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
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
              <span key={tag} className="px-2 py-0.5 rounded-full bg-[#B57F50]/15 text-[#B57F50] text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>

        <p className="text-[#6B6862] text-sm leading-relaxed">{card.description}</p>

        <div className="flex flex-col gap-1 text-xs text-[#6B6862]/70">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
            {card.phone}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
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
  const post = getBlogPost(slug)
  if (!post) notFound()

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
          lat: r?.latitude ?? null,
          lng: r?.longitude ?? null,
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
    ...(post.headerImage ? { image: post.headerImage.startsWith('http') ? post.headerImage : `https://www.ramennearyou.com${post.headerImage}` } : {}),
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
        <div className={hasCards ? 'max-w-7xl mx-auto' : 'max-w-2xl mx-auto'}>
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
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#B57F50]/20 text-[#B57F50]">
                  {post.category}
                </span>
                <span className="text-xs text-[#6B6862]/60">{post.date}</span>
                <span className="text-xs text-[#6B6862]/60">·</span>
                <span className="text-xs text-[#6B6862]/60">{post.readTime}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E2026] leading-tight mb-4 text-center">
                {post.h1 ?? post.title}
              </h1>
              <p className="text-[#6B6862] text-lg leading-relaxed mb-5">{post.description}</p>
              {post.author && (
                <div className="flex items-center gap-2.5">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={36}
                    height={36}
                    className="rounded-full border border-black/8"
                    unoptimized
                  />
                  <div>
                    <p className="text-sm font-medium text-[#1E2026]">{post.author.name}</p>
                    <p className="text-xs text-[#6B6862]/60">{post.date}</p>
                  </div>
                </div>
              )}
            </header>

            {post.headerImage && (
              <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-8">
                <Image
                  src={post.headerImage}
                  alt={post.headerImageAlt ?? post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div
              className="prose-ramen"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

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
          </article>

          <div className="mt-16 pt-8 border-t border-black/8">
            <p className="text-[#6B6862] text-sm mb-4">Looking for great ramen near you?</p>
            <Link
              href="/cities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#B57F50] text-white font-medium text-sm hover:bg-[#c8934f] transition-colors"
            >
              Browse Ramen Restaurants →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
