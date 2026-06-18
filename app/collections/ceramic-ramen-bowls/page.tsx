import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ChevronRight, ShoppingBag, ChevronDown } from 'lucide-react'
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
            <Link href="/products" className="hover:text-[#1E2026] transition-colors">Products</Link>
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
                    <span className="inline-flex items-center gap-1.5 w-full justify-center px-4 py-2 rounded-none bg-[#B57F50] group-hover:bg-[#c8934f] text-white text-xs font-bold transition-colors">
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

          {/* FAQ */}
          <div id="faq" className="mt-12 bg-white rounded-2xl border border-black/5 p-8">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-8">Frequently Asked Questions</h2>
            <div className="divide-y divide-black/5">
              {[
                {
                  q: 'What size should a ceramic ramen bowl be?',
                  a: <>A ramen bowl should hold at least <strong>50–60 oz (1.5–1.8 liters)</strong>. That gives you room for a generous portion of broth, a full serving of noodles, and space to arrange toppings like chashu, soft egg, nori, and bamboo shoots without everything crowding. Most traditional Japanese ramen restaurant bowls fall in this range — if you see something sold as a &ldquo;soup bowl&rdquo; at under 30 oz, it&apos;s too small for proper ramen. See the styles we recommend above, or find <Link href="/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen" className="text-[#B57F50] underline font-medium">which ramen type to make first</Link>.</>
                },
                {
                  q: 'Is ceramic or porcelain better for ramen bowls?',
                  a: <>Ceramic wins for ramen. It&apos;s denser, thicker, and retains heat significantly longer than thin porcelain — which matters when your broth needs to stay hot through 10+ minutes of eating. Porcelain looks elegant but cools faster. If you preheat a ceramic bowl with hot water for 30 seconds before serving, your <Link href="/miso-ramen-near-me" className="text-[#B57F50] underline font-medium">miso ramen</Link> or <Link href="/tonkotsu-ramen-near-me" className="text-[#B57F50] underline font-medium">tonkotsu broth</Link> will stay at proper temperature from first noodle to last.</>
                },
                {
                  q: 'Can I put ceramic ramen bowls in the microwave?',
                  a: 'Most ceramic bowls are microwave-safe, but always check the product listing before buying. Bowls with metallic glazes or gold/silver trim are not microwave-safe. Plain ceramic with no metallic finishes is almost always fine. The sets listed on this page are selected to be practical for everyday home use — check the individual Amazon listing for the manufacturer\'s microwave guidance.'
                },
                {
                  q: 'Can ceramic ramen bowls go in the dishwasher?',
                  a: 'Most modern ceramic ramen bowls are dishwasher-safe, though hand-washing extends the life of the glaze over time. High heat in dishwashers can cause crazing (hairline cracks in glaze) on lower-quality ceramics. All products on this page are sourced from reputable sellers — check the individual listing for the specific manufacturer recommendation.'
                },
                {
                  q: 'What\'s the difference between a ramen bowl and a regular soup bowl?',
                  a: <>Ramen bowls are wider, deeper, and heavier than standard soup bowls. The wide mouth lets you lay out toppings across the surface — chashu slices, a halved soft egg, nori sheets — without them sinking into each other. The depth keeps the broth volume high so noodles stay submerged. A standard soup bowl holds 12–20 oz; a ramen bowl holds 50–60 oz. If you want to explore ramen styles before investing in bowls, browse our <Link href="/cities" className="text-[#B57F50] underline font-medium">ramen restaurant directory</Link> to taste the real thing first.</>
                },
                {
                  q: 'Are these bowls good for other noodle dishes besides ramen?',
                  a: <>Absolutely. The same bowl that works for <Link href="/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen" className="text-[#B57F50] underline font-medium">tonkotsu or shoyu ramen</Link> is perfect for udon, pho, soba, and Korean ramyeon. The wide, deep shape accommodates any broth-based noodle dish. Many home cooks use their ramen bowl as their go-to for any large-format soup — it&apos;s the most versatile bowl you can own.</>
                },
                {
                  q: 'How many ramen bowls do I need?',
                  a: 'The sets listed here come in pairs (Set of 2), which covers most households. If you regularly cook ramen for guests or a family of 4, grab two sets of 2. Ramen bowls are also a popular gift — a set of 2 with a bag of quality instant ramen makes an easy, well-received present for anyone who enjoys Japanese food. Check out our full collection for gift-ready options.'
                },
              ].map(({ q, a }, i) => (
                <details key={i} className="group py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between gap-4 font-semibold text-[#1E2026] text-sm sm:text-base select-none">
                    {q}
                    <ChevronDown className="w-4 h-4 text-[#B57F50] shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[#6B6862] text-sm leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Internal links */}
          <div className="mt-8 p-5 rounded-2xl bg-[#B57F50]/8 border border-[#B57F50]/20">
            <p className="text-[#1E2026] text-sm font-semibold mb-2">Ready to use your new bowl?</p>
            <p className="text-[#6B6862] text-sm">
              Read our guide to <Link href="/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen" className="text-[#B57F50] underline font-medium">the 4 types of ramen</Link> to know exactly what to make — or find a great ramen restaurant near you in our <Link href="/cities" className="text-[#B57F50] underline font-medium">city directory</Link>. Looking for <Link href="/tonkotsu-ramen-near-me" className="text-[#B57F50] underline font-medium">tonkotsu ramen near you</Link> or <Link href="/miso-ramen-near-me" className="text-[#B57F50] underline font-medium">miso ramen near you</Link>? Browse by broth type.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
