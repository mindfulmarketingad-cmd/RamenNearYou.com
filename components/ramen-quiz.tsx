'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  X, ChevronLeft, Star, MapPin, Loader2, Navigation,
  Search, RotateCcw, Utensils,
} from 'lucide-react'

// ── Quiz model ──────────────────────────────────────────────────────────────

interface Choice {
  value: string
  label: string
  sublabel?: string
  emoji?: string
}

interface ChoiceQuestion {
  id: 'broth' | 'experience' | 'dining' | 'radius'
  kind: 'choice'
  question: string
  helper?: string
  choices: Choice[]
}

interface ZipQuestion {
  id: 'zip'
  kind: 'zip'
  question: string
  helper?: string
}

type Question = ChoiceQuestion | ZipQuestion

const QUESTIONS: Question[] = [
  {
    id: 'broth',
    kind: 'choice',
    question: 'What type of ramen are you craving?',
    helper: 'Pick the bowl that’s calling your name.',
    choices: [
      { value: 'tonkotsu', label: 'Tonkotsu', sublabel: 'Rich, creamy pork broth', emoji: '\u{1F35C}' },
      { value: 'spicy', label: 'Spicy', sublabel: 'Bring the heat', emoji: '\u{1F336}️' },
      { value: 'miso', label: 'Miso', sublabel: 'Savory & hearty', emoji: '\u{1F372}' },
      { value: 'shoyu', label: 'Shoyu', sublabel: 'Classic soy-based', emoji: '\u{1F961}' },
      { value: 'vegan', label: 'Vegan', sublabel: 'Plant-based', emoji: '\u{1F331}' },
      { value: 'vegetarian', label: 'Vegetarian', sublabel: 'Meat-free', emoji: '\u{1F966}' },
      { value: '', label: 'Surprise me', sublabel: 'Anything great', emoji: '✨' },
    ],
  },
  {
    id: 'experience',
    kind: 'choice',
    question: 'Have you had ramen before?',
    helper: 'So we can set the right expectations.',
    choices: [
      { value: 'regular', label: 'I’m a regular', sublabel: 'Bowl me over', emoji: '\u{1F60E}' },
      { value: 'some', label: 'A few times', sublabel: 'Still exploring', emoji: '\u{1F44C}' },
      { value: 'new', label: 'First timer!', sublabel: 'Be gentle', emoji: '\u{1F423}' },
    ],
  },
  {
    id: 'dining',
    kind: 'choice',
    question: 'How do you want to enjoy it?',
    helper: 'We’ll match spots that offer it.',
    choices: [
      { value: 'dinein', label: 'Dine in', sublabel: 'Slurp it fresh', emoji: '\u{1F37D}️' },
      { value: 'takeout', label: 'Takeout', sublabel: 'Grab & go', emoji: '\u{1F96A}' },
      { value: 'delivery', label: 'Delivery', sublabel: 'Bring it to me', emoji: '\u{1F6F5}' },
      { value: '', label: 'No preference', sublabel: 'Any works', emoji: '\u{1F937}' },
    ],
  },
  {
    id: 'radius',
    kind: 'choice',
    question: 'How far will you travel?',
    helper: 'We’ll keep results in range.',
    choices: [
      { value: '5', label: 'Keep it close', sublabel: 'Within 5 miles', emoji: '\u{1F6B6}' },
      { value: '15', label: 'I’ll drive a bit', sublabel: 'Within 15 miles', emoji: '\u{1F697}' },
      { value: '50', label: 'Anywhere for great ramen', sublabel: 'Within 50 miles', emoji: '\u{1F30D}' },
    ],
  },
  {
    id: 'zip',
    kind: 'zip',
    question: 'What’s your ZIP code?',
    helper: 'So we can find the nearest bowls to you.',
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
  description: string
  subtypes: string
  priceRange: string
  distanceMiles: number
}

type Answers = Partial<Record<Question['id'], string>>

const EXPERIENCE_BLURB: Record<string, string> = {
  regular: 'Here are top-rated bowls worth the trip.',
  some: 'A curated set of crowd-favorite spots near you.',
  new: 'Great first bowls — approachable, beloved, and close by.',
}

// ── Component ───────────────────────────────────────────────────────────────

export default function RamenQuiz({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [zip, setZip] = useState('')
  const [phase, setPhase] = useState<'quiz' | 'loading' | 'results' | 'error'>('quiz')
  const [results, setResults] = useState<QuizResult[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const total = QUESTIONS.length
  const current = QUESTIONS[step]

  // Lock body scroll while the quiz is open
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
      const list: QuizResult[] = data.results ?? []
      if (list.length === 0) {
        // Relax: retry once with any broth and full radius
        const relaxed = new URLSearchParams({ lat: String(lat), lng: String(lng), limit: '12', radius: '50' })
        const res2 = await fetch(`/api/nearby?${relaxed.toString()}`)
        const data2 = await res2.json()
        setResults(data2.results ?? [])
      } else {
        setResults(list)
      }
      setPhase('results')
    } catch {
      setErrorMsg('Something went wrong finding ramen near you. Please try again.')
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
      const url = `https://nominatim.openstreetmap.org/search?format=json&postalcode=${encodeURIComponent(clean)}&countrycodes=us&limit=1`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      const data = await res.json()
      if (!data.length) {
        setErrorMsg('We couldn’t find that ZIP code. Check the number and try again.')
        setPhase('quiz')
        return
      }
      await runSearch(finalAnswers, parseFloat(data[0].lat), parseFloat(data[0].lon))
    } catch {
      setErrorMsg('Location lookup failed — check your connection and try again.')
      setPhase('quiz')
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setErrorMsg('Location isn’t available — enter your ZIP code instead.')
      return
    }
    setErrorMsg('')
    setPhase('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => runSearch(answers, pos.coords.latitude, pos.coords.longitude),
      () => { setErrorMsg('We couldn’t get your location — enter your ZIP code instead.'); setPhase('quiz') },
      { timeout: 8000 }
    )
  }

  function selectChoice(value: string) {
    const next = { ...answers, [current.id]: value }
    setAnswers(next)
    if (step < total - 1) {
      setStep(step + 1)
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
    if (step > 0) setStep(step - 1)
    else onClose()
  }

  function restart() {
    setStep(0); setAnswers({}); setZip(''); setResults([]); setErrorMsg(''); setPhase('quiz')
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
          <div className="flex items-center gap-2 font-serif font-bold text-[#1E2026]">
            <Utensils className="w-4 h-4 text-[#B57F50]" />
            Order Ramen
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-[#6B6862] hover:bg-black/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Progress */}
        <div className="h-1 bg-black/5">
          <div className="h-full bg-[#B57F50] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          {/* ── Quiz questions ── */}
          {phase === 'quiz' && (
            <div>
              <p className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-2">
                Question {step + 1} of {total}
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">
                {current.question}
              </h2>
              {current.helper && <p className="text-[#6B6862] mb-8">{current.helper}</p>}

              {current.kind === 'choice' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {current.choices.map((c) => {
                    const selected = answers[current.id] === c.value
                    return (
                      <button
                        key={c.label}
                        onClick={() => selectChoice(c.value)}
                        className={`flex items-center gap-4 text-left px-5 py-4 rounded-2xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-md ${
                          selected ? 'border-[#B57F50] ring-2 ring-[#B57F50]/30' : 'border-black/8 hover:border-[#B57F50]/50'
                        }`}
                      >
                        {c.emoji && <span className="text-2xl shrink-0">{c.emoji}</span>}
                        <span className="min-w-0">
                          <span className="block font-semibold text-[#1E2026]">{c.label}</span>
                          {c.sublabel && <span className="block text-[#6B6862] text-sm">{c.sublabel}</span>}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {current.kind === 'zip' && (
                <div className="max-w-sm">
                  <form onSubmit={(e) => { e.preventDefault(); submitZip() }}>
                    <div className="flex items-center bg-white rounded-xl border border-black/10 overflow-hidden focus-within:border-[#B57F50] focus-within:ring-2 focus-within:ring-[#B57F50]/30 transition-all">
                      <MapPin className="w-4 h-4 text-[#B57F50] shrink-0 ml-4" />
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        autoFocus
                        placeholder="Enter ZIP code…"
                        value={zip}
                        onChange={(e) => { setZip(e.target.value.replace(/\D/g, '')); setErrorMsg('') }}
                        className="flex-1 px-3 py-3.5 text-[#1E2026] text-sm font-medium outline-none bg-transparent placeholder:text-[#9B9490]"
                      />
                      <button
                        type="submit"
                        disabled={zip.length !== 5}
                        className="flex items-center gap-1.5 px-5 py-3.5 bg-[#B57F50] hover:bg-[#c8934f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shrink-0"
                      >
                        <Search className="w-3.5 h-3.5" />
                        Find ramen
                      </button>
                    </div>
                  </form>
                  <button
                    onClick={useMyLocation}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#B57F50] hover:text-[#c8934f] font-medium transition-colors"
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
              <Loader2 className="w-10 h-10 text-[#B57F50] animate-spin mb-4" />
              <p className="font-serif text-2xl font-bold text-[#1E2026] mb-1">Finding your ramen…</p>
              <p className="text-[#6B6862] text-sm">Matching the best bowls to your taste.</p>
            </div>
          )}

          {/* ── Error ── */}
          {phase === 'error' && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-serif text-2xl font-bold text-[#1E2026] mb-2">{errorMsg}</p>
              <button
                onClick={restart}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start over
              </button>
            </div>
          )}

          {/* ── Results ── */}
          {phase === 'results' && (
            <div>
              <p className="text-[#B57F50] text-xs font-semibold uppercase tracking-widest mb-2">Your matches</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">
                {results.length > 0
                  ? `${results.length} ramen ${results.length === 1 ? 'spot' : 'spots'} near ${answers.zip || 'you'}`
                  : 'No exact matches nearby'}
              </h2>
              <p className="text-[#6B6862] mb-8">
                {results.length > 0
                  ? EXPERIENCE_BLURB[answers.experience ?? ''] ?? 'Curated for your taste and location.'
                  : 'Try widening your distance or choosing “Surprise me” for more options.'}
              </p>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {results.map((r) => (
                    <ResultCard key={r.slug} r={r} onNavigate={onClose} />
                  ))}
                </div>
              ) : (
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start over
                </button>
              )}

              {results.length > 0 && (
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-1.5 text-sm text-[#B57F50] hover:text-[#c8934f] font-semibold transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Retake the quiz
                  </button>
                  <Link
                    href={`/searchmap${answers.zip ? `?zip=${answers.zip}` : ''}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-sm text-[#B57F50] hover:text-[#c8934f] font-semibold transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
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

// ── Result card ─────────────────────────────────────────────────────────────

function ResultCard({ r, onNavigate }: { r: QuizResult; onNavigate: () => void }) {
  const tags = r.subtypes ? r.subtypes.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 2) : []
  return (
    <Link
      href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
      onClick={onNavigate}
      className="group flex flex-col bg-white rounded-2xl border border-black/8 overflow-hidden hover:border-[#B57F50]/40 hover:shadow-lg transition-all duration-200"
    >
      <div className="relative h-40 bg-[#F5F4F0] overflow-hidden shrink-0">
        {r.photo ? (
          <Image
            src={r.photo}
            alt={r.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, 50vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Utensils className="w-8 h-8 text-[#B57F50]/30" />
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#1E2026] shadow-sm">
          {r.distanceMiles < 1 ? 'Under 1 mi' : `${r.distanceMiles.toFixed(1)} mi away`}
        </div>
        {r.priceRange && (
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-[#6B6862] shadow-sm">
            {r.priceRange}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-1 mb-1">
          {r.name}
        </p>
        <p className="text-[#9B9490] text-xs mb-2">{r.city}, {r.stateCode}</p>
        {r.rating != null && r.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[#1E2026] text-xs font-semibold">{r.rating.toFixed(1)}</span>
            <span className="text-[#9B9490] text-xs">({r.reviewCount.toLocaleString()})</span>
          </div>
        )}
        {tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-[#B57F50]/10 text-[#B57F50] text-[10px] font-medium border border-[#B57F50]/20">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
