'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Navigation, X } from 'lucide-react'

const EXAMPLES = [
  'Closest ramen bar near me',
  'Best ramen in Phoenix',
  'Tonkotsu',
  'Pho in Atlanta',
  'Is ramen healthy?',
  'Vegan ramen near me',
  'Ramen open late',
  'How to make ramen at home',
]

export default function SearchBox({
  initialQuery = '',
  size = 'hero',
  autoFocus = false,
}: {
  initialQuery?: string
  size?: 'hero' | 'compact'
  autoFocus?: boolean
}) {
  const router = useRouter()
  const [q, setQ] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setQ(initialQuery) }, [initialQuery])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const v = q.trim()
    if (v) router.push(`/search?q=${encodeURIComponent(v)}`)
  }

  const hero = size === 'hero'

  return (
    <div className="w-full">
      <form onSubmit={submit} role="search" className="w-full">
        <label htmlFor="site-search" className="sr-only">Search ramen restaurants, guides, and reviews</label>
        <div
          className={`relative flex items-center w-full bg-white border border-black/12 rounded-full shadow-sm
            focus-within:border-[#B57F50] focus-within:shadow-md transition-all ${hero ? 'h-14' : 'h-11'}`}
        >
          <Search className={`absolute left-4 text-[#9B9490] pointer-events-none ${hero ? 'w-5 h-5' : 'w-4 h-4'}`} />
          <input
            id="site-search"
            ref={inputRef}
            type="search"
            value={q}
            onChange={e => setQ(e.target.value)}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
            autoComplete="off"
            placeholder={hero ? 'Search ramen — try “best ramen in Phoenix”' : 'Search ramen…'}
            className={`w-full bg-transparent outline-none text-[#1E2026] placeholder-[#9B9490]
              ${hero ? 'pl-12 pr-28 text-base' : 'pl-10 pr-24 text-sm'}`}
          />
          {q && (
            <button
              type="button"
              onClick={() => { setQ(''); inputRef.current?.focus() }}
              aria-label="Clear search"
              className={`absolute text-[#9B9490] hover:text-[#1E2026] transition-colors ${hero ? 'right-24' : 'right-20'}`}
            >
              <X className={hero ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
            </button>
          )}
          <button
            type="submit"
            className={`absolute right-1.5 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white font-semibold
              transition-colors ${hero ? 'px-5 py-2.5 text-sm' : 'px-4 py-1.5 text-xs'}`}
          >
            Search
          </button>
        </div>
      </form>

      {hero && (
        <>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => router.push(`/search?q=${encodeURIComponent(ex)}`)}
                className="px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#3F3D39] text-xs
                  hover:border-[#B57F50]/50 hover:text-[#96602F] transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
          <p className="flex items-center justify-center gap-1.5 text-[#6B6862] text-xs mt-5">
            <Navigation className="w-3.5 h-3.5 text-[#96602F]" />
            Ask for something &ldquo;near me&rdquo; and we&apos;ll sort by distance from your location.
          </p>
        </>
      )}
    </div>
  )
}
