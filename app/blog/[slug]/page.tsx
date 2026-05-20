import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Phone, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getBlogPost, blogPosts } from '@/lib/blog-posts'
import type { RestaurantCard } from '@/lib/blog-posts'

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
          className={`w-3.5 h-3.5 ${i <= full ? 'text-amber-400 fill-amber-400' : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-white/20'}`}
        />
      ))}
    </span>
  )
}

function RestaurantCardItem({ card }: { card: RestaurantCard }) {
  return (
    <article className="flex flex-col sm:flex-row bg-[#2F323A] rounded-xl border border-white/5 overflow-hidden hover:border-[#B57F50]/40 transition-colors">
      {/* Photo */}
      <div className="relative w-full sm:w-52 shrink-0 h-48 sm:h-auto bg-[#1E2026]">
        {card.photo ? (
          <Image
            src={card.photo}
            alt={card.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#2F323A]" />
        )}
        <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-[#B57F50] flex items-center justify-center text-white text-xs font-bold">
          {card.rank}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-2.5">
        <div>
          <h2 className="font-semibold text-white text-lg leading-snug mb-1">{card.name}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <StarRating rating={card.rating} />
            <span className="text-white/70 text-xs">{card.rating.toFixed(1)} ({card.reviewCount.toLocaleString()}+ reviews)</span>
            <span className="text-white/20 text-xs">·</span>
            {card.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-[#B57F50]/15 text-[#B57F50] text-xs font-medium">{tag}</span>
            ))}
          </div>
        </div>

        <p className="text-[#B0B3BB] text-sm leading-relaxed">{card.description}</p>

        <div className="flex flex-col gap-1 text-xs text-[#B0B3BB]/70">
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
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-[#1a1c22] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-2">
            <Link href="/blog" className="text-sm text-[#B57F50] hover:underline">
              ← Back to Blog
            </Link>
          </div>

          <article className="mt-8">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#B57F50]/20 text-[#B57F50]">
                  {post.category}
                </span>
                <span className="text-xs text-[#B0B3BB]/60">{post.date}</span>
                <span className="text-xs text-[#B0B3BB]/60">·</span>
                <span className="text-xs text-[#B0B3BB]/60">{post.readTime}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-[#B0B3BB] text-lg leading-relaxed">{post.description}</p>
            </header>

            <div
              className="prose-ramen"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.restaurantCards && post.restaurantCards.length > 0 && (
              <div className="mt-8 flex flex-col gap-5">
                {post.restaurantCards.map((card) => (
                  <RestaurantCardItem key={card.slug} card={card} />
                ))}
              </div>
            )}

            {post.outroContent && (
              <div
                className="prose-ramen mt-10"
                dangerouslySetInnerHTML={{ __html: post.outroContent }}
              />
            )}
          </article>

          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-[#B0B3BB] text-sm mb-4">Looking for great ramen near you?</p>
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
