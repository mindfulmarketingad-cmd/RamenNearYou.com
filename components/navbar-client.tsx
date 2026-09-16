'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Utensils, ArrowRight, Flame, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const BANNER_HEIGHT = 40 // px — keep in sync with the banner's h-10
const NAVBAR_HEIGHT = 64 // px — keep in sync with the nav row's h-16

const SHOP_AFFILIATE_URL = 'https://amzn.to/4h3lyIL'

// Promo banner rotation. Add or edit deals here — the banner picks up the
// whole list automatically. `discount` renders in the accent colour.
const PROMO_DEALS = [
  { discount: '70% Off', product: 'Ceramic Ramen Bowls' },
  { discount: '25% Off', product: 'Stainless Steel Chopsticks' },
  { discount: '50% Off', product: 'Ramen Making Kits' },
  { discount: '10% Off', product: 'Wooden Chopsticks' },
]
const DEAL_ROTATE_MS = 4000

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/state', label: 'By State' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/find', label: 'Find' },
  { href: '/blog', label: 'Blog' },
  { href: '/partners', label: 'Partners' },
  { href: '/about', label: 'About' },
]

export default function NavbarClient({ restaurantCount, phoCount }: { restaurantCount?: number; phoCount?: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isHomepage, setIsHomepage] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(true) // start hidden to avoid SSR/first-paint flash
  const [dealIndex, setDealIndex] = useState(0)
  const [dealPaused, setDealPaused] = useState(false)

  useEffect(() => {
    setIsHomepage(window.location.pathname === '/')
    setBannerDismissed(localStorage.getItem('shopBannerDismissed') === '1')
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Rotate the banner deals. Paused on hover/focus so the copy can't swap out
  // from under someone reading it, and switched off entirely for visitors who
  // asked for reduced motion — this is exactly the kind of persistent
  // background movement that setting exists to stop.
  useEffect(() => {
    if (dealPaused || PROMO_DEALS.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setInterval(
      () => setDealIndex(i => (i + 1) % PROMO_DEALS.length),
      DEAL_ROTATE_MS,
    )
    return () => clearInterval(timer)
  }, [dealPaused])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => { setUser(data.user) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Promo banner: single top strip. When shown, push the page down by the
  // banner height so every page's existing top padding (calibrated for the
  // 64px navbar) still clears the now-taller fixed header.
  const showBanner = !bannerDismissed
  useEffect(() => {
    const extraHeight = showBanner ? BANNER_HEIGHT : 0
    document.body.style.paddingTop = extraHeight ? `${extraHeight}px` : ''
    // Full fixed-header height (banner + navbar, or just navbar), exposed so
    // any full-viewport-height layout (e.g. the mapOnly searchmap) can size
    // itself against the *actual* header instead of assuming just the navbar.
    document.documentElement.style.setProperty('--total-header-h', `${extraHeight + NAVBAR_HEIGHT}px`)
    return () => {
      document.body.style.paddingTop = ''
      document.documentElement.style.removeProperty('--total-header-h')
    }
  }, [showBanner])

  function dismissBanner() {
    setBannerDismissed(true)
    try { localStorage.setItem('shopBannerDismissed', '1') } catch {}
  }

  async function handleSignOut() {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : null

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname?.startsWith(href + '/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[1200]">
      {/* Site-wide promo banner — rotates through the affiliate deals. Every
          slide points at the same link, so a rotation mid-click can never send
          someone somewhere they didn't intend. */}
      {showBanner && (
        <div className="relative h-10 bg-[#1E2026] text-white flex items-center justify-center px-10 overflow-hidden">
          <a
            href={SHOP_AFFILIATE_URL}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="group flex items-center gap-2 text-sm font-semibold whitespace-nowrap"
            onMouseEnter={() => setDealPaused(true)}
            onMouseLeave={() => setDealPaused(false)}
            onFocus={() => setDealPaused(true)}
            onBlur={() => setDealPaused(false)}
          >
            {/* Re-keyed per slide so the entrance animation replays. aria-live
                announces each new deal without moving focus. */}
            <span key={dealIndex} className="animate-deal-in" aria-live="polite">
              <span className="text-[#E0A56A]">{PROMO_DEALS[dealIndex].discount}</span>{' '}
              {PROMO_DEALS[dealIndex].product}
            </span>
            <ArrowRight className="w-4 h-4 text-[#E0A56A] transition-transform group-hover:translate-x-1" />
          </a>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nav bar — shadow deepens slightly once the page is scrolled, so the
          header reads as "floating above" content instead of a flat static
          bar sitting on top of it. */}
      <div className={`bg-white border-b border-black/5 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex-shrink-0">
                <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={36} height={36} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                {/* Signature touch: a few soft steam wisps drifting off the
                    bowl mark — subtle enough to be a detail, not a distraction. */}
                <span aria-hidden="true" className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                  <span className="steam-wisp w-[3px] h-2 rounded-full bg-[#B57F50]/40 block" />
                  <span className="steam-wisp w-[3px] h-2 rounded-full bg-[#B57F50]/30 block" />
                  <span className="steam-wisp w-[3px] h-2 rounded-full bg-[#B57F50]/40 block" />
                </span>
              </span>
              <span className="font-serif text-lg font-bold tracking-tight transition-colors text-[#1E2026] group-hover:text-[#96602F]">
                RamenNearYou
              </span>
              {/* Real-data trust badge — quietly signals scale/authority
                  without touching page content. Hidden on smaller screens
                  where nav space is tight. */}
              {typeof restaurantCount === 'number' && restaurantCount > 0 && (
                <span className="hidden 2xl:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-[#F5F4F0] border border-black/8 text-[#96602F] text-[11px] font-semibold whitespace-nowrap">
                  <Flame className="w-3 h-3" />
                  {restaurantCount.toLocaleString()} Ramen Spots
                </span>
              )}
              {/* Second badge only from xl up — at lg the logo, two badges,
                  the nav links and Sign In together overflow and wrap. */}
              {typeof phoCount === 'number' && phoCount > 0 && (
                <span className="hidden 2xl:inline-flex items-center gap-1 ml-1.5 px-2 py-0.5 rounded-full bg-[#16a34a]/10 border border-[#16a34a]/20 text-[#16a34a] text-[11px] font-semibold whitespace-nowrap">
                  🍲 {phoCount.toLocaleString()} Pho Spots
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2">
              {/* Desktop nav links — active route gets a filled pill instead
                  of just a color change, so it's obvious at a glance which
                  section of the site you're in. */}
              <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2 xl:px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                      isActive(link.href)
                        ? 'text-[#1E2026] font-semibold bg-[#B57F50]/10'
                        : 'text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={SHOP_AFFILIATE_URL}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="px-2 xl:px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5"
                >
                  Shop
                </a>
                {user && (
                  <>
                    <Link href="/profile" className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                      <span className="w-6 h-6 rounded-full bg-[#B57F50]/30 border border-[#B57F50]/50 flex items-center justify-center text-xs font-bold text-[#96602F]">
                        {userInitial}
                      </span>
                    </Link>
                    <button onClick={handleSignOut} className="px-3 py-2 text-sm text-[#96602F] hover:text-[#96602F]/80 transition-colors rounded-lg hover:bg-black/5">
                      Sign Out
                    </button>
                  </>
                )}
              </nav>

              {/* Main site CTA — restaurant owners claiming/paying for their
                  listing is the primary business action, so it gets the
                  boldest treatment in the header, ahead of Sign In. */}
              <Link
                href="/claim-your-listing"
                className="hidden lg:flex items-center gap-1.5 px-3 xl:px-4 py-2.5 rounded-none bg-[#1E2026] hover:bg-black text-white text-xs xl:text-sm font-bold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              >
                <Store className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                Restaurant Owners
              </Link>

              {!user && (
                <Link
                  href="/auth/login"
                  className="hidden lg:flex items-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm xl:text-base font-semibold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <Utensils className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger only */}
              <button
                className="lg:hidden p-2 rounded-lg transition-colors text-[#1E2026] hover:bg-black/5"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav-menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-nav-menu" className="bg-[#ffffff] border-t border-black/8 px-4 pb-6 max-h-[80vh] overflow-y-auto">
            <Link
              href="/claim-your-listing"
              className="flex items-center justify-center gap-2 mt-3 mb-1 px-4 py-3 rounded-none bg-[#1E2026] text-white text-sm font-bold"
              onClick={() => setMenuOpen(false)}
            >
              <Store className="w-4 h-4" />
              Restaurant Owners
            </Link>

            {!user && (
              <Link
                href="/auth/login"
                className="sm:hidden flex items-center justify-center gap-2 mb-1 px-4 py-3 rounded-none bg-[#B57F50] text-white text-sm font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                <Utensils className="w-4 h-4" />
                Sign In
              </Link>
            )}

            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 text-sm transition-colors flex items-center gap-2 ${
                    isActive(link.href) ? 'text-[#1E2026] font-semibold' : 'text-[#6B6862] hover:text-[#1E2026]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {isActive(link.href) && <span className="w-1.5 h-1.5 rounded-full bg-[#B57F50]" />}
                  {link.label}
                </Link>
              ))}

              <a
                href={SHOP_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </a>

              {typeof restaurantCount === 'number' && restaurantCount > 0 && (
                <p className="flex items-center gap-1.5 pt-2 mt-1 border-t border-black/5 text-[11px] text-[#96602F] font-semibold">
                  <Flame className="w-3 h-3" /> {restaurantCount.toLocaleString()} ramen spots and counting
                </p>
              )}

              {user && (
                <div className="mt-2 flex flex-col gap-1">
                  <Link href="/saved" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                    Saved Restaurants
                  </Link>
                  <Link href="/profile" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#B57F50]/30 border border-[#B57F50]/50 flex items-center justify-center text-xs font-bold text-[#96602F]">
                        {userInitial}
                      </span>
                      {user.email}
                    </span>
                  </Link>
                  <div className="border-t border-black/5 pt-2">
                    <button onClick={handleSignOut} className="py-2 text-sm text-[#96602F] hover:text-[#96602F]/80 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
