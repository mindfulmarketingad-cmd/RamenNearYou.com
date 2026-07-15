'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, Star, Loader2, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { BOWL_META, MOOD_META, FEATURE_META, BOWL_BY_KEY, MOOD_BY_KEY, FEATURE_BY_KEY, type MapPoint } from '@/lib/ramen-taxonomy'
import { getOpenStatus, getTodayHoursLabel } from '@/lib/hours'
import AdUnitInFeed from '@/components/ad-unit-infeed'

const PAGE_SIZE = 25

function Chip({ active, label, emoji, onClick }: { active: boolean; label: string; emoji: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${
        active
          ? 'bg-[#B57F50] text-white border-[#B57F50]'
          : 'bg-white text-[#6B6862] border-black/10 hover:border-[#B57F50]/40'
      }`}
    >
      <span className="leading-none">{emoji}</span>{label}
    </button>
  )
}

function ListingChips({ r }: { r: MapPoint }) {
  const seen = new Set<string>()
  const chips: { label: string; emoji: string; hex: string }[] = []
  const push = (m?: { label: string; emoji: string; hex: string }) => {
    if (m && !seen.has(m.label)) { seen.add(m.label); chips.push(m) }
  }
  for (const b of r.bowls ?? []) push(BOWL_BY_KEY[b])
  for (const a of r.amenities ?? []) push(FEATURE_BY_KEY[a])
  for (const m of r.moods ?? []) push(MOOD_BY_KEY[m])
  const shown = chips.slice(0, 3)
  if (shown.length === 0) return <span className="text-[#6B6862]/40 text-xs">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((c) => (
        <span
          key={c.label}
          style={{ backgroundColor: `${c.hex}1a`, color: c.hex, borderColor: `${c.hex}40` }}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap"
        >
          <span className="leading-none">{c.emoji}</span>{c.label}
        </span>
      ))}
      {chips.length > shown.length && (
        <span className="text-[#6B6862]/50 text-[10px]">+{chips.length - shown.length}</span>
      )}
    </div>
  )
}

function HoursCell({ hours }: { hours: Record<string, string[]> | null }) {
  const status = getOpenStatus(hours)
  if (!status) return <span className="text-[#6B6862]/40 text-xs">Hours unavailable</span>
  const label = hours ? getTodayHoursLabel(hours) : ''
  return (
    <div className="flex flex-col gap-0.5">
      {status.status === 'closed' ? (
        <span className="text-red-600 text-xs font-semibold">Closed</span>
      ) : status.status === 'closing-soon' ? (
        <span className="text-amber-600 text-xs font-semibold">Closes soon · {status.closesAt}</span>
      ) : (
        <span className="text-emerald-600 text-xs font-semibold">Open · closes {status.closesAt}</span>
      )}
      <span className="text-[#6B6862]/60 text-[11px]">{label}</span>
    </div>
  )
}

export default function PartnersDirectory() {
  const [data, setData] = useState<MapPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [query, setQuery] = useState('')
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const [stateFilter, setStateFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    fetch('/api/ramen-map', { cache: 'force-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((d: MapPoint[]) => { if (!cancelled) { setData(d); setLoading(false) } })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  function toggleKey(key: string) {
    setPage(1)
    setActiveKeys((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const stateOptions = useMemo(() => {
    const codes = new Set(data.map((r) => r.stateCode).filter(Boolean))
    return [...codes].sort()
  }, [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((r) => {
      if (q) {
        const haystack = `${r.name} ${r.city} ${r.stateCode}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (stateFilter && r.stateCode !== stateFilter) return false
      if (activeKeys.size > 0) {
        const tags = [...(r.bowls ?? []), ...(r.moods ?? []), ...(r.amenities ?? [])]
        if (!tags.some((t) => activeKeys.has(t))) return false
      }
      return true
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [data, query, stateFilter, activeKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div>
      {/* Search + filters toggle */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6862]" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            placeholder="Search by restaurant name, city, or state…"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-black/12 rounded-xl outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => { setStateFilter(e.target.value); setPage(1) }}
          className="px-3 py-2.5 text-sm bg-white border border-black/12 rounded-xl outline-none text-[#1E2026] focus:border-[#B57F50] transition-colors"
        >
          <option value="">All States</option>
          {stateOptions.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
            activeKeys.size > 0
              ? 'bg-[#B57F50] text-white border-[#B57F50]'
              : 'bg-white text-[#1E2026] border-black/12 hover:border-[#B57F50]/40'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters{activeKeys.size > 0 ? ` (${activeKeys.size})` : ''}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border border-black/8 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wide text-[#6B6862]">Broth</p>
            {activeKeys.size > 0 && (
              <button
                onClick={() => { setActiveKeys(new Set()); setPage(1) }}
                className="flex items-center gap-1 text-xs text-[#96602F] font-medium hover:underline"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {BOWL_META.map((b) => (
              <Chip key={b.key} active={activeKeys.has(b.key)} label={b.label} emoji={b.emoji} onClick={() => toggleKey(b.key)} />
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#6B6862] pt-1">Mood</p>
          <div className="flex flex-wrap gap-1.5">
            {MOOD_META.map((m) => (
              <Chip key={m.key} active={activeKeys.has(m.key)} label={m.label} emoji={m.emoji} onClick={() => toggleKey(m.key)} />
            ))}
          </div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#6B6862] pt-1">Features &amp; Amenities</p>
          <div className="flex flex-wrap gap-1.5">
            {FEATURE_META.map((f) => (
              <Chip key={f.key} active={activeKeys.has(f.key)} label={f.label} emoji={f.emoji} onClick={() => toggleKey(f.key)} />
            ))}
          </div>
        </div>
      )}

      <p className="text-[#6B6862] text-xs mb-3">
        {loading ? 'Loading businesses…' : `${filtered.length.toLocaleString()} business${filtered.length === 1 ? '' : 'es'}`}
      </p>

      {/* Table */}
      <div className="bg-white border border-black/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="w-7 h-7 text-[#96602F] animate-spin" />
            <p className="text-[#6B6862] text-sm">Loading businesses…</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-[#1E2026] font-semibold text-sm mb-1">Couldn&apos;t load businesses</p>
            <button onClick={() => location.reload()} className="text-xs text-[#96602F] font-medium">Retry →</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#1E2026] font-semibold text-sm mb-1">No businesses found</p>
            <p className="text-[#6B6862] text-xs">Try a different search or clear your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/8 bg-[#FAFAF9]">
                  <th className="text-left font-semibold text-[#1E2026] px-4 py-3 whitespace-nowrap">Business Name</th>
                  <th className="text-left font-semibold text-[#1E2026] px-4 py-3 whitespace-nowrap">Reviews</th>
                  <th className="text-left font-semibold text-[#1E2026] px-4 py-3 whitespace-nowrap">Filters</th>
                  <th className="text-left font-semibold text-[#1E2026] px-4 py-3 whitespace-nowrap">Hours</th>
                  <th className="text-left font-semibold text-[#1E2026] px-4 py-3 whitespace-nowrap">Claim Listing</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((r, i) => {
                  return (
                    <Fragment key={`${r.citySlug}-${r.stateSlug}-${r.slug}-${i}`}>
                      <tr className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                        <td className="px-4 py-3 align-top">
                          <Link
                            href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                            className="font-semibold text-[#1E2026] hover:text-[#96602F] transition-colors"
                          >
                            {r.name}
                          </Link>
                          <p className="text-[#6B6862] text-xs mt-0.5">{r.city}, {r.stateCode}</p>
                        </td>
                        <td className="px-4 py-3 align-top whitespace-nowrap">
                          {r.rating ? (
                            <span className="flex items-center gap-1 text-[#1E2026]">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              {r.rating.toFixed(1)}
                              <span className="text-[#6B6862] text-xs">({r.reviewCount.toLocaleString()})</span>
                            </span>
                          ) : (
                            <span className="text-[#6B6862]/40 text-xs">No reviews</span>
                          )}
                        </td>
                        <td className="px-4 py-3 align-top max-w-[220px]">
                          <ListingChips r={r} />
                        </td>
                        <td className="px-4 py-3 align-top whitespace-nowrap">
                          <HoursCell hours={r.hours} />
                        </td>
                        <td className="px-4 py-3 align-top whitespace-nowrap">
                          <Link
                            href={`/claim/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                            className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                          >
                            Claim Listing
                          </Link>
                        </td>
                      </tr>
                      {currentPage === 1 && i === 0 && (
                        <tr className="border-b border-black/5">
                          <td colSpan={5} className="px-4 py-3">
                            <AdUnitInFeed />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && filtered.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-[#6B6862] text-xs">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/10 text-sm text-[#1E2026] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#B57F50]/40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-black/10 text-sm text-[#1E2026] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#B57F50]/40 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
