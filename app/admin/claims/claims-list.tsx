'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, LayoutDashboard, PlusCircle, Link2 } from 'lucide-react'

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
  user_id: string | null
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
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? 'bg-black/8 text-[#1E2026]/60 border-black/8'}`}>
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
    <div className="bg-[#F5F4F0] rounded-xl border border-black/5 overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-[#1E2026] truncate">{claim.restaurant_name}</h3>
            <StatusBadge status={claim.status} />
          </div>
          <p className="text-[#6B6862] text-sm">
            {claim.contact_name} &mdash; {claim.contact_email}
            {parsed.role && <span className="text-[#6B6862]/60"> ({parsed.role})</span>}
          </p>
          <p className="text-[#6B6862]/50 text-xs mt-1">
            {claim.restaurant_city} · {new Date(claim.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-black/5 text-[#6B6862] transition-colors"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-black/5 pt-4">
          {parsed.corrections && (
            <div>
              <p className="text-xs text-[#6B6862]/60 uppercase tracking-wide mb-2">Submitted Corrections</p>
              <div className="bg-[#ffffff] rounded-lg p-4 space-y-2 text-sm">
                {parsed.corrections.name && (
                  <div className="flex gap-2">
                    <span className="text-[#6B6862]/60 w-24 flex-shrink-0">Name</span>
                    <span className="text-[#1E2026]">{parsed.corrections.name}</span>
                  </div>
                )}
                {parsed.corrections.phone && (
                  <div className="flex gap-2">
                    <span className="text-[#6B6862]/60 w-24 flex-shrink-0">Phone</span>
                    <span className="text-[#1E2026]">{parsed.corrections.phone}</span>
                  </div>
                )}
                {parsed.corrections.website && (
                  <div className="flex gap-2">
                    <span className="text-[#6B6862]/60 w-24 flex-shrink-0">Website</span>
                    <span className="text-[#1E2026]">{parsed.corrections.website}</span>
                  </div>
                )}
                {parsed.corrections.description && (
                  <div className="flex gap-2">
                    <span className="text-[#6B6862]/60 w-24 flex-shrink-0">Description</span>
                    <span className="text-[#1E2026]">{parsed.corrections.description}</span>
                  </div>
                )}
                {parsed.corrections.hours && Object.keys(parsed.corrections.hours).length > 0 && (
                  <div>
                    <p className="text-[#6B6862]/60 mb-1">Hours</p>
                    <div className="pl-2 space-y-0.5">
                      {Object.entries(parsed.corrections.hours).map(([day, hrs]) => (
                        hrs ? (
                          <div key={day} className="flex gap-2">
                            <span className="text-[#6B6862]/60 w-24">{day}</span>
                            <span className="text-[#1E2026]">{hrs}</span>
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
              <label className="block text-xs text-[#6B6862]/60 uppercase tracking-wide mb-1.5">
                Admin Note (optional — sent with decision)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Reason for approval or rejection…"
                className="w-full px-3 py-2 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/40 text-sm outline-none focus:border-[#B57F50] transition-colors resize-none"
              />
            </div>
          )}

          {claim.admin_note && claim.status !== 'pending' && (
            <div>
              <p className="text-xs text-[#6B6862]/60 uppercase tracking-wide mb-1">Admin Note</p>
              <p className="text-sm text-[#6B6862] bg-[#ffffff] rounded-lg px-4 py-3">{claim.admin_note}</p>
            </div>
          )}

          {claim.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => act('approved')}
                disabled={loading !== null}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-[#1E2026] text-sm font-medium transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {loading === 'approve' ? 'Approving…' : 'Approve'}
              </button>
              <button
                onClick={() => act('rejected')}
                disabled={loading !== null}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-[#1E2026] text-sm font-medium transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                {loading === 'reject' ? 'Rejecting…' : 'Reject'}
              </button>
            </div>
          )}

          {claim.status === 'approved' && claim.restaurant_slug && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap">
                <Link
                  href={`/admin/owner-view/${claim.restaurant_slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#96602F] text-sm font-medium transition-colors border border-[#B57F50]/30"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Preview Dashboard
                </Link>
              </div>
              <LinkOwnerPanel claimId={claim.id} currentUserId={claim.user_id} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LinkOwnerPanel({ claimId, currentUserId }: { claimId: string; currentUserId: string | null }) {
  const [userId, setUserId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function submit() {
    if (!userId.trim()) return
    setLoading(true)
    setResult(null)
    const res = await fetch(`/api/admin/claims/${claimId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_user_id: userId.trim() }),
    })
    const json = await res.json()
    setResult(res.ok ? 'Done — owner account linked.' : `Error: ${json.error}`)
    if (res.ok) setUserId('')
    setLoading(false)
  }

  return (
    <div className="border-t border-black/5 pt-3">
      <p className="text-xs text-[#6B6862]/60 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <Link2 className="w-3.5 h-3.5" /> Link Owner Account
      </p>
      {currentUserId && (
        <p className="text-xs text-[#6B6862] mb-2">Current user_id: <code className="bg-black/5 px-1 rounded">{currentUserId}</code></p>
      )}
      <p className="text-[#6B6862] text-xs mb-2">
        Enter the owner&apos;s Supabase user_id (from Dashboard → Authentication → Users) to link their account. This lets them edit the listing immediately.
      </p>
      <div className="flex gap-2">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="flex-1 px-3 py-2 bg-white border border-black/8 rounded-lg text-sm text-[#1E2026] placeholder-[#9B9490]/40 font-mono outline-none focus:border-sky-400 transition-colors"
        />
        <button
          onClick={submit}
          disabled={loading || !userId.trim()}
          className="px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Link'}
        </button>
      </div>
      {result && (
        <p className={`mt-1.5 text-xs ${result.startsWith('Error') ? 'text-red-500' : 'text-emerald-600'}`}>
          {result}
        </p>
      )}
    </div>
  )
}

function RegisterClaimPanel() {
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  async function submit() {
    if (!slug.trim()) return
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/admin/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurant_slug: slug.trim() }),
    })
    const json = await res.json()
    if (res.ok) {
      setResult(`Done (${json.action}) — refresh the page to see the claim.`)
      setSlug('')
    } else {
      setResult(`Error: ${json.error}`)
    }
    setLoading(false)
  }

  return (
    <div className="mt-8 pt-6 border-t border-black/8">
      <p className="text-xs text-[#6B6862]/60 uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <PlusCircle className="w-3.5 h-3.5" /> Manually Register a Claim
      </p>
      <p className="text-[#6B6862] text-xs mb-3">
        If a restaurant is verified on its public page but not appearing here, enter its slug to register or repair the claim record.
      </p>
      <div className="flex gap-2">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="restaurant-slug (e.g. ikedo-ramen)"
          className="flex-1 px-3 py-2 bg-white border border-black/8 rounded-lg text-sm text-[#1E2026] placeholder-[#9B9490]/40 outline-none focus:border-[#B57F50] transition-colors"
        />
        <button
          onClick={submit}
          disabled={loading || !slug.trim()}
          className="px-4 py-2 rounded-lg bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Working…' : 'Register'}
        </button>
      </div>
      {result && (
        <p className={`mt-2 text-xs ${result.startsWith('Error') ? 'text-red-500' : 'text-emerald-600'}`}>
          {result}
        </p>
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
                ? 'bg-[#B57F50] text-white'
                : 'bg-[#ffffff] text-[#6B6862] hover:text-[#1E2026]'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && <span className="ml-1.5 opacity-70">({counts[f]})</span>}
            {f === 'all' && <span className="ml-1.5 opacity-70">({claims.length})</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#6B6862]/50">
          No {filter === 'all' ? '' : filter} claims yet.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} onUpdate={handleUpdate} />
          ))}
        </div>
      )}

      <RegisterClaimPanel />
    </div>
  )
}
