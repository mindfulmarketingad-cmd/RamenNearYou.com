import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, ChevronRight, ShoppingBag, ChevronDown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ramenCookers } from '@/lib/collections/ramen-cookers'

export const metadata = {
  title: 'Best Ramen Cookers | Electric Ramen Pots & Hot Pots | Ramen Near You',
  description: 'Shop our curated collection of ramen cookers and electric hot pots. Perfect for making restaurant-quality tonkotsu, miso, and shoyu ramen at home.',
  alternates: { canonical: 'https://www.ramennearyou.com/collections/ramen-cookers' },
}

export default function RamenCookersPage() {
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
            <span className="text-[#1E2026]">Ramen Cookers</span>
          </nav>

          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-[#B57F50]" />
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest">Ramen Equipment</p>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">
            Ramen Cookers
          </h1>
          <p className="text-[#6B6862] text-lg max-w-2xl leading-relaxed">
            The right cooker makes all the difference between decent home ramen and a bowl that tastes like the real thing. These hand-picked electric ramen pots and hot pots give you precise heat control, enough capacity for a proper serving, and easy cleanup — everything you need to make restaurant-quality ramen at home.
          </p>

          <p className="text-[#9B9490] text-xs mt-4">
            {ramenCookers.length} product{ramenCookers.length !== 1 ? 's' : ''} · Links go to Amazon. As an Amazon Associate we earn from qualifying purchases.
          </p>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {ramenCookers.map((product) => (
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
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">What to Look for in a Ramen Cooker</h2>
            <div className="grid sm:grid-cols-3 gap-6 text-sm text-[#6B6862] leading-relaxed">
              <div>
                <p className="font-semibold text-[#1E2026] mb-1">Capacity</p>
                <p>A single serving of ramen needs at least 2–3 cups of broth plus noodles and toppings. Look for a pot with at least 1.5–2 liters of capacity. If you cook for two, go for 3 liters or more so you have room to simmer without boiling over.</p>
              </div>
              <div>
                <p className="font-semibold text-[#1E2026] mb-1">Temperature Control</p>
                <p>Precise heat control is everything for ramen broth. Tonkotsu needs a rolling boil to emulsify fats into a creamy broth; miso and shoyu need a gentler simmer. A cooker with adjustable settings lets you dial in the right heat for each style.</p>
              </div>
              <div>
                <p className="font-semibold text-[#1E2026] mb-1">Material</p>
                <p>Stainless steel is durable and easy to clean. Nonstick interiors are convenient but require more care with utensils. Cast iron retains heat beautifully but is heavy. For most home ramen cooks, stainless or a quality nonstick electric pot is the easiest starting point.</p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div id="faq" className="mt-12 bg-white rounded-2xl border border-black/5 p-8">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-8">Frequently Asked Questions</h2>
            <div className="divide-y divide-black/5">
              {[
                {
                  q: 'What is the best pot for making ramen at home?',
                  a: 'An electric ramen pot or multi-cooker with adjustable temperature is the most versatile option. It lets you simmer broth at a low temperature for hours (essential for tonkotsu) and then crank the heat to cook noodles quickly. A heavy-bottomed saucepan on a stovetop works too, but an electric pot gives you more control and frees up burners.',
                },
                {
                  q: 'Can I make tonkotsu broth in an electric ramen cooker?',
                  a: 'Yes — in fact electric cookers are ideal for tonkotsu. The key to a rich, creamy tonkotsu broth is a sustained, vigorous boil for several hours to emulsify the pork fat and collagen. An electric pot with a high-heat setting handles this well, and many have lids that reduce mess from the boiling broth.',
                },
                {
                  q: 'How much capacity do I need for a ramen cooker?',
                  a: 'For one person, 1.5 liters is the minimum. For two, aim for at least 3 liters. If you like making a large batch of broth to refrigerate and use across multiple meals — which is the most efficient approach — go for 4–5 liters. Ramen broth reduces as it cooks, so starting with more capacity gives you flexibility.',
                },
                {
                  q: 'Is a dedicated ramen cooker better than a regular pot?',
                  a: 'A dedicated electric ramen pot offers convenience — precise temperature control, a self-contained heating element, and often a nonstick interior that makes cleanup faster. A regular heavy-bottomed pot on a gas or induction burner can produce equally good results if you are comfortable managing heat manually. For beginners, the electric option removes a lot of guesswork.',
                },
                {
                  q: 'What else can I use a ramen cooker for?',
                  a: 'Ramen cookers double as hot pots for shabu-shabu, sukiyaki, udon, pho, and any broth-based dish. Many work well as general-purpose electric saucepans for soups, boiling eggs, or steaming vegetables. They are one of the most versatile pieces of equipment in a Japanese-influenced kitchen.',
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
            <p className="text-[#1E2026] text-sm font-semibold mb-2">Ready to cook your first bowl?</p>
            <p className="text-[#6B6862] text-sm">
              Read our guide to <Link href="/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen" className="text-[#B57F50] underline font-medium">the 4 types of ramen</Link> to choose your first broth style — or pair your new cooker with a set of <Link href="/collections/ceramic-ramen-bowls" className="text-[#B57F50] underline font-medium">ceramic ramen bowls</Link>. Want to taste the real thing first? Find the best <Link href="/find/tonkotsu-ramen" className="text-[#B57F50] underline font-medium">tonkotsu ramen near you</Link> or <Link href="/find/miso-ramen" className="text-[#B57F50] underline font-medium">miso ramen near you</Link>.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
