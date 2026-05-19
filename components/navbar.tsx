'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, X, Phone, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import SearchModal from '@/components/search-modal'

const navLinks = [
  { label: 'Browse Cities', href: '/cities' },
  { label: 'Broth Types', href: '/broth' },
  { label: 'Catering', href: '/catering' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

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
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={36} height={36} className="flex-shrink-0" />
            <span className="font-serif text-lg font-bold text-white tracking-tight group-hover:text-[#77567A] transition-colors">
              RamenNearYou
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={
                  (link as { highlight?: boolean }).highlight
                    ? 'text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors'
                    : 'text-sm text-[#B0B3BB] hover:text-white transition-colors'
                }
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-[#B0B3BB] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="/saved"
                  className="text-sm text-[#B0B3BB] hover:text-white transition-colors"
                >
                  Saved
                </Link>
                <Link
                  href="/list"
                  className="px-4 py-2 rounded-md bg-[#77567A] text-white text-sm font-medium hover:bg-[#8a6a8d] transition-colors"
                >
                  List Your Restaurant
                </Link>
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <div className="w-8 h-8 rounded-full bg-[#77567A]/30 border border-[#77567A]/50 flex items-center justify-center text-xs font-bold text-[#77567A]">
                      {userInitial}
                    </div>
                  </Link>
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

          <a
            href="tel:+13412034429"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#77567A]/10 hover:bg-[#77567A]/20 border border-[#77567A]/20 transition-colors group"
          >
            <Phone className="w-3.5 h-3.5 text-[#77567A]" />
            <div className="text-right">
              <p className="text-[10px] text-[#B0B3BB]/70 leading-none mb-0.5">Catering Hotline</p>
              <p className="text-xs font-semibold text-white group-hover:text-[#77567A] transition-colors leading-none">(341) 203-4429</p>
            </div>
          </a>

          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-[#B0B3BB] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#2F323A] border-t border-white/10 px-4 pb-4">
          <a
            href="tel:+13412034429"
            className="flex items-center gap-2 mt-3 mb-1 px-3 py-2.5 rounded-lg bg-[#77567A]/10 border border-[#77567A]/20"
          >
            <Phone className="w-4 h-4 text-[#77567A] shrink-0" />
            <div>
              <p className="text-[10px] text-[#B0B3BB]/70 leading-none mb-0.5">Catering Hotline</p>
              <p className="text-sm font-semibold text-white leading-none">(341) 203-4429</p>
            </div>
          </a>
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
              <div className="mt-2 flex flex-col gap-1">
                <Link
                  href="/saved"
                  className="py-2 text-sm text-[#B0B3BB] hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Saved Restaurants
                </Link>
                <div className="flex items-center justify-between py-2 border-t border-white/5">
                  <span className="text-sm text-[#B0B3BB]">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-[#77567A] hover:text-[#77567A]/80 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
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

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
