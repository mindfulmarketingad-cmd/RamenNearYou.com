'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, UtensilsCrossed } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const navLinks = [
  { label: 'Browse Cities', href: '/cities' },
  { label: 'Broth Types', href: '#broth' },
  { label: 'Catering', href: '#catering' },
  { label: 'Submit a Restaurant', href: '#submit' },
]

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
    setMobileOpen(false)
    router.push('/')
    router.refresh()
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#2F323A] shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#77567A] flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif text-lg font-bold text-white tracking-tight group-hover:text-[#77567A] transition-colors">
              RamenNearYou
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#B0B3BB] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Auth state */}
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="/list"
                  className="px-4 py-2 rounded-md bg-[#77567A] text-white text-sm font-medium hover:bg-[#8a6a8d] transition-colors"
                >
                  List Your Restaurant
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#77567A]/30 border border-[#77567A]/50 flex items-center justify-center text-xs font-bold text-[#77567A]">
                    {userInitial}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-[#B0B3BB] hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="/list"
                  className="px-4 py-2 rounded-md bg-[#77567A] text-white text-sm font-medium hover:bg-[#8a6a8d] transition-colors"
                >
                  List Your Restaurant
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm text-[#B0B3BB] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#2F323A] border-t border-white/10 px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="py-2 text-sm text-[#B0B3BB] hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/list"
              className="mt-2 px-4 py-2 rounded-md bg-[#77567A] text-white text-sm font-medium text-center hover:bg-[#8a6a8d] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              List Your Restaurant
            </Link>
            {user ? (
              <div className="mt-2 flex items-center justify-between py-2">
                <span className="text-sm text-[#B0B3BB]">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-[#77567A] hover:text-[#77567A]/80 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="mt-1 py-2 text-sm text-[#B0B3BB] hover:text-white transition-colors text-center"
                onClick={() => setMobileOpen(false)}
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
