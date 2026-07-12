'use client'

import { useState } from 'react'
import { X, ChevronRight, CheckCircle } from 'lucide-react'
import { useModalA11y } from '@/lib/use-modal-a11y'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

const EVENT_TYPES = [
  { label: 'Corporate Event',    sub: 'Meetings, conferences, team days' },
  { label: 'Wedding',            sub: 'Reception, rehearsal, brunch'      },
  { label: 'Birthday Party',     sub: 'Private celebration'                },
  { label: 'Office Lunch',       sub: 'Regular team meals'                 },
  { label: 'Festival / Pop-Up',  sub: 'Public or ticketed event'           },
  { label: 'Private Dinner',     sub: 'Intimate gathering'                 },
  { label: 'Other',              sub: 'Something else'                     },
]

const TIME_OPTIONS = [
  'Morning (8am–12pm)',
  'Afternoon (12pm–5pm)',
  'Evening (5pm–10pm)',
]

const GUEST_COUNTS = [
  { label: 'Under 25',  sub: 'Small group'  },
  { label: '25–50',     sub: 'Medium group' },
  { label: '51–100',    sub: 'Large group'  },
  { label: '101–250',   sub: 'Very large'   },
  { label: '250+',      sub: 'Mass event'   },
]

const BUDGETS = [
  { label: 'Not sure yet',       sub: 'Help me figure it out' },
  { label: 'Under $15 / person', sub: 'Budget-friendly'       },
  { label: '$15–$25 / person',   sub: 'Mid-range'             },
  { label: '$25–$50 / person',   sub: 'Premium'               },
  { label: '$50+ / person',      sub: 'High-end'              },
]

const DIETARY_OPTIONS = [
  'No restrictions', 'Vegetarian', 'Vegan',
  'Gluten-free', 'Halal', 'Kosher', 'Multiple / varied',
]

const TOTAL_STEPS = 7

const STEP_TITLES: Record<number, string> = {
  1: 'Event Location',
  2: 'Event Type',
  3: 'Event Date & Time',
  4: 'Guest Count',
  5: 'Budget',
  6: 'Dietary Needs',
  7: 'Contact Info',
}

type Data = {
  city: string
  state: string
  eventType: string
  eventDate: string
  eventTime: string
  guestCount: string
  budget: string
  dietaryNeeds: string[]
  name: string
  email: string
  phone: string
  notes: string
}

const EMPTY: Data = {
  city: '', state: '', eventType: '', eventDate: '', eventTime: '',
  guestCount: '', budget: '', dietaryNeeds: [],
  name: '', email: '', phone: '', notes: '',
}

