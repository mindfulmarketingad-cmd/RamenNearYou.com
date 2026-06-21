import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  'Ramen Near Me': [
    { label: 'Tonkotsu Ramen Near Me', href: '/tonkotsu-ramen-near-me' },
    { label: 'Spicy Ramen Near Me', href: '/spicy-ramen-near-me' },
    { label: 'Miso Ramen Near Me', href: '/miso-ramen-near-me' },
    { label: 'Shoyu Ramen Near Me', href: '/shoyu-ramen-near-me' },
    { label: 'Shio Ramen Near Me', href: '/shio-ramen-near-me' },
    { label: 'Vegan Ramen Near Me', href: '/vegan-ramen-near-me' },
    { label: 'Vegetarian Ramen Near Me', href: '/vegetarian-ramen-near-me' },
    { label: 'Korean Ramen Near Me', href: '/korean-ramen-near-me' },
    { label: 'Japanese Ramen Near Me', href: '/japanese-ramen-near-me' },
  ],
  'Find Near Me': [
    { label: 'Ramen Open Late Near Me', href: '/find/ramen-open-late' },
    { label: 'Ramen Open Now Near Me', href: '/find/ramen-open-now' },
    { label: 'Tonkotsu Ramen Near Me', href: '/find/tonkotsu-ramen' },
    { label: 'Vegan Ramen Near Me', href: '/find/vegan-ramen' },
    { label: 'Spicy Ramen Near Me', href: '/find/spicy-ramen' },
    { label: 'All Ramen Searches', href: '/find' },
  ],
  Browse: [
    { label: 'Search the Ramen Map', href: '/' },
    { label: 'Ramen Broth Types', href: '/broth' },
    { label: 'Browse Cities & States', href: '/cities' },
    { label: 'Compare Ramen Restaurants', href: '/compare' },
    { label: 'Ramen Products & Kits', href: '/products' },
    { label: 'Restaurant Reviews', href: '/reviews' },
    { label: 'Ramen Blog & Guides', href: '/blog' },
    { label: 'Ramen FAQ', href: '/faq' },
  ],
  Restaurants: [
    { label: 'List Your Restaurant', href: '/list' },
    { label: 'Claim Your Listing', href: '/claim-your-listing' },
    { label: 'Get Catering Leads', href: '/catering' },
    { label: 'Become an Ambassador', href: '/ambassador' },
    { label: 'Apply to Be Featured', href: '/featured/apply' },
  ],
  Company: [
    { label: 'RamenNearYou+', href: '/plus' },
    { label: 'About RamenNearYou', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#F5F4F0] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={32} height={32} className="flex-shrink-0" />
              <span className="font-serif text-base font-bold text-[#1E2026]">RamenNearYou</span>
            </Link>
            <p className="text-[#6B6862] text-sm leading-relaxed">
              The most trusted ramen restaurant directory. Find top-rated ramen near you — searched by city, broth type, or name.
            </p>
            <a href="mailto:hello@ramennearyououtreach.com" className="inline-block mt-3 text-xs text-[#B57F50] hover:underline">
              hello@ramennearyououtreach.com
            </a>
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
