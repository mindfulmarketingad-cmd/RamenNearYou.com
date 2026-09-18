'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ChevronRight, Ticket } from 'lucide-react'
import { experienceImage, type Experience } from '@/lib/experiences'

interface Props {
  experiences: Experience[]
  destinations: string[]
  categories: string[]
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= full
              ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && half
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-ink/20'
          }`}
        />
      ))}
    </span>
  )
}

export default function ExperiencesList({ experiences, destinations, categories }: Props) {
  const [query, setQuery] = useState('')
  const [destination, setDestination] = useState('all')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return experiences.filter((e) => {
      if (destination !== 'all' && e.destination !== destination) return false
      if (category !== 'all' && e.category !== category) return false
      if (!q) return true
      return `${e.name} ${e.city} ${e.country} ${e.category} ${e.tagline}`.toLowerCase().includes(q)
    })
  }, [experiences, query, destination, category])

  function reset() {
    setQuery('')
    setDestination('all')
    setCategory('all')
  }

  return (
    <>
      {/* Filters */}
      <div className="bg-raised border border-line/8 rounded-xl p-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search experiences..."
          aria-label="Search experiences"
          className="w-full px-3 py-2 mb-2.5 rounded-lg border border-line/10 bg-surface text-sm text-ink placeholder-ink-faint outline-none focus:border-brand"
        />
        <div className="flex flex-wrap items-center gap-2">
          {destinations.length > 0 && (
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              aria-label="Destination"
              className="px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs text-ink outline-none focus:border-brand"
            >
              <option value="all">Destination: All</option>
              {destinations.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Experience type"
              className="px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs text-ink outline-none focus:border-brand"
            >
              <option value="all">Type: All</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 rounded-lg border border-line/10 bg-surface text-xs font-semibold text-ink hover:border-line/25 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <p className="text-xs text-ink-soft mb-4">
        {filtered.length} {filtered.length === 1 ? 'experience' : 'experiences'}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-ink-soft">
          No experiences match your filters yet. Try a different search.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e, i) => (
            <article key={e.slug} className="bg-surface border border-line/8 rounded-xl p-4 flex gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-white text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-sunken">
                <Image src={experienceImage(e)} alt={e.name} fill className="object-cover" sizes="80px" unoptimized />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm text-ink leading-tight">
                  <Link href={`/experiences/${e.slug}`} className="hover:text-brand-ink transition-colors">
                    {e.name}
                  </Link>
                </h2>

                <div className="flex items-center gap-2 flex-wrap mt-1">
                  <StarRating rating={e.rating} />
                  <span className="text-xs font-semibold text-ink">{e.rating.toFixed(1)}</span>
                  <span className="text-xs text-ink-soft">{e.reviewCount.toLocaleString()} reviews</span>
                  <span className="flex items-center gap-1 text-xs text-ink-soft">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {e.destination}
                  </span>
                </div>

                <p className="text-xs text-ink mt-1.5 leading-relaxed">{e.tagline}</p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-full bg-sunken border border-line/8 text-[10px] font-medium text-ink-soft">
                    {e.category}
                  </span>
                  <span className="text-xs font-bold text-ink">From {e.priceFrom}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <a
                    href={e.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand hover:bg-brand-hi text-white text-xs font-bold transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5" /> Check Availability
                  </a>
                  <Link
                    href={`/experiences/${e.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-ink hover:underline"
                  >
                    Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
