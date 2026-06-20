'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Sparkles, Send, Loader2, Star, MapPin, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import type { MapPoint } from '@/lib/ramen-taxonomy'
import { isOpenNow } from '@/lib/hours'
import SigninGateModal from '@/components/signin-gate-modal'
import SubscribeGateModal from '@/components/subscribe-gate-modal'
import RestaurantImage from '@/components/restaurant-image'

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const EXAMPLE_PROMPTS = [
  'Spicy tonkotsu, open now, under $20',
  'Best bowl near me for a date night',
  'Vegan ramen with high ratings',
  'Cheap ramen open past midnight',
  'Rich creamy broth, closest to me',
]

// Parses the structured AI response into reasoning, result slugs+reasons, and tip.
interface ParsedResult {
  reasoning: string
  results: Array<{ slug: string; reason: string }>
  tip: string
}

function parseAIResponse(text: string): ParsedResult | null {
  try {
    // Split on section headers to avoid needing the `s` (dotall) flag
    const sections = text.split(/\n\n(?=REASONING:|RESULTS:|TIP:)/)
    let reasoning = ''
    let resultBlock = ''
    let tip = ''

    for (const section of sections) {
      if (section.startsWith('REASONING:')) {
        reasoning = section.replace(/^REASONING:\s*/, '').trim()
      } else if (section.startsWith('RESULTS:')) {
        resultBlock = section.replace(/^RESULTS:\s*/, '')
      } else if (section.startsWith('TIP:')) {
        tip = section.replace(/^TIP:\s*/, '').trim()
      }
    }

    // Also handle single-line REASONING at start of text
    if (!reasoning) {
      const m = text.match(/^REASONING:\s*(.+)/)
      if (m) reasoning = m[1].trim()
    }

    const results: Array<{ slug: string; reason: string }> = []
    const lines = resultBlock.split('\n').filter(l => l.trim())
    for (const line of lines) {
      const m = line.match(/^\d+\.\s+(\S+)\s+[—–-]\s+(.+)$/)
      if (m) results.push({ slug: m[1].trim(), reason: m[2].trim() })
    }

    if (!results.length) return null
    return { reasoning, results, tip }
  } catch {
    return null
  }
}

interface Props {
  onClose: () => void
  allRestaurants: MapPoint[]
  userLat?: number | null
  userLng?: number | null
  onSelectSlug?: (slug: string) => void
}

