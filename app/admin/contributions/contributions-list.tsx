'use client'

import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { CONTRIBUTION_LABELS, type ContributionType } from '@/lib/ramen-pass'

export interface AdminContribution {
  id: string
  user_id: string
  type: string
  amount: number
  status: string
  reference_id: string | null
  billing_period: string
  created_at: string
  display_name: string | null
}

type Tab = 'pending' | 'approved' | 'rejected'

export default function ContributionsList({ initial }: { initial: AdminContribution[] }) {
  const [items, setItems] = useState(initial)
  const [tab, setTab] = useState<Tab>('pending')
  const [busy, setBusy] = useState<string | null>(null)

  // Pending tab also surfaces auto-credited rows? No — only manual-review rows
  // are ever 'pending'. Approved includes both auto and admin-approved.
  const filtered = items.filter(i => {
    if (tab === 'pending') return i.status === 'pending'
    if (tab === 'approved') return i.status === 'approved' || i.status === 'applied'
    return i.status === 'rejected'
  })

  async function act(id: string, action: 'approve' | 'reject') {
    setBusy(id)
    try {
      const res = await fetch(`/api/admin/contributions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        setItems(prev =>
          prev.map(i => (i.id === id ? { ...i, status: action === 'approve' ? 'approved' : 'rejected' } : i)),
        )
      }
    } finally {
      setBusy(null)
    }
  }

  const counts = {
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved' || i.status === 'applied').length,
    rejected: items.filter(i => i.status === 'rejected').length,
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected'] as Tab[]).map(t => (
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
        <p className="text-[#6B6862] text-sm py-12 text-center">No {tab} contributions.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(c => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 bg-white rounded-xl border border-black/5 p-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-[#1E2026] text-sm">
                  {CONTRIBUTION_LABELS[c.type as ContributionType] ?? c.type}
                  <span className="ml-2 text-[#96602F]">${c.amount.toFixed(2)}</span>
                </p>
                <p className="text-[#6B6862] text-xs truncate">
                  {c.display_name ?? c.user_id.slice(0, 8)} ·{' '}
                  {c.reference_id ?? '—'} · {new Date(c.created_at).toLocaleDateString()}
                </p>
              </div>

              {c.status === 'pending' ? (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => act(c.id, 'approve')}
                    disabled={busy === c.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    {busy === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Approve
                  </button>
                  <button
                    onClick={() => act(c.id, 'reject')}
                    disabled={busy === c.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white border border-black/10 hover:bg-black/5 text-[#1E2026] text-xs font-bold transition-colors disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                    c.status === 'rejected'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-emerald-50 text-emerald-600'
                  }`}
                >
                  {c.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
