'use client'

import { useState } from 'react'
import { Check, X, Loader2, Image as ImageIcon, MessageSquare, FileEdit } from 'lucide-react'

export interface ListingEdit {
  id: string
  restaurant_slug: string
  user_id: string
  type: string
  payload: Record<string, unknown>
  status: string
  admin_note: string | null
  created_at: string
  reviewed_at: string | null
}

type Tab = 'all' | 'pending' | 'approved' | 'rejected'

function typeBadge(type: string) {
  if (type === 'info') return { label: 'Info Edit', icon: <FileEdit className="w-3 h-3" />, cls: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/30' }
  if (type === 'photo') return { label: 'Photo', icon: <ImageIcon className="w-3 h-3" />, cls: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30' }
  if (type === 'review_response') return { label: 'Review Response', icon: <MessageSquare className="w-3 h-3" />, cls: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/30' }
  return { label: type, icon: null, cls: 'bg-gray-50 text-gray-700 border-gray-200' }
}

function PayloadDisplay({ type, payload }: { type: string; payload: Record<string, unknown> }) {
  if (type === 'info') {
    const field = payload.field as string
    const old_value = payload.old_value as string
    const new_value = payload.new_value as string
    return (
      <div className="mt-2 text-sm space-y-1">
        <p className="font-medium text-ink capitalize">{field.replace(/_/g, ' ')}</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-ink-soft text-xs mb-0.5">Current</p>
            <p className="text-ink-soft bg-red-50 dark:bg-red-500/10 border border-red-100 rounded px-2 py-1 text-xs break-words max-h-20 overflow-y-auto">
              {old_value || <span className="italic">(empty)</span>}
            </p>
          </div>
          <div>
            <p className="text-ink-soft text-xs mb-0.5">Requested</p>
            <p className="text-ink bg-green-50 dark:bg-green-500/10 border border-green-100 rounded px-2 py-1 text-xs break-words max-h-20 overflow-y-auto">
              {new_value || <span className="italic">(empty)</span>}
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'photo') {
    const url = payload.url as string
    const caption = payload.caption as string
    return (
      <div className="mt-2">
        {url && (
          <img
            src={url}
            alt="Submitted photo"
            className="max-w-[180px] rounded-lg border border-line/10 object-cover"
          />
        )}
        {caption && <p className="text-xs text-ink-soft mt-1">{caption}</p>}
      </div>
    )
  }

  if (type === 'review_response') {
    const review_body = payload.review_body as string
    const response = payload.response as string
    return (
      <div className="mt-2 text-sm space-y-2">
        {review_body && (
          <div>
            <p className="text-ink-soft text-xs mb-0.5">Customer review</p>
            <p className="text-ink-soft bg-sunken rounded px-2 py-1 text-xs italic">{review_body}</p>
          </div>
        )}
        <div>
          <p className="text-ink-soft text-xs mb-0.5">Owner response</p>
          <p className="text-ink bg-sky-50 dark:bg-sky-500/10 border border-sky-100 rounded px-2 py-1 text-xs">{response}</p>
        </div>
      </div>
    )
  }

  return <pre className="text-xs mt-2 text-ink-soft">{JSON.stringify(payload, null, 2)}</pre>
}

export default function ListingEditsList({ initial }: { initial: Record<string, unknown>[] }) {
  const [items, setItems] = useState<ListingEdit[]>(initial as unknown as ListingEdit[])
  const [tab, setTab] = useState<Tab>('pending')
  const [busy, setBusy] = useState<string | null>(null)

  const filtered = items.filter(i => {
    if (tab === 'all') return true
    return i.status === tab
  })

  const counts = {
    all: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length,
  }

  async function act(id: string, action: 'approve' | 'reject') {
    setBusy(id)
    try {
      const res = await fetch(`/api/admin/listing-edits/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        setItems(prev =>
          prev.map(i => (i.id === id ? { ...i, status: action === 'approve' ? 'approved' : 'rejected' } : i))
        )
      }
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
              tab === t ? 'bg-contrast text-white' : 'bg-surface text-ink-soft hover:bg-black/5'
            }`}
          >
            {t} ({counts[t]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-ink-soft text-sm py-12 text-center">No {tab === 'all' ? '' : tab} listing edits.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(edit => {
            const badge = typeBadge(edit.type)
            return (
              <div
                key={edit.id}
                className="bg-surface rounded-xl border border-line/5 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-ink text-sm">{edit.restaurant_slug}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${badge.cls}`}>
                        {badge.icon}
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-ink-soft text-xs">
                      {new Date(edit.created_at).toLocaleString()}
                      {edit.reviewed_at && (
                        <span className="ml-2">· Reviewed {new Date(edit.reviewed_at).toLocaleString()}</span>
                      )}
                    </p>
                    <PayloadDisplay type={edit.type} payload={edit.payload} />
                    {edit.admin_note && (
                      <p className="mt-2 text-xs text-ink-soft italic">Note: {edit.admin_note}</p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {edit.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => act(edit.id, 'approve')}
                          disabled={busy === edit.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          {busy === edit.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          Approve
                        </button>
                        <button
                          onClick={() => act(edit.id, 'reject')}
                          disabled={busy === edit.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line/10 hover:bg-black/5 text-ink text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                          edit.status === 'rejected'
                            ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {edit.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
