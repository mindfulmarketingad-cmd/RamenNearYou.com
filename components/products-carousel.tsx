import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { products } from '@/lib/products'

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${
            i <= full
              ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && half
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-ink/20'
          }`}
        />
      ))}
    </span>
  )
}

export default function ProductsCarousel({ variant = 'section' }: { variant?: 'section' | 'inline' }) {
  if (products.length === 0) return null

  const cards = (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory">
      {products.map((product) => (
        <article
          key={product.slug}
          className="flex flex-col shrink-0 w-56 sm:w-64 bg-surface rounded-xl border border-line/5 overflow-hidden hover:border-brand/30 transition-colors snap-start"
        >
          {/* Image */}
          <div className="relative w-full h-40 bg-page">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
            {product.badge && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand text-white text-[10px] font-bold">
                {product.badge}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 p-4 gap-2">
            <p className="text-ink font-semibold text-sm leading-snug line-clamp-2">{product.name}</p>

            <div className="flex items-center gap-1.5">
              <StarRating rating={product.rating} />
              <span className="text-[10px] text-ink-soft">({product.reviewCount.toLocaleString()})</span>
            </div>

            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-none bg-brand hover:bg-brand-hi text-white text-xs font-semibold transition-colors mt-auto"
            >
              CHECK PRICE
            </a>
          </div>
        </article>
      ))}
    </div>
  )

  // Inline variant: framed like a listing card so it drops naturally into a
  // ranked list (e.g. between restaurant cards on /find pages) instead of
  // breaking out as its own full-bleed page section.
  if (variant === 'inline') {
    return (
      <div className="bg-surface border border-line/8 rounded-xl p-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-semibold text-brand-ink uppercase tracking-widest mb-0.5">Ramen Gear</p>
            <h2 className="font-serif text-base font-bold text-ink">Shop Our Picks</h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-brand-ink hover:text-brand-hi transition-colors shrink-0"
          >
            View all →
          </Link>
        </div>
        {cards}
        <p className="text-[10px] text-ink-soft mt-2">
          * Affiliate links — we may earn a small commission at no extra cost to you.
        </p>
      </div>
    )
  }

  return (
    <section className="bg-sunken border-t border-line/5 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-brand-ink uppercase tracking-widest mb-1">Ramen Gear</p>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">Shop Our Picks</h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-brand-ink hover:text-brand-hi transition-colors shrink-0"
          >
            View all →
          </Link>
        </div>

        {cards}

        <p className="text-[10px] text-ink-soft mt-3">
          * Affiliate links — we may earn a small commission at no extra cost to you.
        </p>
      </div>
    </section>
  )
}
