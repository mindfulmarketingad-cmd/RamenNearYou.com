import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  Browse: [
    { label: 'Browse Cities', href: '/cities' },
    { label: 'Broth Types', href: '/broth' },
    { label: 'Blog', href: '/blog' },
    { label: 'Catering', href: '/catering' },
  ],
  Cities: [
    { label: 'Atlanta, GA', href: '/atlanta/ga' },
    { label: 'Nashville, TN', href: '/cities' },
    { label: 'Austin, TX', href: '/cities' },
    { label: 'Chicago, IL', href: '/cities' },
  ],
  Restaurants: [
    { label: 'List Your Restaurant', href: '/list' },
    { label: 'Claim a Listing', href: '/cities' },
    { label: 'Get Catering Leads', href: '/catering' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#1E2026] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={32} height={32} className="flex-shrink-0" />
              <span className="font-serif text-base font-bold text-white">RamenNearYou</span>
            </Link>
            <p className="text-[#B0B3BB] text-sm leading-relaxed">
              The most trusted ramen restaurant directory. Find top-rated ramen near you — searched by city, broth type, or name.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white text-sm font-semibold mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#B0B3BB] text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-12 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Get new ramen spots in your inbox</h4>
              <p className="text-[#B0B3BB] text-sm">We&apos;ll notify you when new restaurants are added near you.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-0 rounded-lg overflow-hidden border border-white/10 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-[#2F323A] text-white placeholder-[#B0B3BB]/50 text-sm outline-none min-w-0 sm:min-w-[220px]"
              />
              <button className="px-5 py-3 bg-[#77567A] hover:bg-[#8a6a8d] text-white text-sm font-medium transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#B0B3BB] text-xs">
          <p>&copy; {new Date().getFullYear()} RamenNearYou. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/catering" className="hover:text-white transition-colors">Catering</Link>
            <Link href="/cities" className="hover:text-white transition-colors">Cities</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
