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
          className={`relative flex items-center w-full bg-surface border border-line/12 rounded-full shadow-sm
            focus-within:border-brand focus-within:shadow-md transition-all ${hero ? 'h-14' : 'h-11'}`}
        >
          <Search className={`absolute left-4 text-ink-faint pointer-events-none ${hero ? 'w-5 h-5' : 'w-4 h-4'}`} />
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
            className={`w-full bg-transparent outline-none text-ink placeholder-ink-faint
              ${hero ? 'pl-12 pr-28 text-base' : 'pl-10 pr-24 text-sm'}`}
          />
          {q && (
            <button
              type="button"
              onClick={() => { setQ(''); inputRef.current?.focus() }}
              aria-label="Clear search"
              className={`absolute text-ink-faint hover:text-ink transition-colors ${hero ? 'right-24' : 'right-20'}`}
            >
              <X className={hero ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
            </button>
          )}
          <button
            type="submit"
            className={`absolute right-1.5 rounded-full bg-brand hover:bg-brand-hi text-white font-semibold
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
                className="px-3 py-1.5 rounded-full bg-surface border border-line/8 text-ink-mid text-xs
                  hover:border-brand/50 hover:text-brand-ink transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
          <p className="flex items-center justify-center gap-1.5 text-ink-soft text-xs mt-5">
            <Navigation className="w-3.5 h-3.5 text-brand-ink" />
            Ask for something &ldquo;near me&rdquo; and we&apos;ll sort by distance from your location.
          </p>
        </>
      )}
    </div>
  )
}
