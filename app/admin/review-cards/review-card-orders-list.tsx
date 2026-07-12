'use client'

import { useState } from 'react'
import { Check, X, Loader2, Printer, Mail, QrCode, RotateCcw } from 'lucide-react'

export interface ReviewCardOrder {
  id: string
  restaurant_slug: string
  restaurant_name: string
  city: string | null
  state_code: string | null
  buyer_name: string | null
  buyer_email: string
  status: string
  admin_note: string | null
  created_at: string
  fulfilled_at: string | null
}

type Tab = 'all' | 'pending' | 'fulfilled' | 'cancelled'

// Pre-written fulfillment email: opens the admin's mail client with the print
// link filled in — the "send the kit" step of the human-in-the-loop flow.
function fulfillmentMailto(o: ReviewCardOrder): string {
  const printUrl = `https://www.ramennearyou.com/review-cards/print/${o.restaurant_slug}`
  const subject = `Your Google Review Cards for ${o.restaurant_name} are ready! ⭐`
  const body = [
    `Hi${o.buyer_name ? ` ${o.buyer_name}` : ''},`,
    '',
    `Thanks for your order — your Google Review Card kit for ${o.restaurant_name} is ready:`,
    '',
    printUrl,
    '',
    'Open that link, hit "Print / Save as PDF" (cardstock looks best), cut along the card edges, and place them where customers pay or wait. Each QR opens your Google review page in one scan.',
    '',
    'Tip: the table tent by the register works best — people scan while they wait for the card reader.',
    '',
    'Questions any time: just reply to this email.',
    '',
    '— Ramen Near You',
  ].join('\n')
  return `mailto:${o.buyer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ReviewCardOrdersList({
  initial,
  scanCounts,
}: {
  initial: ReviewCardOrder[]
  scanCounts: Record<string, number>
}) {
  const [items, setItems] = useState<ReviewCardOrder[]>(initial)
  const [tab, setTab] = useState<Tab>('pending')
  const [busy, setBusy] = useState<string | null>(null)

  const filtered = items.filter(i => (tab === 'all' ? true : i.status === tab))
  const counts = {
    all: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    fulfilled: items.filter(i => i.status === 'fulfilled').length,
    cancelled: items.filter(i => i.status === 'cancelled').length,
  }

  async function act(id: string, action: 'fulfill' | 'cancel' | 'reopen') {
    setBusy(id)
    try {
      const res = await fetch(`/api/admin/review-cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        const status = action === 'fulfill' ? 'fulfilled' : action === 'cancel' ? 'cancelled' : 'pending'
        setItems(prev => prev.map(i => (i.id === id ? { ...i, status } : i)))
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'pending', 'fulfilled', 'cancelled'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
              tab === t ? 'bg-[#1E2026] text-white' : 'bg-white text-[#6B6862] hover:bg-black/5'
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#6B6862] text-sm py-12 text-center">No {tab === 'all' ? '' : tab} review card orders.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <div key={o.id} className="bg-white rounded-xl border border-black/5 p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-[#1E2026] text-sm">{o.restaurant_name}</span>
                    {(o.city || o.state_code) && (
                      <span className="text-xs text-[#6B6862]">{[o.city, o.state_code].filter(Boolean).join(', ')}</span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium bg-[#B57F50]/10 text-[#96602F] border-[#B57F50]/20">
                      <QrCode className="w-3 h-3" />
                      {scanCounts[o.restaurant_slug] ?? 0} scans
                    </span>
                  </div>
                  <p className="text-[#6B6862] text-sm">
                    {o.buyer_name ? `${o.buyer_name} — ` : ''}{o.buyer_email}
                  </p>
                  <p className="text-[#6B6862] text-xs mt-0.5">
                    Ordered {new Date(o.created_at).toLocaleString()}
                    {o.fulfilled_at && <span className="ml-2">· Fulfilled {new Date(o.fulfilled_at).toLocaleString()}</span>}
                  </p>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <a
                      href={`/review-cards/print/${o.restaurant_slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 text-[#1E2026] text-xs font-semibold hover:border-[#B57F50] hover:text-[#96602F] transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print page
                    </a>
                    <a
                      href={fulfillmentMailto(o)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 text-[#1E2026] text-xs font-semibold hover:border-[#B57F50] hover:text-[#96602F] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email kit to buyer
                    </a>
                  </div>
                </div>

                <div className="shrink-0">
                  {o.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => act(o.id, 'fulfill')}
                        disabled={busy === o.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        {busy === o.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        Mark Fulfilled
                      </button>
                      <button
                        onClick={() => act(o.id, 'cancel')}
                        disabled={busy === o.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-black/10 hover:bg-black/5 text-[#1E2026] text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        o.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {o.status}
                      </span>
                      <button
                        onClick={() => act(o.id, 'reopen')}
                        disabled={busy === o.id}
                        title="Reopen as pending"
                        className="p-1.5 rounded-lg border border-black/10 text-[#6B6862] hover:text-[#1E2026] transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
