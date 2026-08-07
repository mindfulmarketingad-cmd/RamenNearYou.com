'use client'

import { useEffect, useRef, useState } from 'react'
import { Activity, Radio } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ANALYTICS_TABLE } from '@/lib/analytics-table'

type LiveRow = {
  id: string
  created_at: string
  event_type: string
  path: string | null
  listing_name: string | null
  city: string | null
  query: string | null
}

const LABELS: Record<string, string> = {
  pageview: 'Pageview',
  listing_view: 'Listing view',
  call_click: 'Phone call',
  directions_click: 'Directions',
  review_click: 'Review click',
  search: 'Search',
}

const DOT: Record<string, string> = {
  call_click: 'bg-emerald-500',
  directions_click: 'bg-sky-500',
  review_click: 'bg-violet-500',
  search: 'bg-amber-500',
  listing_view: 'bg-[#B57F50]',
  pageview: 'bg-[#1E2026]/30',
}

function timeAgo(iso: string): string {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000))
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

export default function LiveActivity() {
  const [rows, setRows] = useState<LiveRow[]>([])
  const [connected, setConnected] = useState(false)
  const [sinceOpen, setSinceOpen] = useState(0)
  // Re-render once a second so the relative timestamps stay honest.
  const [, setTick] = useState(0)
  const mounted = useRef(true)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    mounted.current = true
    const supabase = createClient()

    const channel = supabase
      .channel('ramennearyou-dashboard-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: ANALYTICS_TABLE },
        (payload) => {
          if (!mounted.current) return
          const row = payload.new as LiveRow
          setRows(prev => [row, ...prev].slice(0, 40))
          setSinceOpen(n => n + 1)
        },
      )
      .subscribe((status) => {
        if (mounted.current) setConnected(status === 'SUBSCRIBED')
      })

    return () => {
      mounted.current = false
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="bg-white border border-black/8 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-black/8">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#96602F]" />
          <h2 className="font-serif text-lg font-bold text-[#1E2026]">Live Activity</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B6862]">
            <strong className="text-[#1E2026]">{sinceOpen}</strong> since you opened this page
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
              connected ? 'bg-emerald-500/10 text-emerald-600' : 'bg-black/5 text-[#6B6862]'
            }`}
          >
            <Radio className={`w-3 h-3 ${connected ? 'animate-pulse' : ''}`} />
            {connected ? 'Live' : 'Connecting'}
          </span>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {rows.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#6B6862]">
            Waiting for the next visitor event…
          </p>
        ) : (
          <ul className="divide-y divide-black/5">
            {rows.map(r => (
              <li key={r.id} className="flex items-start gap-3 px-5 py-3">
                <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${DOT[r.event_type] ?? 'bg-[#1E2026]/30'}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1E2026]">
                    {LABELS[r.event_type] ?? r.event_type}
                    {r.listing_name && <span className="font-normal text-[#6B6862]"> · {r.listing_name}</span>}
                  </p>
                  <p className="text-xs text-[#6B6862] truncate">
                    {r.query ? `“${r.query}”` : r.path}
                    {r.city ? ` · ${r.city}` : ''}
                  </p>
                </div>
                <span className="text-[11px] text-[#9B9490] shrink-0">{timeAgo(r.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
