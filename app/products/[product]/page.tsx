import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ChevronRight, Check } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getProduct, products } from '@/lib/products'

interface Props {
  params: Promise<{ product: string }>
}

export async function generateStaticParams() {
  return products.map((p) => ({ product: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  const url = `https://www.ramennearyou.com/products/${slug}`
  return {
    title: product.metaTitle,
    description: product.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      url,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
  }
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= full
                ? 'text-amber-400 fill-amber-400'
                : i === full + 1 && half
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-ink/20'
            }`}
          />
        ))}
      </span>
      <span className="text-sm text-ink-soft">
        {rating.toFixed(1)} <span className="text-ink/30">·</span> {count.toLocaleString()} reviews
      </span>
    </div>
  )
}

export default async function ProductPage({ params }: Props) {
  const { product: slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { '@type': 'Brand', name: 'RamenNearYou' },
    offers: {
      '@type': 'Offer',
      ...(product.price && { price: product.price.replace('$', ''), priceCurrency: 'USD' }),
      availability: 'https://schema.org/InStock',
      url: product.affiliateUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.ramennearyou.com/products' },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://www.ramennearyou.com/products/${slug}`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Navbar />

      <main className="min-h-screen bg-page pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-ink-soft mb-8 pt-2 flex-wrap">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/products" className="hover:text-ink transition-colors">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink">{product.name}</span>
          </nav>

          {/* Hero grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">

            {/* Image */}
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface border border-line/5">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand text-white text-xs font-bold shadow">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs font-medium text-brand-ink mb-2 uppercase tracking-wide">{product.category}</p>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink leading-tight mb-3">
                  {product.name}
                </h1>
                <StarRating rating={product.rating} count={product.reviewCount} />
              </div>

              <p className="text-ink-soft text-base leading-relaxed">{product.description}</p>

              {/* CTA */}
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-center gap-2.5 w-full px-8 py-4 rounded-none bg-brand hover:bg-brand-hi text-white font-semibold text-base transition-colors shadow-md shadow-brand/20"
              >
                CHECK PRICE
              </a>

              <p className="text-xs text-ink-soft/60 text-center -mt-1">
                * Affiliate link — we may earn a small commission at no extra cost to you.
              </p>

              {/* Quick-win bullet list */}
              <ul className="flex flex-col gap-2 pt-1">
                {product.features.slice(0, 4).map((f) => (
                  <li key={f.title} className="flex items-start gap-2 text-sm text-ink">
                    <Check className="w-4 h-4 text-brand-ink shrink-0 mt-0.5" />
                    {f.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Features */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-8">Why This Product?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {product.features.map((f) => (
                <div
                  key={f.title}
                  className="bg-surface rounded-2xl border border-line/5 p-6 flex flex-col gap-3 hover:border-brand/30 transition-colors"
                >
                  <span className="text-3xl">{f.icon}</span>
                  <h3 className="font-semibold text-ink text-base">{f.title}</h3>
                  <p className="text-ink-soft text-sm leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Specs */}
          <section className="mb-14">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-6">Specifications</h2>
            <div className="bg-surface rounded-2xl border border-line/5 overflow-hidden">
              {product.specs.map((spec, i) => (
                <div
                  key={spec.label}
                  className={`flex items-center gap-4 px-6 py-4 ${i !== product.specs.length - 1 ? 'border-b border-line/5' : ''}`}
                >
                  <span className="text-sm font-medium text-ink-soft w-40 shrink-0">{spec.label}</span>
                  <span className="text-sm text-ink">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="bg-contrast rounded-2xl p-8 sm:p-10 text-center">
            <p className="text-sunken/70 text-sm mb-2">{product.category}</p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-3">{product.tagline}</h2>
            <p className="text-sunken/70 text-sm mb-6 max-w-lg mx-auto">{product.description}</p>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-none bg-brand hover:bg-brand-hi text-white font-semibold transition-colors"
            >
              CHECK PRICE
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
