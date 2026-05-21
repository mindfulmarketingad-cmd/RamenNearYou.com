'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Menu, X, Phone, Search, ChevronDown, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import SearchModal from '@/components/search-modal'

export interface NavCity {
  city: string
  citySlug: string
  stateSlug: string
  stateCode: string
  count: number
}

export interface NavState {
  state: string
  stateSlug: string
  stateCode: string
  count: number
}

interface Props {
  cities: NavCity[]
  states: NavState[]
}

function CityDropdown({ cities, onClose }: { cities: NavCity[]; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const filtered = query.trim()
    ? cities.filter(
        (c) =>
          c.city.toLowerCase().includes(query.toLowerCase()) ||
          c.stateCode.toLowerCase().includes(query.toLowerCase())
      )
    : cities

  return (
    <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-black/8 rounded-xl shadow-xl overflow-hidden z-50">
      <div className="p-3 border-b border-black/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9B9490]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search cities…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm bg-[#F5F4F0] rounded-lg outline-none text-[#1E2026] placeholder-[#9B9490]"
          />
        </div>
      </div>
      <ul className="max-h-64 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <li className="px-4 py-3 text-sm text-[#9B9490] text-center">No cities found</li>
        ) : (
          filtered.map((c) => (
            <li key={`${c.citySlug}-${c.stateSlug}`}>
              <Link
                href={`/${c.citySlug}/${c.stateSlug}`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-[#F5F4F0] transition-colors group"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
                  <span className="text-sm text-[#1E2026] truncate">{c.city}</span>
                  <span className="text-xs text-[#9B9490] shrink-0">{c.stateCode}</span>
                </span>
                <span className="text-xs text-[#9B9490] shrink-0 ml-2">{c.count}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
      <div className="border-t border-black/5 p-2">
        <Link
          href="/cities"
          onClick={onClose}
          className="block w-full text-center text-xs text-[#B57F50] hover:text-[#c8934f] py-1.5 transition-colors font-medium"
        >
          View all cities →
        </Link>
      </div>
    </div>
  )
}

function StateDropdown({ states, onClose }: { states: NavState[]; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-black/8 rounded-xl shadow-xl overflow-hidden z-50">
      <ul className="py-1">
        {states.map((s) => (
          <li key={s.stateSlug}>
            <Link
              href={`/${s.stateSlug}`}
              onClick={onClose}
              className="flex items-center justify-between px-4 py-2.5 hover:bg-[#F5F4F0] transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-sm text-[#1E2026]">{s.state}</span>
                <span className="text-xs font-semibold text-[#B57F50]">{s.stateCode}</span>
              </span>
              <span className="text-xs text-[#9B9490]">{s.count} spots</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="border-t border-black/5 p-2">
        <Link
          href="/cities"
          onClick={onClose}
          className="block w-full text-center text-xs text-[#B57F50] hover:text-[#c8934f] py-1.5 transition-colors font-medium"
        >
          Browse all states →
        </Link>
      </div>
    </div>
  )
}

export default function NavbarClient({ cities, states }: Props) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<'city' | 'state' | null>(null)
  const [mobileCityOpen, setMobileCityOpen] = useState(false)
  const [mobileStateOpen, setMobileStateOpen] = useState(false)
  const [mobileCityQuery, setMobileCityQuery] = useState('')
  const [mobileStateQuery, setMobileStateQuery] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const closeDropdown = useCallback(() => setOpenDropdown(null), [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  async function handleSignOut() {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    setMobileOpen(false)
    router.push('/')
    router.refresh()
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : null

  const filteredMobileCities = mobileCityQuery.trim()
    ? cities.filter(
        (c) =>
          c.city.toLowerCase().includes(mobileCityQuery.toLowerCase()) ||
          c.stateCode.toLowerCase().includes(mobileCityQuery.toLowerCase())
      )
    : cities

  const filteredMobileStates = mobileStateQuery.trim()
    ? states.filter(
        (s) =>
          s.state.toLowerCase().includes(mobileStateQuery.toLowerCase()) ||
          s.stateCode.toLowerCase().includes(mobileStateQuery.toLowerCase())
      )
    : states

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5F4F0] shadow-lg border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/ramen-bowl.svg" alt="RamenNearYou" width={36} height={36} className="flex-shrink-0" />
            <span className="font-serif text-lg font-bold text-[#1E2026] tracking-tight group-hover:text-[#B57F50] transition-colors">
              RamenNearYou
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {/* Ramen By City dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5 transition-colors"
              >
                Ramen By City
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'city' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'city' && (
                <CityDropdown cities={cities} onClose={closeDropdown} />
              )}
            </div>

            {/* Ramen By State dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === 'state' ? null : 'state')}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5 transition-colors"
              >
                Ramen By State
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'state' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'state' && (
                <StateDropdown states={states} onClose={closeDropdown} />
              )}
            </div>

            <Link href="/catering" className="px-3 py-2 rounded-lg text-sm text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5 transition-colors">
              Catering
            </Link>
            <Link href="/blog" className="px-3 py-2 rounded-lg text-sm text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5 transition-colors">
              Blog
            </Link>

            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5 transition-colors ml-1"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/saved" className="text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors">
                  Saved
                </Link>
                <Link
                  href="/list"
                  className="px-4 py-2 rounded-md bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors"
                >
                  List Your Restaurant
                </Link>
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <div className="w-8 h-8 rounded-full bg-[#B57F50]/30 border border-[#B57F50]/50 flex items-center justify-center text-xs font-bold text-[#B57F50]">
                      {userInitial}
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  href="/list"
                  className="px-4 py-2 rounded-md bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors"
                >
                  List Your Restaurant
                </Link>
                <Link href="/auth/login" className="text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors">
                  Sign In
                </Link>
              </div>
            )}
          </nav>

          <a
            href="tel:+13412034429"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B57F50]/10 hover:bg-[#B57F50]/20 border border-[#B57F50]/20 transition-colors group"
          >
            <Phone className="w-3.5 h-3.5 text-[#B57F50]" />
            <div className="text-right">
              <p className="text-[10px] text-[#6B6862]/70 leading-none mb-0.5">Catering Hotline</p>
              <p className="text-xs font-semibold text-[#1E2026] group-hover:text-[#B57F50] transition-colors leading-none">(341) 203-4429</p>
            </div>
          </a>

          <div className="lg:hidden flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-[#6B6862] hover:text-[#1E2026] hover:bg-black/5 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="text-[#1E2026] p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#ffffff] border-t border-black/8 px-4 pb-6 max-h-[80vh] overflow-y-auto">
          <a
            href="tel:+13412034429"
            className="flex items-center gap-2 mt-3 mb-1 px-3 py-2.5 rounded-lg bg-[#B57F50]/10 border border-[#B57F50]/20"
          >
            <Phone className="w-4 h-4 text-[#B57F50] shrink-0" />
            <div>
              <p className="text-[10px] text-[#6B6862]/70 leading-none mb-0.5">Catering Hotline</p>
              <p className="text-sm font-semibold text-[#1E2026] leading-none">(341) 203-4429</p>
            </div>
          </a>

          <nav className="flex flex-col gap-1 pt-2">
            {/* Ramen By City accordion */}
            <div>
              <button
                onClick={() => setMobileCityOpen(!mobileCityOpen)}
                className="w-full flex items-center justify-between py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors"
              >
                Ramen By City
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileCityOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCityOpen && (
                <div className="pb-2">
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9B9490]" />
                    <input
                      type="text"
                      placeholder="Search cities…"
                      value={mobileCityQuery}
                      onChange={(e) => setMobileCityQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm bg-[#F5F4F0] rounded-lg outline-none text-[#1E2026] placeholder-[#9B9490]"
                    />
                  </div>
                  <ul className="max-h-48 overflow-y-auto rounded-lg border border-black/5 divide-y divide-black/5">
                    {filteredMobileCities.map((c) => (
                      <li key={`${c.citySlug}-${c.stateSlug}`}>
                        <Link
                          href={`/${c.citySlug}/${c.stateSlug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 bg-[#F5F4F0] hover:bg-[#ebe9e4] transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
                          <span className="text-sm text-[#1E2026]">{c.city},</span>
                          <span className="text-xs text-[#9B9490]">{c.stateCode}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Ramen By State accordion */}
            <div>
              <button
                onClick={() => { setMobileStateOpen(!mobileStateOpen); setMobileStateQuery('') }}
                className="w-full flex items-center justify-between py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors"
              >
                Ramen By State
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileStateOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileStateOpen && (
                <div className="pb-2">
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9B9490]" />
                    <input
                      type="text"
                      placeholder="Search states…"
                      value={mobileStateQuery}
                      onChange={(e) => setMobileStateQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm bg-[#F5F4F0] rounded-lg outline-none text-[#1E2026] placeholder-[#9B9490]"
                    />
                  </div>
                  <ul className="max-h-48 overflow-y-auto rounded-lg border border-black/5 divide-y divide-black/5">
                    {filteredMobileStates.map((s) => (
                      <li key={s.stateSlug}>
                        <Link
                          href={`/${s.stateSlug}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 bg-[#F5F4F0] hover:bg-[#ebe9e4] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm text-[#1E2026]">{s.state}</span>
                            <span className="text-xs font-semibold text-[#B57F50]">{s.stateCode}</span>
                          </span>
                          <span className="text-xs text-[#9B9490]">{s.count} spots</span>
                        </Link>
                      </li>
                    ))}
                    {filteredMobileStates.length === 0 && (
                      <li className="px-4 py-3 text-sm text-[#9B9490] text-center">No states found</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            <Link href="/catering" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMobileOpen(false)}>
              Catering
            </Link>
            <Link href="/blog" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMobileOpen(false)}>
              Blog
            </Link>

            <Link
              href="/list"
              className="mt-2 px-4 py-2 rounded-md bg-[#B57F50] text-white text-sm font-medium text-center hover:bg-[#c8934f] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              List Your Restaurant
            </Link>

            {user ? (
              <div className="mt-2 flex flex-col gap-1">
                <Link href="/saved" className="py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors" onClick={() => setMobileOpen(false)}>
                  Saved Restaurants
                </Link>
                <div className="flex items-center justify-between py-2 border-t border-black/5">
                  <span className="text-sm text-[#6B6862]">{user.email}</span>
                  <button onClick={handleSignOut} className="text-sm text-[#B57F50] hover:text-[#B57F50]/80 transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="mt-1 py-2 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors text-center"
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
