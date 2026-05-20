'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Listing {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string | null
  phone: string | null
  website: string | null
  description: string | null
  broth_types: string[] | null
  hours: string | null
  owner_name: string | null
  owner_email: string | null
  status: string
  created_at: string
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

function ListingCard({ listing, onUpdate }: { listing: Listing; onUpdate: (id: string, status: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  async function act(action: 'approve' | 'reject') {
    setLoading(action)
    const newStatus = action === 'approve' ? 'approved' : 'rejected'
    try {
      await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: listing.id, status: newStatus }),
      })
      onUpdate(listing.id, newStatus)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-[#2F323A] rounded-xl border border-white/5 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="font-semibold text-white text-base">{listing.name}</p>
              <StatusBadge status={listing.status} />
            </div>
            <p className="text-[#B0B3BB] text-xs">{listing.address}, {listing.city}, {listing.state}{listing.zip ? ` ${listing.zip}` : ''}</p>
            <p className="text-[#B0B3BB]/50 text-xs mt-0.5">{new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="shrink-0 text-[#B0B3BB] hover:text-white transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

        {/* Quick info row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#B0B3BB]/70 mb-4">
          {listing.phone && <span>📞 {listing.phone}</span>}
          {listing.website && <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-[#B57F50] hover:underline">🌐 Website</a>}
          {listing.owner_name && <span>👤 {listing.owner_name}</span>}
          {listing.owner_email && <a href={`mailto:${listing.owner_email}`} className="text-[#B57F50] hover:underline">✉ {listing.owner_email}</a>}
        </div>

        {expanded && (
          <div className="mb-4 space-y-2 text-xs text-[#B0B3BB] bg-[#1E2026] rounded-lg p-4">
            {listing.broth_types?.length ? <p><span className="text-white font-medium">Broth types:</span> {listing.broth_types.join(', ')}</p> : null}
            {listing.hours && <p><span className="text-white font-medium">Hours:</span> {listing.hours}</p>}
            {listing.description && <p><span className="text-white font-medium">Description:</span> {listing.description}</p>}
          </div>
        )}

        {listing.status === 'pending' && (
          <div className="flex gap-2">
            <button
              onClick={() => act('approve')}
              disabled={!!loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-400 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {loading === 'approve' ? 'Approving…' : 'Approve'}
            </button>
            <button
              onClick={() => act('reject')}
              disabled={!!loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <XCircle className="w-3.5 h-3.5" />
              {loading === 'reject' ? 'Rejecting…' : 'Reject'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ListingsList({ initialListings }: { initialListings: Listing[] }) {
  const [listings, setListings] = useState(initialListings)

  function handleUpdate(id: string, status: string) {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const pending = listings.filter(l => l.status === 'pending')
  const rest = listings.filter(l => l.status !== 'pending')

  return (
    <div className="space-y-8">
      {pending.length > 0 && (
        <div>
          <p className="text-white font-semibold text-sm mb-3">{pending.length} pending review</p>
          <div className="space-y-4">
            {pending.map(l => <ListingCard key={l.id} listing={l} onUpdate={handleUpdate} />)}
          </div>
        </div>
      )}
      {rest.length > 0 && (
        <div>
          <p className="text-[#B0B3BB] text-sm font-medium mb-3">Previously reviewed</p>
          <div className="space-y-3">
            {rest.map(l => <ListingCard key={l.id} listing={l} onUpdate={handleUpdate} />)}
          </div>
        </div>
      )}
      {listings.length === 0 && (
        <div className="text-center py-16 text-[#B0B3BB]">
          <p className="text-4xl mb-3">📋</p>
          <p>No listing submissions yet.</p>
        </div>
      )}
    </div>
  )
}
