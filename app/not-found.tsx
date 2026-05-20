import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { ChevronRight } from 'lucide-react'

const SITEMAP = [
  {
    heading: 'Find Ramen',
    links: [
      { label: 'Homepage', href: '/' },
      { label: 'Search Restaurants', href: '/search' },
      { label: 'Ramen Near Me (Map)', href: '/searchmap' },
      { label: 'Browse All Cities', href: '/cities' },
    ],
  },
  {
    heading: 'Browse by Type',
    links: [
      { label: 'Tonkotsu Ramen', href: '/broth' },
      { label: 'Shoyu Ramen', href: '/broth' },
      { label: 'Miso Ramen', href: '/broth' },
      { label: 'Spicy Ramen', href: '/broth' },
      { label: 'Vegan Ramen', href: '/broth' },
    ],
  },
  {
    heading: 'For Restaurants',
    links: [
      { label: 'List Your Restaurant', href: '/list' },
      { label: 'Get Featured', href: '/featured/apply' },
      { label: 'Claim Your Listing', href: '/claim' },
    ],
  },
  {
    heading: 'Discover',
    links: [
      { label: 'Ramen Blog', href: '/blog' },
      { label: 'Catering Services', href: '/catering' },
      { label: 'Ramen Ambassador', href: '/ambassador' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
  },
]

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />

      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 text-center border-b border-black/5">
        <div className="max-w-2xl mx-auto">
          <p className="font-serif text-8xl font-bold text-[#B57F50] mb-4">404</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">
            Page not found
          </h1>
          <p className="text-[#6B6862] text-base leading-relaxed mb-8">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
            Here&apos;s a map of everything on the site.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-lg bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/search"
              className="px-5 py-2.5 rounded-lg border border-black/8 text-[#6B6862] text-sm font-medium hover:text-[#1E2026] hover:border-black/15 transition-colors"
            >
              Search Restaurants
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-[#1E2026] text-sm font-semibold uppercase tracking-widest mb-8 text-center">
            Site Map
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {SITEMAP.map((section) => (
              <div key={section.heading}>
                <h3 className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-3">
                  {section.heading}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label + link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-1 text-[#6B6862] text-sm hover:text-[#1E2026] transition-colors group"
                      >
                        <ChevronRight className="w-3 h-3 text-[#B57F50]/50 group-hover:text-[#B57F50] transition-colors shrink-0" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
