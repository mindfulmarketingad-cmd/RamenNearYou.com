'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Claim {
  id: string
  restaurant_name: string
  restaurant_slug: string
  restaurant_city: string
  contact_name: string
  contact_email: string
  message: string
  status: string
  admin_note: string | null
  created_at: string
}

interface ParsedMessage {
  role?: string
  corrections?: {
    name?: string
    phone?: string
    website?: string
    description?: string
    hours?: Record<string, string>
  }
}

function parseMessage(raw: string): ParsedMessage {
  try { return JSON.parse(raw) } catch { return {} }
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? 'bg-white/10 text-white/60 border-white/10'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function ClaimCard({ claim, onUpdate }: { claim: Claim; onUpdate: (id: string, status: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [note, setNote] = useState(claim.admin_note ?? '')
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const parsed = parseMessage(claim.message)

  async function act(status: 'approved' | 'rejected') {
    setLoading(status === 'approved' ? 'approve' : 'reject')
    const res = await fetch(`/api/admin/claims/${claim.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, admin_note: note }),
    })
    if (res.ok) onUpdate(claim.id, status)
    setLoading(null)
  }

  return (
    <div className="bg-[#1E2026] rounded-xl border border-white/5 overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-white truncate">{claim.restaurant_name}</h3>
            <StatusBadge status={claim.status} />
          </div>
          <p className="text-[#B0B3BB] text-sm">
            {claim.contact_name} &mdash; {claim.contact_email}
            {parsed.role && <span className="text-[#B0B3BB]/60"> ({parsed.role})</span>}
          </p>
          <p className="text-[#B0B3BB]/50 text-xs mt-1">
            {claim.restaurant_city} · {new Date(claim.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-white/5 text-[#B0B3BB] transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
          {parsed.corrections && (
            <div>
              <p className="text-xs text-[#B0B3BB]/60 uppercase tracking-wide mb-2">Submitted Corrections</p>
              <div className="bg-[#2F323A] rounded-lg p-4 space-y-2 text-sm">
                {parsed.corrections.name && (
                  <div className="flex gap-2">
                    <span className="text-[#B0B3BB]/60 w-24 flex-shrink-0">Name</span>
                    <span className="text-white">{parsed.corrections.name}</span>
                  </div>
                )}
                {parsed.corrections.phone && (
                  <div className="flex gap-2">
                    <span className="text-[#B0B3BB]/60 w-24 flex-shrink-0">Phone</span>
                    <span className="text-white">{parsed.corrections.phone}</span>
                  </div>
                )}
                {parsed.corrections.website && (
                  <div className="flex gap-2">
                    <span className="text-[#B0B3BB]/60 w-24 flex-shrink-0">Website</span>
                    <span className="text-white">{parsed.corrections.website}</span>
                  </div>
                )}
                {parsed.corrections.description && (
                  <div className="flex gap-2">
                    <span className="text-[#B0B3BB]/60 w-24 flex-shrink-0">Description</span>
                    <span className="text-white">{parsed.corrections.description}</span>
                  </div>
                )}
                {parsed.corrections.hours && Object.keys(parsed.corrections.hours).length > 0 && (
                  <div>
                    <p className="text-[#B0B3BB]/60 mb-1">Hours</p>
                    <div className="pl-2 space-y-0.5">
                      {Object.entries(parsed.corrections.hours).map(([day, hrs]) => (
                        hrs ? (
                          <div key={day} className="flex gap-2">
                            <span className="text-[#B0B3BB]/60 w-24">{day}</span>
                            <span className="text-white">{hrs}</span>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {claim.status === 'pending' && (
            <div>
              <label className="block text-xs text-[#B0B3BB]/60 uppercase tracking-wide mb-1.5">
                Admin Note (optional — sent with decision)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason for approval or rejection…"
                className="w-full px-3 py-2 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/40 text-sm outline-none focus:border-[#77567A] transition-colors resize-none"
              />
            </div>
          )}

          {claim.admin_note && claim.status !== 'pending' && (
            <div>
              <p className="text-xs text-[#B0B3BB]/60 uppercase tracking-wide mb-1">Admin Note</p>
              <p className="text-sm text-[#B0B3BB] bg-[#2F323A] rounded-lg px-4 py-3">{claim.admin_note}</p>
            </div>
          )}

          {claim.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => act('approved')}
                disabled={loading !== null}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {loading === 'approve' ? 'Approving…' : 'Approve'}
              </button>
              <button
                onClick={() => act('rejected')}
                disabled={loading !== null}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                {loading === 'reject' ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ClaimsList({ initialClaims }: { initialClaims: Claim[] }) {
  const [claims, setClaims] = useState(initialClaims)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  function handleUpdate(id: string, status: string) {
    setClaims((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
  }

  const filtered = filter === 'all' ? claims : claims.filter((c) => c.status === filter)
  const counts = {
    pending: claims.filter((c) => c.status === 'pending').length,
    approved: claims.filter((c) => c.status === 'approved').length,
    rejected: claims.filter((c) => c.status === 'rejected').length,
  }

  return (
    <div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-[#77567A] text-white'
                : 'bg-[#2F323A] text-[#B0B3BB] hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && <span className="ml-1.5 opacity-70">({counts[f]})</span>}
            {f === 'all' && <span className="ml-1.5 opacity-70">({claims.length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#B0B3BB]/50">
          No {filter === 'all' ? '' : filter} claims yet.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
