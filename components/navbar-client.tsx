'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, X, Utensils } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function NavbarClient() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isHomepage, setIsHomepage] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setIsHomepage(window.location.pathname === '/')
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : null

  const transparent = false // navbar always has solid white background

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={36} height={36} className="flex-shrink-0" />
            <span className="font-serif text-lg font-bold tracking-tight transition-colors text-[#1E2026] group-hover:text-[#B57F50]">
              RamenNearYou
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {/* Desktop nav links */}
            <nav className="hidden sm:flex items-center gap-1">
              <Link href="/find" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                Find
              </Link>
              <Link href="/products" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                Products
              </Link>
              <Link href="/reviews" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                Reviews
              </Link>
              <Link href="/catering" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                Catering
              </Link>
              <Link href="/blog" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                Blog
              </Link>
              {user ? (
                <>
                  <Link href="/profile" className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                    <span className="w-6 h-6 rounded-full bg-[#B57F50]/30 border border-[#B57F50]/50 flex items-center justify-center text-xs font-bold text-[#B57F50]">
                      {userInitial}
                    </span>
                  </Link>
                  <button onClick={handleSignOut} className="px-3 py-2 text-sm text-[#B57F50] hover:text-[#B57F50]/80 transition-colors rounded-lg hover:bg-black/5">
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth/login" className="px-3 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors rounded-lg hover:bg-black/5">
                  Sign In
                </Link>
              )}
            </nav>

            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
            >
              <Utensils className="w-3.5 h-3.5" />
              Order Ramen
            </Link>

            {/* Mobile hamburger only */}
            <button
              className="sm:hidden p-2 rounded-lg transition-colors text-[#1E2026] hover:bg-black/5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-[#ffffff] border-t border-black/8 px-4 pb-6 max-h-[80vh] overflow-y-auto">
          <Link
            href="/"
            className="sm:hidden flex items-center justify-center gap-2 mt-3 mb-1 px-4 py-3 rounded-none bg-[#B57F50] text-white text-sm font-semibold"
            onClick={() => setMenuOpen(false)}
          >
            <Utensils className="w-4 h-4" />
            Order Ramen
          </Link>

          <nav className="flex flex-col gap-1 pt-3">
            <Link href="/find" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
              Find
            </Link>
            <Link href="/products" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
            <Link href="/reviews" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
              Reviews
            </Link>
            <Link href="/catering" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
              Catering
            </Link>
            <Link href="/blog" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
              Blog
            </Link>

            {user ? (
              <div className="mt-2 flex flex-col gap-1">
                <Link href="/saved" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                  Saved Restaurants
                </Link>
                <Link href="/profile" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMenuOpen(false)}>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#B57F50]/30 border border-[#B57F50]/50 flex items-center justify-center text-xs font-bold text-[#B57F50]">
                      {userInitial}
                    </span>
                    {user.email}
                  </span>
                </Link>
                <div className="border-t border-black/5 pt-2">
                  <button onClick={handleSignOut} className="py-2 text-sm text-[#B57F50] hover:text-[#B57F50]/80 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="mt-1 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
