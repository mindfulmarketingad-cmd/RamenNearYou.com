'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Utensils, ArrowRight, Flame, Rss } from 'lucide-react'
import ThemeToggle from '@/components/theme-toggle'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const BANNER_HEIGHT = 40 // px — keep in sync with the banner's h-10
const NAVBAR_HEIGHT = 64 // px — keep in sync with the nav row's h-16

const SHOP_AFFILIATE_URL = 'https://amzn.to/4h3lyIL'
const VIATOR_EXPERIENCES_URL =
  'https://www.viator.com/searchResults/all?text=Ramen+experiences&pid=P00320180&mcid=42383&medium=link'

// Promo banner rotation. Add or edit slides here — the banner picks up the
// whole list automatically. `lead` renders in the accent colour, `rest` in
// white, and each slide carries its own destination.
const PROMO_DEALS = [
  { lead: '70% Off', rest: 'Ceramic Ramen Bowls', href: SHOP_AFFILIATE_URL },
  { lead: '25% Off', rest: 'Stainless Steel Chopsticks', href: SHOP_AFFILIATE_URL },
  { lead: 'Book Local', rest: 'Ramen Experiences', href: VIATOR_EXPERIENCES_URL },
  { lead: '50% Off', rest: 'Ramen Making Kits', href: SHOP_AFFILIATE_URL },
  { lead: '10% Off', rest: 'Wooden Chopsticks', href: SHOP_AFFILIATE_URL },
]
const DEAL_ROTATE_MS = 7000

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/search', label: 'Search' },
  { href: '/state', label: 'By State' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/find', label: 'Find' },
  { href: '/experiences', label: 'Experiences' },
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
      {/* Site-wide promo banner — rotates through the affiliate slides. Slides
          now point at different destinations (shop vs. experiences), so the
          hover/focus pause below is what keeps a rotation from swapping the
          link out from under someone reaching to click it. */}
      {showBanner && (
        <div className="relative h-10 bg-contrast text-white flex items-center justify-center px-10 overflow-hidden">
          <a
            href={PROMO_DEALS[dealIndex].href}
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
              <span className="text-[#E0A56A]">{PROMO_DEALS[dealIndex].lead}</span>{' '}
              {PROMO_DEALS[dealIndex].rest}
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
      <div className={`bg-surface border-b border-line/5 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="relative flex-shrink-0">
                <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={36} height={36} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                {/* Signature touch: a few soft steam wisps drifting off the
                    bowl mark — subtle enough to be a detail, not a distraction. */}
                <span aria-hidden="true" className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                  <span className="steam-wisp w-[3px] h-2 rounded-full bg-brand/40 block" />
                  <span className="steam-wisp w-[3px] h-2 rounded-full bg-brand/30 block" />
                  <span className="steam-wisp w-[3px] h-2 rounded-full bg-brand/40 block" />
                </span>
              </span>
              <span className="font-serif text-lg font-bold tracking-tight transition-colors text-ink group-hover:text-brand-ink">
                RamenNearYou
              </span>
              {/* Real-data trust badge — quietly signals scale/authority
                  without touching page content. Hidden on smaller screens
                  where nav space is tight. */}
              {typeof restaurantCount === 'number' && restaurantCount > 0 && (
                <span className="hidden 2xl:inline-flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full bg-sunken border border-line/8 text-brand-ink text-[11px] font-semibold whitespace-nowrap">
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
                        ? 'text-ink font-semibold bg-brand/10'
                        : 'text-ink-soft hover:text-ink hover:bg-black/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href={SHOP_AFFILIATE_URL}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="px-2 xl:px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors text-ink-soft hover:text-ink hover:bg-black/5"
                >
                  Shop
                </a>
                {user && (
                  <>
                    {/* Members-only, so it's only worth showing once we know
                        someone is signed in. */}
                    <Link
                      href="/feed"
                      className={`flex items-center gap-1.5 px-2 xl:px-3 py-2 text-sm rounded-lg whitespace-nowrap transition-colors ${
                        isActive('/feed')
                          ? 'text-ink font-semibold bg-brand/10'
                          : 'text-ink-soft hover:text-ink hover:bg-black/5'
                      }`}
                    >
                      <Rss className="w-3.5 h-3.5" /> My Feed
                    </Link>
                    <Link href="/profile" className="flex items-center gap-1.5 px-3 py-2 text-sm text-ink-soft hover:text-ink transition-colors rounded-lg hover:bg-black/5">
                      <span className="w-6 h-6 rounded-full bg-brand/30 border border-brand/50 flex items-center justify-center text-xs font-bold text-brand-ink">
                        {userInitial}
                      </span>
                    </Link>
                    <button onClick={handleSignOut} className="px-3 py-2 text-sm text-brand-ink hover:text-brand-ink/80 transition-colors rounded-lg hover:bg-black/5">
                      Sign Out
                    </button>
                  </>
                )}
              </nav>

              <ThemeToggle />

              {/* Single header CTA. Restaurant owners reach /claim-your-listing
                  through the footer now — the header keeps one action so the
                  nav reads as a feed app rather than a sales page. */}
              {!user && (
                <Link
                  href="/auth/login"
                  className="hidden lg:flex items-center gap-1.5 xl:gap-2 px-4 xl:px-6 py-2.5 rounded-none bg-brand hover:bg-brand-hi text-white text-sm xl:text-base font-semibold whitespace-nowrap transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <Utensils className="w-4 h-4" />
                  Log In
                </Link>
              )}

              {/* Mobile hamburger only */}
              <button
                className="lg:hidden p-2 rounded-lg transition-colors text-ink hover:bg-black/5"
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
          <div id="mobile-nav-menu" className="bg-surface border-t border-line/8 px-4 pb-6 max-h-[80vh] overflow-y-auto">
            {!user && (
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 mt-3 mb-1 px-4 py-3 rounded-none bg-brand text-white text-sm font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                <Utensils className="w-4 h-4" />
                Log In
              </Link>
            )}

            <nav className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-2 text-sm transition-colors flex items-center gap-2 ${
                    isActive(link.href) ? 'text-ink font-semibold' : 'text-ink-soft hover:text-ink'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {isActive(link.href) && <span className="w-1.5 h-1.5 rounded-full bg-brand" />}
                  {link.label}
                </Link>
              ))}

              <a
                href={SHOP_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="py-2 text-sm text-ink-soft hover:text-ink transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                Shop
              </a>

              <ThemeToggle variant="row" />

              {typeof restaurantCount === 'number' && restaurantCount > 0 && (
                <p className="flex items-center gap-1.5 pt-2 mt-1 border-t border-line/5 text-[11px] text-brand-ink font-semibold">
                  <Flame className="w-3 h-3" /> {restaurantCount.toLocaleString()} ramen spots and counting
                </p>
              )}

              {user && (
                <div className="mt-2 flex flex-col gap-1">
                  <Link href="/feed" className="py-2 text-sm text-ink-soft hover:text-ink transition-colors flex items-center gap-2" onClick={() => setMenuOpen(false)}>
                    <Rss className="w-3.5 h-3.5" /> My Feed
                  </Link>
                  <Link href="/saved" className="py-2 text-sm text-ink-soft hover:text-ink transition-colors" onClick={() => setMenuOpen(false)}>
                    Saved Restaurants
                  </Link>
                  <Link href="/profile" className="py-2 text-sm text-ink-soft hover:text-ink transition-colors" onClick={() => setMenuOpen(false)}>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-brand/30 border border-brand/50 flex items-center justify-center text-xs font-bold text-brand-ink">
                        {userInitial}
                      </span>
                      {user.email}
                    </span>
                  </Link>
                  <div className="border-t border-line/5 pt-2">
                    <button onClick={handleSignOut} className="py-2 text-sm text-brand-ink hover:text-brand-ink/80 transition-colors">
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