export default function AiRamenSearchPanel({ onClose, allRestaurants, userLat, userLng, onSelectSlug }: Props) {
  const [query, setQuery] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [rawText, setRawText] = useState('')
  const [parsed, setParsed] = useState<ParsedResult | null>(null)
  const [error, setError] = useState('')
  const [gate, setGate] = useState<null | 'signin' | 'subscribe'>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const submit = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (!trimmed || streaming) return

    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setStreaming(true)
    setRawText('')
    setParsed(null)
    setError('')

    try {
      const res = await fetch('/api/ai-ramen-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          userLat: userLat ?? undefined,
          userLng: userLng ?? undefined,
        }),
        signal: ctrl.signal,
      })

      if (res.status === 401) { setGate('signin'); setStreaming(false); return }
      if (res.status === 403) { setGate('subscribe'); setStreaming(false); return }
      if (!res.ok) { setError('Search failed — please try again.'); setStreaming(false); return }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setRawText(accumulated)
      }

      const p = parseAIResponse(accumulated)
      if (p) setParsed(p)
      else setError('Unexpected response — please try again.')
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Connection error — please try again.')
      }
    } finally {
      setStreaming(false)
    }
  }, [streaming, userLat, userLng])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    submit(query)
  }

  function handleExample(prompt: string) {
    setQuery(prompt)
    submit(prompt)
  }

  function reset() {
    abortRef.current?.abort()
    setRawText('')
    setParsed(null)
    setError('')
    setQuery('')
    setStreaming(false)
    inputRef.current?.focus()
  }

  // Resolve slugs to full MapPoint records
  const resolvedResults = parsed?.results.map(({ slug, reason }) => {
    const r = allRestaurants.find(x => x.slug === slug)
    return r ? { r, reason } : null
  }).filter((x): x is { r: MapPoint & { distKm?: number }; reason: string } => x !== null)
    .map(({ r, reason }) => ({
      r: {
        ...r,
        distKm: userLat && userLng && r.latitude && r.longitude
          ? haversineKm(userLat, userLng, r.latitude, r.longitude)
          : undefined,
      },
      reason,
    }))

  return (
    <>
      <div className="absolute inset-0 z-[1100] flex items-stretch">
        {/* Backdrop — click to close */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

        {/* Panel */}
        <div className="relative z-10 ml-auto w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-black/8 bg-gradient-to-r from-[#1E2026] to-[#2a2e38] shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#B57F50]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#d6a25e]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Ramen Near Me AI</p>
              <p className="text-[#9B9490] text-[11px]">Describe what you&apos;re craving</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="text-[#9B9490] hover:text-white transition-colors shrink-0">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {/* Input area */}
            <div className="p-4 border-b border-black/8 bg-[#FAFAF9]">
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(query) }
                    }}
                    placeholder="e.g. Spicy tonkotsu under $15, open now, within 5 miles…"
                    rows={2}
                    disabled={streaming}
                    className="w-full px-3.5 py-2.5 pr-11 text-sm bg-white border border-black/12 rounded-xl outline-none text-[#1E2026] placeholder-[#9B9490] focus:border-[#B57F50] transition-colors resize-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={streaming || !query.trim()}
                    className="absolute right-2.5 bottom-2.5 w-7 h-7 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {streaming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {!rawText && !streaming && (
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLE_PROMPTS.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleExample(p)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white border border-black/10 text-[#6B6862] hover:border-[#B57F50]/50 hover:text-[#B57F50] transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>

            {/* Streaming in-progress raw text */}
            {streaming && !parsed && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Loader2 className="w-3.5 h-3.5 text-[#B57F50] animate-spin shrink-0" />
                  <p className="text-xs text-[#6B6862]">Finding your best bowl…</p>
                </div>
                {rawText && (
                  <p className="text-[11px] text-[#9B9490] font-mono whitespace-pre-wrap leading-relaxed">{rawText}</p>
                )}
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="p-4">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button onClick={reset} className="mt-3 flex items-center gap-1.5 text-xs text-[#B57F50] font-medium hover:underline">
                  <RotateCcw className="w-3 h-3" /> Try again
                </button>
              </div>
            )}

            {/* Parsed results */}
            {parsed && resolvedResults && (
              <div className="p-4 space-y-4">
                {/* Reasoning */}
                {parsed.reasoning && (
                  <div className="flex gap-2.5 p-3 rounded-xl bg-[#B57F50]/8 border border-[#B57F50]/15">
                    <Sparkles className="w-3.5 h-3.5 text-[#B57F50] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#6B6862] leading-relaxed">{parsed.reasoning}</p>
                  </div>
                )}

                {/* Restaurant cards */}
                <div className="space-y-2">
                  {resolvedResults.map(({ r, reason }, i) => {
                    const openNow = isOpenNow(r.hours)
                    return (
                      <div key={r.slug} className="group relative">
                        <Link
                          href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
                          onClick={() => onSelectSlug?.(r.slug)}
                          className="flex gap-3 p-3 rounded-xl border border-black/8 bg-white hover:border-[#B57F50]/40 hover:bg-[#B57F50]/4 transition-all"
                        >
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#B57F50] text-white text-[11px] font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </div>
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#F5F4F0] shrink-0">
                            <RestaurantImage src={r.photo} alt={r.name} fill className="object-cover" sizes="56px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[#1E2026] truncate group-hover:text-[#c8934f] transition-colors">{r.name}</p>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className="flex items-center gap-0.5 text-[#9B9490] text-[11px]">
                                <MapPin className="w-2.5 h-2.5" />{r.city}, {r.stateCode}
                              </span>
                              {r.rating && (
                                <span className="flex items-center gap-0.5 text-[11px] text-[#6B6862]">
                                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                  {r.rating.toFixed(1)}
                                </span>
                              )}
                              {r.priceRange && <span className="text-[11px] text-[#9B9490]">{r.priceRange}</span>}
                              {openNow && <span className="text-[11px] text-emerald-600 font-medium">Open</span>}
                              {r.distKm !== undefined && (
                                <span className="text-[11px] text-[#B57F50] font-medium">{(r.distKm * 0.621371).toFixed(1)} mi</span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#6B6862] mt-1 leading-snug">{reason}</p>
                          </div>
                        </Link>
                      </div>
                    )
                  })}
                </div>

                {/* Tip */}
                {parsed.tip && (
                  <div className="p-3 rounded-xl bg-[#F5F4F0] border border-black/6">
                    <p className="text-xs text-[#6B6862] leading-relaxed">
                      <span className="font-semibold text-[#1E2026]">Tip: </span>{parsed.tip}
                    </p>
                  </div>
                )}

                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 text-xs text-[#B57F50] font-medium hover:underline"
                >
                  <RotateCcw className="w-3 h-3" /> Search again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {gate === 'signin' && (
        <SigninGateModal onClose={() => setGate(null)} redirectTo="/" />
      )}
      {gate === 'subscribe' && (
        <SubscribeGateModal onClose={() => setGate(null)} />
      )}
    </>
  )
}
