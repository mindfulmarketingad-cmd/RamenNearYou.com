'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, X, Utensils, ArrowRight, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const BANNER_HEIGHT = 40 // px — keep in sync with the banner's h-10
const NAVBAR_HEIGHT = 64 // px — keep in sync with the nav row's h-16

export default function NavbarClient() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [isHomepage, setIsHomepage] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(true) // start hidden to avoid SSR/first-paint flash

  useEffect(() => {
    setIsHomepage(window.location.pathname === '/')
    setBannerDismissed(localStorage.getItem('promoBannerDismissed') === '1')
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) { setAuthChecked(true); return }
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setAuthChecked(true) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Promo banner: top strip, logged-out visitors only, dismissible. When shown,
  // push the page down by the banner height so every page's existing top padding
  // (calibrated for the 64px navbar) still clears the now-taller fixed header.
  const showBanner = authChecked && !user && !bannerDismissed
  useEffect(() => {
    document.body.style.paddingTop = showBanner ? `${BANNER_HEIGHT}px` : ''
    // Full fixed-header height (banner + navbar, or just navbar), exposed so
    // any full-viewport-height layout (e.g. the mapOnly searchmap) can size
    // itself against the *actual* header instead of assuming just the navbar.
    document.documentElement.style.setProperty(
      '--total-header-h',
      `${showBanner ? BANNER_HEIGHT + NAVBAR_HEIGHT : NAVBAR_HEIGHT}px`
    )
    return () => {
      document.body.style.paddingTop = ''
      document.documentElement.style.removeProperty('--total-header-h')
    }
  }, [showBanner])

  function dismissBanner() {
    setBannerDismissed(true)
    try { localStorage.setItem('promoBannerDismissed', '1') } catch {}
  }

  async function handleSignOut() {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : null

  return (
    <header className="fixed top-0 left-0 right-0 z-[1200]">
      {/* Promo banner */}
      {showBanner && (
        <div className="relative h-10 bg-[#1E2026] text-white flex items-center justify-center px-10">
          <Link href="/auth/login" className="group flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
            <span>Sign up for <span className="text-[#E0A56A]">full map access</span></span>
            <ArrowRight className="w-4 h-4 text-[#E0A56A] transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nav bar */}
      <div className="bg-white shadow-sm border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={36} height={36} className="flex-shrink-0" />
              <span className="font-serif text-lg font-bold tracking-tight transition-colors text-[#1E2026] group-hover:text-[#96602F]">
                RamenNearYou
              </span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Desktop nav links */}
              <nav className="hidden sm:flex items-center gap-1">
                <Link href="/" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                  Home
                </Link>
                <Link href="/find" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                  Find
                </Link>
                <Link href="/reviews" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                  Reviews
                </Link>
                <Link href="/recipes" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                  Recipes
                </Link>
                <Link href="/blog" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                  Blog
                </Link>
                <Link href="/partners" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                  Partners
                </Link>
                <Link href="/about" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                  About
                </Link>
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

              <Link
                href="/claim-your-listing"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-none bg-[#1E2026] hover:bg-black text-white text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              >
                <Store className="w-4 h-4" />
                List Your Restaurant
              </Link>

              {!user && (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                >
                  <Utensils className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Mobile hamburger only */}
              <button
                className="sm:hidden p-2 rounded-lg transition-colors text-[#1E2026] hover:bg-black/5"
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
              className="sm:hidden flex items-center justify-center gap-2 mt-3 mb-1 px-4 py-3 rounded-none bg-[#1E2026] text-white text-sm font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              <Store className="w-4 h-4" />
              List Your Restaurant
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
              <Link href="/" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
              <Link href="/find" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                Find
              </Link>
              <Link href="/reviews" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                Reviews
              </Link>
              <Link href="/recipes" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                Recipes
              </Link>
              <Link href="/blog" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/partners" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                Partners
              </Link>
              <Link href="/about" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                About
              </Link>

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
