'use client'

import { useState } from 'react'
import { CalendarCheck, X, Loader2, CheckCircle2 } from 'lucide-react'
import { useModalA11y } from '@/lib/use-modal-a11y'

export interface InquireTarget {
  name: string
  slug: string
  city?: string
  stateCode?: string
}

interface Props {
  restaurant: InquireTarget
  source: 'listing' | 'partners' | 'find'
  className?: string
  label?: string
  // 'pill' matches the site's default pill buttons (partners rows, find
  // cards). 'iconColumn' matches the listing page's action row — a circular
  // icon above a small label (Directions/Call/Save/Claim style).
  variant?: 'pill' | 'iconColumn'
}

// One-page booking-inquiry form. Clicking the trigger opens a modal that
// posts to /api/inquire, which saves the lead to a dedicated Supabase
// project and (best-effort) emails the site owner.
export default function InquireButton({ restaurant, source, className, label = 'Inquire', variant = 'pill' }: Props) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const containerRef = useModalA11y(open, () => setOpen(false))

  function close() {
    setOpen(false)
    setStatus('idle')
    setErrorMsg('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          restaurantName: restaurant.name,
          restaurantSlug: restaurant.slug,
          city: restaurant.city,
          stateCode: restaurant.stateCode,
          partySize: form.get('partySize'),
          reservationDate: form.get('reservationDate'),
          reservationTime: form.get('reservationTime'),
          customerName: form.get('customerName'),
          customerEmail: form.get('customerEmail'),
          customerPhone: form.get('customerPhone'),
          notes: form.get('notes'),
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(json.error || 'Something went wrong. Please try again.')
      }
      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <>
      {variant === 'iconColumn' ? (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setOpen(true) }}
          className={className ?? 'flex flex-col items-center gap-1 text-[#96602F] text-[11px] font-medium shrink-0'}
        >
          <span className="w-11 h-11 rounded-full bg-[#B57F50]/10 flex items-center justify-center hover:bg-[#B57F50]/20 transition-colors">
            <CalendarCheck className="w-5 h-5" />
          </span>
          {label}
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setOpen(true) }}
          className={className ?? 'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border border-black/12 bg-white text-[#6B6862] hover:border-[#B57F50] hover:text-[#96602F] transition-colors'}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          {label}
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={close}
          role="presentation"
        >
          <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Inquire about ${restaurant.name}`}
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 p-1.5 rounded-full text-[#6B6862] hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {status === 'success' ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-2">Inquiry sent!</h2>
                <p className="text-[#6B6862] text-sm leading-relaxed mb-6">
                  {restaurant.name} will reach out to confirm your booking.
                </p>
                <button
                  onClick={close}
                  className="px-5 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-1">Booking Inquiry</p>
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1">{restaurant.name}</h2>
                <p className="text-[#6B6862] text-sm mb-5">
                  Send a booking request — the restaurant will follow up to confirm.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {status === 'error' && (
                    <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E2026] mb-1" htmlFor="reservationDate">Date</label>
                      <input
                        id="reservationDate"
                        name="reservationDate"
                        type="date"
                        required
                        min={new Date().toISOString().slice(0, 10)}
                        className="w-full px-3 py-2.5 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E2026] mb-1" htmlFor="reservationTime">Arrival time</label>
                      <input
                        id="reservationTime"
                        name="reservationTime"
                        type="time"
                        required
                        className="w-full px-3 py-2.5 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E2026] mb-1" htmlFor="partySize">Party size</label>
                    <input
                      id="partySize"
                      name="partySize"
                      type="number"
                      min={1}
                      max={50}
                      required
                      defaultValue={2}
                      className="w-full px-3 py-2.5 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E2026] mb-1" htmlFor="customerName">Your name</label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      required
                      className="w-full px-3 py-2.5 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1E2026] mb-1" htmlFor="customerEmail">Email</label>
                      <input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        className="w-full px-3 py-2.5 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#1E2026] mb-1" htmlFor="customerPhone">Phone</label>
                      <input
                        id="customerPhone"
                        name="customerPhone"
                        type="tel"
                        className="w-full px-3 py-2.5 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#6B6862] -mt-1.5">Provide at least an email or phone number.</p>

                  <div>
                    <label className="block text-xs font-semibold text-[#1E2026] mb-1" htmlFor="notes">Notes (optional)</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      placeholder="Special occasion, dietary needs, seating preference…"
                      className="w-full px-3 py-2.5 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none placeholder-[#9B9490] focus:border-[#B57F50] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors disabled:opacity-60"
                  >
                    {status === 'submitting' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {status === 'submitting' ? 'Sending…' : 'Send Inquiry'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
