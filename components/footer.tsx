import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  Browse: [
    { label: 'Browse Cities', href: '/cities' },
    { label: 'Broth Types', href: '/broth' },
    { label: 'Products', href: '/products' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Blog', href: '/blog' },
    { label: 'Catering', href: '/catering' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  Restaurants: [
    { label: 'List Your Restaurant', href: '/list' },
    { label: 'Claim a Listing', href: '/cities' },
    { label: 'Get Catering Leads', href: '/catering' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#F5F4F0] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={32} height={32} className="flex-shrink-0" />
              <span className="font-serif text-base font-bold text-[#1E2026]">RamenNearYou</span>
            </Link>
            <p className="text-[#6B6862] text-sm leading-relaxed">
              The most trusted ramen restaurant directory. Find top-rated ramen near you — searched by city, broth type, or name.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[#1E2026] text-sm font-semibold mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[#6B6862] text-sm hover:text-[#1E2026] transition-colors"
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
        <div className="mt-12 pt-12 border-t border-black/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-[#1E2026] font-semibold mb-1">Get new ramen spots in your inbox</h4>
              <p className="text-[#6B6862] text-sm">We&apos;ll notify you when new restaurants are added near you.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-0 rounded-lg overflow-hidden border border-black/8 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-[#ffffff] text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none min-w-0 sm:min-w-[220px]"
              />
              <button className="px-5 py-3 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-medium transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#6B6862] text-xs">
          <p>&copy; {new Date().getFullYear()} RamenNearYou. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[#1E2026] transition-colors">About</Link>
            <Link href="/blog" className="hover:text-[#1E2026] transition-colors">Blog</Link>
            <Link href="/cities" className="hover:text-[#1E2026] transition-colors">Cities</Link>
            <Link href="/contact" className="hover:text-[#1E2026] transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-[#1E2026] transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-[#1E2026] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
