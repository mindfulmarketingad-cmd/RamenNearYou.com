'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { safePhotoSrc } from '@/lib/photo-guard'
import {
  X, ChevronLeft, Star, MapPin, Loader2, Navigation,
  Search, RotateCcw, Utensils, ExternalLink,
} from 'lucide-react'

// ── Quiz model ───────────────────────────────────────────────────────────────

interface Choice {
  value: string
  label: string
  sublabel?: string
}

interface ChoiceQuestion {
  id: 'broth' | 'experience' | 'dining' | 'radius'
  kind: 'choice'
  question: string
  choices: Choice[]
}

interface ZipQuestion {
  id: 'zip'
  kind: 'zip'
  question: string
}

type Question = ChoiceQuestion | ZipQuestion

const QUESTIONS: Question[] = [
  {
    id: 'broth',
    kind: 'choice',
    question: 'What type of ramen?',
    choices: [
      { value: 'tonkotsu', label: 'Tonkotsu', sublabel: 'Rich pork bone broth' },
      { value: 'spicy', label: 'Spicy', sublabel: 'Chili-forward heat' },
      { value: 'miso', label: 'Miso', sublabel: 'Savory fermented soy' },
      { value: 'shoyu', label: 'Shoyu', sublabel: 'Classic soy-based' },
      { value: 'vegan', label: 'Vegan', sublabel: 'Fully plant-based' },
      { value: 'vegetarian', label: 'Vegetarian', sublabel: 'Meat-free' },
      { value: '', label: 'Surprise me', sublabel: 'Any great bowl' },
    ],
  },
  {
    id: 'experience',
    kind: 'choice',
    question: 'How familiar are you with ramen?',
    choices: [
      { value: 'regular', label: 'I eat it regularly' },
      { value: 'some', label: 'A few times' },
      { value: 'new', label: 'First time' },
    ],
  },
  {
    id: 'dining',
    kind: 'choice',
    question: 'How do you want it?',
    choices: [
      { value: 'dinein', label: 'Dine in' },
      { value: 'takeout', label: 'Takeout' },
      { value: 'delivery', label: 'Delivery' },
      { value: '', label: 'No preference' },
    ],
  },
  {
    id: 'radius',
    kind: 'choice',
    question: 'How far will you go?',
    choices: [
      { value: '5', label: 'Under 5 miles' },
      { value: '15', label: 'Up to 15 miles' },
      { value: '50', label: 'Anywhere' },
    ],
  },
  {
    id: 'zip',
    kind: 'zip',
    question: 'What is your ZIP code?',
  },
]

interface QuizResult {
  slug: string
  citySlug: string
  stateSlug: string
  name: string
  city: string
  stateCode: string
  rating: number | null
  reviewCount: number
  photo: string
  subtypes: string
  priceRange: string
  distanceMiles: number
  orderLinks: string
  menuLink: string
  website: string
}

type Answers = Partial<Record<Question['id'], string>>

// ── Component ────────────────────────────────────────────────────────────────

