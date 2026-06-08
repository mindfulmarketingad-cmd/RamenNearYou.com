import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { products } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Ramen Accessories & Products | Shop Ramen Gear',
  description: 'Shop ramen accessories and gear recommended by RamenNearYou — chopsticks, bowls, and everything you need for the perfect ramen night at home.',
  alternates: { canonical: 'https://www.ramennearyou.com/products' },
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-1.5">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= full
                ? 'text-amber-400 fill-amber-400'
                : i === full + 1 && half
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-[#1E2026]/20'
            }`}
          />
        ))}
      </span>
      <span className="text-xs text-[#6B6862]">{rating.toFixed(1)} ({count.toLocaleString()})</span>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-8 pt-2">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Products</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">Ramen Gear</h1>
            <p className="text-[#6B6862] text-lg max-w-2xl">
              Everything you need for a proper ramen night at home — chopsticks, bowls, and more. All hand-picked and affiliate-supported.
            </p>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <article key={product.slug} className="flex flex-col bg-white rounded-2xl border border-black/5 overflow-hidden hover:border-[#B57F50]/30 transition-colors group">
                {/* Image */}
                <div className="relative w-full aspect-[4/3] bg-[#F5F4F0]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    unoptimized
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#B57F50] text-white text-xs font-bold">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-[#B57F50] uppercase tracking-widest mb-1">{product.category}</p>
                    <h2 className="font-semibold text-[#1E2026] text-base leading-snug">{product.name}</h2>
                  </div>

                  <StarRating rating={product.rating} count={product.reviewCount} />

                  <p className="text-[#6B6862] text-sm leading-relaxed line-clamp-2 flex-1">{product.description}</p>

                  <div className="flex items-center justify-between pt-1">
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-xs font-semibold text-[#B57F50] hover:text-[#c8934f] transition-colors"
                    >
                      View details →
                    </Link>
                  </div>

                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
                  >
                    CHECK PRICE
                  </a>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center text-xs text-[#9B9490] mt-10">
            * Links are affiliate links. We may earn a small commission at no extra cost to you.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
