import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, ExternalLink } from 'lucide-react'
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
              : 'text-[#1E2026]/20'
          }`}
        />
      ))}
    </span>
  )
}

export default function ProductsCarousel() {
  if (products.length === 0) return null

  return (
    <section className="bg-[#F5F4F0] border-t border-black/5 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-[#B57F50] uppercase tracking-widest mb-1">Ramen Gear</p>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026]">Shop Our Picks</h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-[#B57F50] hover:text-[#c8934f] transition-colors shrink-0"
          >
            View all →
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide snap-x snap-mandatory">
          {products.map((product) => (
            <article
              key={product.slug}
              className="flex flex-col shrink-0 w-56 sm:w-64 bg-white rounded-xl border border-black/5 overflow-hidden hover:border-[#B57F50]/30 transition-colors snap-start"
            >
              {/* Image */}
              <div className="relative w-full h-40 bg-[#ECEAE4]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {product.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#B57F50] text-white text-[10px] font-bold">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-4 gap-2">
                <p className="text-[#1E2026] font-semibold text-sm leading-snug line-clamp-2">{product.name}</p>

                <div className="flex items-center gap-1.5">
                  <StarRating rating={product.rating} />
                  <span className="text-[10px] text-[#9B9490]">({product.reviewCount.toLocaleString()})</span>
                </div>

                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold transition-colors mt-auto"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Check Price On Amazon
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="text-[10px] text-[#9B9490] mt-3">
          * Affiliate links — we may earn a small commission at no extra cost to you.
        </p>
      </div>
    </section>
  )
}
