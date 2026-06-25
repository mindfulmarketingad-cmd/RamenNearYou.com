import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter } from 'lucide-react'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/ramennearyou', Icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com/ramennearyou', Icon: Facebook },
  { label: 'Twitter', href: 'https://twitter.com/ramennearyou', Icon: Twitter },
]

const footerLinks = {
  'Find Near Me': [
    { label: 'Ramen Open Late Near Me', href: '/find/ramen-open-late' },
    { label: 'Ramen Open Now Near Me', href: '/find/ramen-open-now' },
    { label: 'Tonkotsu Ramen Near Me', href: '/find/tonkotsu-ramen' },
    { label: 'Vegan Ramen Near Me', href: '/find/vegan-ramen' },
    { label: 'Spicy Ramen Near Me', href: '/find/spicy-ramen' },
    { label: 'All Ramen Searches', href: '/find' },
  ],
  Restaurants: [
    { label: 'Claim Your Listing', href: '/claim-your-listing' },
    { label: 'Become an Ambassador', href: '/ambassador' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#F5F4F0] border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
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
            <div className="flex items-center gap-3 mt-4">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-black/10 text-[#6B6862] hover:text-white hover:bg-[#B57F50] hover:border-[#B57F50] transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
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

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-black/5 flex flex-col items-center gap-5 text-[#6B6862] text-xs">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <Link href="/about" className="hover:text-[#1E2026] transition-colors">About</Link>
            <Link href="/contact" className="hover:text-[#1E2026] transition-colors">Contact</Link>
            <Link href="/disclaimer" className="hover:text-[#1E2026] transition-colors">Disclaimer</Link>
            <Link href="/privacy-policy" className="hover:text-[#1E2026] transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-[#1E2026] transition-colors">Terms</Link>
            <a href="/sitemap.xml" className="hover:text-[#1E2026] transition-colors">Sitemap</a>
          </div>
          <p className="text-center">&copy; {new Date().getFullYear()} RamenNearYou. All rights reserved.</p>
          <div className="flex items-center justify-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-black/10 text-[#6B6862] hover:text-white hover:bg-[#B57F50] hover:border-[#B57F50] transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