export default function CateringQuiz({ onClose }: { onClose: () => void }) {
  const panelRef = useModalA11y(true, onClose)
  const [step, setStep] = useState(1)
  const [data, setData] = useState<Data>(EMPTY)
  const [visible, setVisible] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function advance(next: number) {
    setVisible(false)
    setTimeout(() => { setStep(next); setVisible(true) }, 160)
  }

  function pick<K extends keyof Data>(key: K, value: Data[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function toggleDietary(opt: string) {
    setData(prev => {
      const cur = prev.dietaryNeeds
      return {
        ...prev,
        dietaryNeeds: cur.includes(opt) ? cur.filter(d => d !== opt) : [...cur, opt],
      }
    })
  }

  async function submit() {
    if (!data.name.trim() || !data.email.trim()) {
      setError('Name and email are required.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          city: data.city,
          state: data.state,
          location: [data.city, data.state].filter(Boolean).join(', '),
          eventType: data.eventType,
          eventDate: data.eventDate || null,
          eventTime: data.eventTime || null,
          guestCount: data.guestCount,
          budget: data.budget,
          dietaryNeeds: data.dietaryNeeds.join(', ') || null,
          notes: data.notes || null,
          source: 'hero_quiz',
        }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const progress = (step / TOTAL_STEPS) * 100

  const input = 'w-full px-4 py-3 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/60 text-sm outline-none focus:border-[#B57F50] transition-colors'
  const btn   = 'w-full py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

  function card(selected: boolean) {
    return `p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
      selected
        ? 'border-[#B57F50] bg-[#B57F50]/8'
        : 'border-black/8 bg-[#F5F4F0] hover:border-[#B57F50]/50'
    }`
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ramen catering request"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[93vh] flex flex-col outline-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-black/5 flex-shrink-0">
          <div>
            <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest">
              {done ? 'Catering Request' : `Step ${step} of ${TOTAL_STEPS}`}
            </p>
            <h2 className="font-serif text-xl font-bold text-[#1E2026]">
              {done ? "You're all set!" : STEP_TITLES[step]}
            </h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-2 rounded-lg hover:bg-black/5 transition-colors">
            <X className="w-5 h-5 text-[#6B6862]" />
          </button>
        </div>

        {/* Progress */}
        {!done && (
          <div className="h-1 bg-black/5 flex-shrink-0">
            <div
              className="h-full bg-[#B57F50] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div
            className="px-6 py-6 transition-all duration-160 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
            }}
          >

            {/* ─── DONE ─────────────────────────────────────────── */}
            {done && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-[#B57F50]/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#96602F]" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E2026] mb-2">Request received!</h3>
                <p className="text-[#6B6862] text-sm leading-relaxed mb-6">
                  We&apos;ll review your event details and personally match you with ramen caterers
                  {data.city ? ` in ${data.city}` : ' in your area'}.
                  Expect to hear back within 1 business day at{' '}
                  <span className="text-[#1E2026] font-medium">{data.email}</span>.
                </p>
                <button onClick={onClose} className={btn}>Done</button>
              </div>
            )}

            {/* ─── STEP 1 — Location ────────────────────────────── */}
            {!done && step === 1 && (
              <div className="space-y-4">
                <p className="text-[#6B6862] text-sm">Where is your event taking place?</p>
                <div>
                  <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">City</label>
                  <input
                    autoFocus
                    value={data.city}
                    onChange={e => pick('city', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && data.city.trim() && advance(2)}
                    placeholder="e.g. Atlanta"
                    className={input}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">State</label>
                  <select
                    value={data.state}
                    onChange={e => pick('state', e.target.value)}
                    className={`${input} appearance-none cursor-pointer`}
                  >
                    <option value="">Select state…</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button className={btn} disabled={!data.city.trim()} onClick={() => advance(2)}>
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            )}

            {/* ─── STEP 2 — Event Type ──────────────────────────── */}
            {!done && step === 2 && (
              <div className="space-y-3">
                <p className="text-[#6B6862] text-sm">What kind of event are you planning?</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {EVENT_TYPES.map(et => (
                    <button
                      key={et.label}
                      onClick={() => { pick('eventType', et.label); setTimeout(() => advance(3), 130) }}
                      className={card(data.eventType === et.label)}
                    >
                      <p className="text-sm font-semibold text-[#1E2026]">{et.label}</p>
                      <p className="text-xs text-[#6B6862] mt-0.5 leading-snug">{et.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── STEP 3 — Date & Time ─────────────────────────── */}
            {!done && step === 3 && (
              <div className="space-y-5">
                <p className="text-[#6B6862] text-sm">When do you need catering?</p>
                <div>
                  <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Event Date</label>
                  <input
                    type="date"
                    value={data.eventDate}
                    onChange={e => pick('eventDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`${input} [color-scheme:light]`}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#6B6862] mb-2 uppercase tracking-wide">Time of Day</label>
                  <div className="flex flex-col gap-2">
                    {TIME_OPTIONS.map(t => (
                      <button
                        key={t}
                        onClick={() => pick('eventTime', t)}
                        className={`px-4 py-3 rounded-lg border-2 text-left text-sm font-medium transition-all ${
                          data.eventTime === t
                            ? 'border-[#B57F50] bg-[#B57F50]/8 text-[#96602F]'
                            : 'border-black/8 text-[#1E2026] hover:border-[#B57F50]/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <button className={btn} onClick={() => advance(4)}>
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            )}

            {/* ─── STEP 4 — Guest Count ─────────────────────────── */}
            {!done && step === 4 && (
              <div className="space-y-3">
                <p className="text-[#6B6862] text-sm">How many guests are you expecting?</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {GUEST_COUNTS.map(g => (
                    <button
                      key={g.label}
                      onClick={() => { pick('guestCount', g.label); setTimeout(() => advance(5), 130) }}
                      className={card(data.guestCount === g.label)}
                    >
                      <p className="text-sm font-semibold text-[#1E2026]">{g.label}</p>
                      <p className="text-xs text-[#6B6862] mt-0.5">{g.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── STEP 5 — Budget ──────────────────────────────── */}
            {!done && step === 5 && (
              <div className="space-y-3">
                <p className="text-[#6B6862] text-sm">What&apos;s your approximate budget?</p>
                <div className="flex flex-col gap-2">
                  {BUDGETS.map(b => (
                    <button
                      key={b.label}
                      onClick={() => { pick('budget', b.label); setTimeout(() => advance(6), 130) }}
                      className={`px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        data.budget === b.label
                          ? 'border-[#B57F50] bg-[#B57F50]/8'
                          : 'border-black/8 bg-[#F5F4F0] hover:border-[#B57F50]/50'
                      }`}
                    >
                      <span className="text-sm font-semibold text-[#1E2026]">{b.label}</span>
                      <span className="text-xs text-[#6B6862] ml-2">{b.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ─── STEP 6 — Dietary Needs ───────────────────────── */}
            {!done && step === 6 && (
              <div className="space-y-4">
                <p className="text-[#6B6862] text-sm">Any dietary requirements? Select all that apply.</p>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => toggleDietary(opt)}
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                        data.dietaryNeeds.includes(opt)
                          ? 'border-[#B57F50] bg-[#B57F50]/10 text-[#96602F]'
                          : 'border-black/8 text-[#1E2026] hover:border-[#B57F50]/40'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  className={btn}
                  disabled={data.dietaryNeeds.length === 0}
                  onClick={() => advance(7)}
                >
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            )}

            {/* ─── STEP 7 — Contact Info ────────────────────────── */}
            {!done && step === 7 && (
              <div className="space-y-4">
                <p className="text-[#6B6862] text-sm">
                  Last step — where should we send your catering matches?
                </p>
                {error && (
                  <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      autoFocus
                      value={data.name}
                      onChange={e => pick('name', e.target.value)}
                      placeholder="Your name"
                      className={input}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => pick('email', e.target.value)}
                      placeholder="you@example.com"
                      className={input}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">Phone</label>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={e => pick('phone', e.target.value)}
                      placeholder="(404) 555-0100"
                      className={input}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#6B6862] mb-1.5 uppercase tracking-wide">
                      Anything else?
                    </label>
                    <textarea
                      rows={3}
                      value={data.notes}
                      onChange={e => pick('notes', e.target.value)}
                      placeholder="Special setup, ramen style preference, theme, or other details…"
                      className={`${input} resize-none`}
                    />
                  </div>
                </div>
                <button className={btn} disabled={submitting} onClick={submit}>
                  {submitting ? 'Sending…' : 'Get My Catering Quotes'}
                </button>
                <p className="text-center text-xs text-[#6B6862]/50">
                  Free service. No commitment. We&apos;ll match you and you choose.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Back button */}
        {!done && step > 1 && (
          <div className="px-6 pb-5 flex-shrink-0 border-t border-black/5 pt-4">
            <button
              onClick={() => advance(step - 1)}
              className="text-xs text-[#6B6862] hover:text-[#1E2026] transition-colors"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