export default function RamenQuiz({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [zip, setZip] = useState('')
  const [phase, setPhase] = useState<'quiz' | 'loading' | 'results' | 'error'>('quiz')
  const [results, setResults] = useState<QuizResult[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [visible, setVisible] = useState(true)

  const total = QUESTIONS.length
  const current = QUESTIONS[step]

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const runSearch = useCallback(async (finalAnswers: Answers, lat: number, lng: number) => {
    setPhase('loading')
    try {
      const params = new URLSearchParams({
        lat: String(lat),
        lng: String(lng),
        limit: '12',
        radius: finalAnswers.radius ?? '50',
      })
      if (finalAnswers.broth) params.set('broth', finalAnswers.broth)
      if (finalAnswers.dining) params.set('dining', finalAnswers.dining)

      const res = await fetch(`/api/nearby?${params.toString()}`)
      const data = await res.json()
      let list: QuizResult[] = data.results ?? []
      if (list.length === 0) {
        const relaxed = new URLSearchParams({ lat: String(lat), lng: String(lng), limit: '12', radius: '50' })
        const res2 = await fetch(`/api/nearby?${relaxed.toString()}`)
        const data2 = await res2.json()
        list = data2.results ?? []
      }
      setResults(list)
      setPhase('results')
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setPhase('error')
    }
  }, [])

  async function geocodeAndSearch(finalAnswers: Answers) {
    const clean = (finalAnswers.zip ?? '').trim()
    if (!/^\d{5}$/.test(clean)) {
      setErrorMsg('Please enter a valid 5-digit ZIP code.')
      return
    }
    setErrorMsg('')
    setPhase('loading')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(clean)}&countrycodes=us&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (!data.length) {
        setErrorMsg('ZIP code not found. Check the number and try again.')
        setPhase('quiz')
        return
      }
      await runSearch(finalAnswers, parseFloat(data[0].lat), parseFloat(data[0].lon))
    } catch {
      setErrorMsg('Location lookup failed. Check your connection and try again.')
      setPhase('quiz')
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setErrorMsg('Location not available — enter your ZIP code.')
      return
    }
    setErrorMsg('')
    setPhase('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => runSearch(answers, pos.coords.latitude, pos.coords.longitude),
      () => { setErrorMsg('Could not get your location — enter your ZIP code.'); setPhase('quiz') },
      { timeout: 8000 }
    )
  }

  function advance(nextStep: number) {
    setVisible(false)
    setTimeout(() => {
      setStep(nextStep)
      setVisible(true)
    }, 180)
  }

  function selectChoice(value: string) {
    const next = { ...answers, [current.id]: value }
    setAnswers(next)
    if (step < total - 1) {
      advance(step + 1)
    }
  }

  function submitZip() {
    const next = { ...answers, zip }
    setAnswers(next)
    geocodeAndSearch(next)
  }

  function back() {
    setErrorMsg('')
    if (phase === 'results' || phase === 'error') { setPhase('quiz'); return }
    if (step > 0) advance(step - 1)
    else onClose()
  }

  function restart() {
    setStep(0); setAnswers({}); setZip(''); setResults([]); setErrorMsg(''); setPhase('quiz')
    setVisible(true)
  }

  const progress = phase === 'results' ? 100 : ((step + (phase === 'loading' ? 1 : 0)) / total) * 100

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#F5F4F0]">
      {/* Top bar */}
      <div className="shrink-0 border-b border-black/8 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={back}
            className="inline-flex items-center gap-1 text-sm text-[#6B6862] hover:text-[#1E2026] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <span className="font-serif font-bold text-[#1E2026] text-sm">Find Ramen</span>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-[#6B6862] hover:bg-black/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-0.5 bg-black/5">
          <div className="h-full bg-[#B57F50] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

          {/* ── Quiz questions ── */}
          {phase === 'quiz' && (
            <div
              className="transition-all duration-200 ease-out"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
            >
              <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-3">
                {step + 1} / {total}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-7">
                {current.question}
              </h2>

              {current.kind === 'choice' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {current.choices.map((c) => {
                    const selected = answers[current.id] === c.value
                    return (
                      <button
                        key={c.label}
                        onClick={() => selectChoice(c.value)}
                        className={`flex items-start text-left px-5 py-4 rounded-none border bg-white transition-all duration-150 hover:shadow-sm ${
                          selected
                            ? 'border-[#B57F50] ring-2 ring-[#B57F50]/20 shadow-sm'
                            : 'border-black/8 hover:border-[#B57F50]/40'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block font-semibold text-[#1E2026] text-sm">{c.label}</span>
                          {c.sublabel && <span className="block text-[#6B6862] text-xs mt-0.5">{c.sublabel}</span>}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {current.kind === 'zip' && (
                <div className="max-w-sm">
                  <form onSubmit={(e) => { e.preventDefault(); submitZip() }}>
                    <div className="flex items-center bg-white rounded-xl border border-black/10 overflow-hidden focus-within:border-[#B57F50] focus-within:ring-2 focus-within:ring-[#B57F50]/20 transition-all">
                      <MapPin className="w-4 h-4 text-[#96602F] shrink-0 ml-4" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        autoFocus
                        placeholder="Enter ZIP code"
                        value={zip}
                        onChange={(e) => { setZip(e.target.value.replace(/\D/g, '')); setErrorMsg('') }}
                        className="flex-1 px-3 py-3.5 text-[#1E2026] text-sm font-medium outline-none bg-transparent placeholder:text-[#6B6862]"
                      />
                      <button
                        type="submit"
                        disabled={zip.length !== 5}
                        className="flex items-center gap-1.5 px-5 py-3.5 bg-[#B57F50] hover:bg-[#c8934f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shrink-0"
                      >
                        <Search className="w-3.5 h-3.5" />
                        Search
                      </button>
                    </div>
                  </form>
                  <button
                    onClick={useMyLocation}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#96602F] hover:text-[#c8934f] font-medium transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Use my current location
                  </button>
                </div>
              )}

              {errorMsg && <p className="text-red-500 text-sm mt-4">{errorMsg}</p>}
            </div>
          )}

          {/* ── Loading ── */}
          {phase === 'loading' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Loader2 className="w-9 h-9 text-[#96602F] animate-spin mb-4" />
              <p className="font-serif text-xl font-bold text-[#1E2026] mb-1">Finding your ramen</p>
              <p className="text-[#6B6862] text-sm">Searching nearby spots...</p>
            </div>
          )}

          {/* ── Error ── */}
          {phase === 'error' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-serif text-xl font-bold text-[#1E2026] mb-4">{errorMsg}</p>
              <button
                onClick={restart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start over
              </button>
            </div>
          )}

          {/* ── Results ── */}
          {phase === 'results' && (
            <div>
              <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-2">Your matches</p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-6">
                {results.length > 0
                  ? `${results.length} spot${results.length === 1 ? '' : 's'} near ${answers.zip || 'you'}`
                  : 'No exact matches found'}
              </h2>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results.map((r) => (
                    <ResultCard key={r.slug} r={r} onNavigate={onClose} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6B6862] mb-4">Try widening your distance or choosing a different broth type.</p>
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Start over
                  </button>
                </div>
              )}

              {results.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 border-t border-black/8">
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-1.5 text-sm text-[#6B6862] hover:text-[#1E2026] font-medium transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Retake the quiz
                  </button>
                  <Link
                    href={`/searchmap${answers.zip ? `?zip=${answers.zip}` : ''}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-sm text-[#6B6862] hover:text-[#1E2026] font-medium transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    See all on the map
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Result card ──────────────────────────────────────────────────────────────

function getOrderUrl(r: QuizResult): string | null {
  if (r.orderLinks) return r.orderLinks.split(',')[0].trim()
  if (r.menuLink) return r.menuLink
  if (r.website) return r.website
  return null
}

function ResultCard({ r, onNavigate }: { r: QuizResult; onNavigate: () => void }) {
  const orderUrl = getOrderUrl(r)
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-black/8 overflow-hidden">
      {/* Photo */}
      <div className="relative h-40 bg-[#F5F4F0] shrink-0">
        {safePhotoSrc(r.photo) ? (
          <Image
            src={safePhotoSrc(r.photo)!}
            alt={r.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="w-8 h-8 text-[#96602F]/30" />
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#1E2026] shadow-sm">
          {r.distanceMiles < 1 ? 'Under 1 mi' : `${r.distanceMiles.toFixed(1)} mi`}
        </div>
        {r.priceRange && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#6B6862] shadow-sm">
            {r.priceRange}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-1">
        <p className="font-semibold text-[#1E2026] text-sm leading-snug line-clamp-1">{r.name}</p>
        <p className="text-[#6B6862] text-xs">{r.city}, {r.stateCode}</p>
        {r.rating != null && r.rating > 0 && (
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-[#1E2026] text-xs font-semibold">{r.rating.toFixed(1)}</span>
            <span className="text-[#6B6862] text-xs">({(r.reviewCount ?? 0).toLocaleString()})</span>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
          onClick={onNavigate}
          className="flex-1 text-center py-2 rounded-lg border border-black/10 text-[#1E2026] text-xs font-semibold hover:border-[#B57F50]/50 hover:text-[#96602F] transition-colors"
        >
          View details
        </Link>
        {orderUrl ? (
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            Order now
          </a>
        ) : (
          <Link
            href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
            onClick={onNavigate}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-semibold transition-colors"
          >
            Order now
          </Link>
        )}
      </div>
    </div>
  )
}
