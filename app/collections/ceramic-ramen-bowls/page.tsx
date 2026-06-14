import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ChevronRight, ShoppingBag } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ceramicRamenBowls } from '@/lib/collections/ceramic-ramen-bowls'

export const metadata = {
  title: 'Best Ceramic Ramen Bowls | Ramen Near You',
  description: 'Shop our curated collection of ceramic ramen bowls. Authentic Japanese-style bowls perfect for tonkotsu, miso, and shoyu ramen at home.',
  alternates: { canonical: 'https://www.ramennearyou.com/collections/ceramic-ramen-bowls' },
}

export default function CeramicRamenBowlsPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 sm:px-6 bg-[#F5F4F0] border-b border-black/5">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/collections" className="hover:text-[#1E2026] transition-colors">Collections</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">Ceramic Ramen Bowls</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-[#B57F50]" />
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest">Ramen Accessories</p>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Ceramic Ramen Bowls
          </h1>
          <p className="text-[#6B6862] text-lg max-w-2xl leading-relaxed">
            A great bowl matters. These hand-picked ceramic ramen bowls are deep enough for a proper portion, retain heat well, and look the part — whether you&apos;re making tonkotsu at home or serving guests.
          </p>

          <p className="text-[#9B9490] text-xs mt-4">
            {ceramicRamenBowls.length} products · Links go to Amazon. As an Amazon Associate we earn from qualifying purchases.
          </p>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {ceramicRamenBowls.map((product) => (
              <a
                key={product.id}
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-black/5 hover:border-[#B57F50]/40 hover:shadow-lg hover:shadow-black/10 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative w-full aspect-square bg-[#F5F4F0] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#B57F50] text-white text-[11px] font-semibold shadow-sm">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                  <div className="flex flex-wrap gap-1">
                    {product.tags?.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-[#F5F4F0] text-[#6B6862] text-[11px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[#1E2026] text-sm font-semibold leading-snug group-hover:text-[#B57F50] transition-colors">
                    {product.name}
                  </p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center gap-1.5 w-full justify-center px-4 py-2 rounded-xl bg-[#B57F50] group-hover:bg-[#c8934f] text-white text-xs font-bold transition-colors">
                      Check Price <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Buying guide */}
          <div className="mt-16 bg-white rounded-2xl border border-black/5 p-8">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">What to Look for in a Ramen Bowl</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-sm text-[#6B6862] leading-relaxed">
              <div>
                <p className="font-semibold text-[#1E2026] mb-1">Size</p>
                <p>A proper ramen bowl holds at least 50–60 oz. Anything smaller and you&apos;re crowding the toppings. Japanese restaurant bowls are typically wider and deeper than Western soup bowls.</p>
              </div>
              <div>
                <p className="font-semibold text-[#1E2026] mb-1">Heat Retention</p>
                <p>Ceramic retains heat far better than thin porcelain. Preheat your bowl with hot water for 30 seconds before serving and your broth will stay hot through the last noodle.</p>
              </div>
              <div>
                <p className="font-semibold text-[#1E2026] mb-1">Shape</p>
                <p>A wide mouth lets you arrange toppings properly — chashu, soft egg, nori, bamboo shoots — without everything piling in the center. High walls keep the broth deep and hot.</p>
              </div>
            </div>
          </div>

          {/* Internal links */}
          <div className="mt-8 p-5 rounded-2xl bg-[#B57F50]/8 border border-[#B57F50]/20">
            <p className="text-[#1E2026] text-sm font-semibold mb-2">Ready to use your new bowl?</p>
            <p className="text-[#6B6862] text-sm mb-3">
              Read our guide to <Link href="/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen" className="text-[#B57F50] underline">the 4 types of ramen</Link> to know exactly what to make — or find a great ramen restaurant near you on our <Link href="/cities" className="text-[#B57F50] underline">city directory</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
