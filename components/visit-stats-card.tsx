'use client'

import { useEffect, useState } from 'react'
import { Eye, TrendingUp, TrendingDown, Calendar, BarChart3, Minus, MousePointerClick } from 'lucide-react'

type DailyRow = { date: string; visits: number; clicks: number }

type VisitStats = {
  daily: DailyRow[]
  thisWeek: number
  prevWeek: number
  totalThisMonth: number
  allTime: number
  weekChange: number | null
  clicksThisWeek: number
  clicksThisMonth: number
  allTimeClicks: number
}

function MiniBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 6 : 0) : 0
  return (
    <div className="flex-1 flex flex-col justify-end" style={{ height: 56 }}>
      <div
        className="w-full rounded-t-sm transition-all duration-300 bg-[#B57F50]"
        style={{ height: `${pct}%`, minHeight: value > 0 ? 3 : 0 }}
      />
    </div>
  )
}

function WeekChangeBadge({ change }: { change: number | null }) {
  if (change === null) return <span className="text-[#6B6862] text-xs">no prior data</span>
  if (change === 0) return (
    <span className="inline-flex items-center gap-1 text-xs text-[#6B6862]">
      <Minus className="w-3 h-3" /> flat vs last week
    </span>
  )
  const up = change > 0
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? 'text-emerald-500' : 'text-red-400'}`}>
      {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {up ? '+' : ''}{change}% vs last week
    </span>
  )
}

export default function VisitStatsCard({ slug, restaurantName }: { slug: string; restaurantName: string }) {
  const [stats, setStats] = useState<VisitStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/owner/analytics?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(true); return }
        setStats(data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="mt-4 animate-pulse space-y-3">
        <div className="h-5 bg-black/6 rounded w-32" />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map(i => <div key={i} className="h-20 bg-black/5 rounded-xl" />)}
        </div>
        <div className="h-24 bg-black/5 rounded-xl" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="mt-4 p-4 rounded-xl bg-[#F5F4F0] border border-black/8 text-[#6B6862] text-xs">
        Analytics unavailable — make sure the <code className="bg-black/8 px-1 rounded">restaurant_visits</code> table exists.
      </div>
    )
  }

  const last7 = stats.daily.slice(-7)
  const maxVisits = Math.max(...last7.map(d => d.visits), 1)

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[#1E2026] text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5">
          <BarChart3 className="w-3.5 h-3.5 text-[#96602F]" /> Page Visit Analytics
        </p>
        <WeekChangeBadge change={stats.weekChange} />
      </div>

      {/* Visit stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-3">
          <div className="w-7 h-7 rounded-lg bg-[#B57F50]/10 flex items-center justify-center mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#96602F]" />
          </div>
          <p className="text-[#1E2026] text-xl font-bold">{stats.thisWeek.toLocaleString()}</p>
          <p className="text-[#6B6862] text-[11px] mt-0.5 leading-tight">Visits this week</p>
        </div>
        <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-3">
          <div className="w-7 h-7 rounded-lg bg-sky-400/10 flex items-center justify-center mb-2">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <p className="text-[#1E2026] text-xl font-bold">{stats.totalThisMonth.toLocaleString()}</p>
          <p className="text-[#6B6862] text-[11px] mt-0.5 leading-tight">Visits this month</p>
        </div>
        <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-400/10 flex items-center justify-center mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-[#1E2026] text-xl font-bold">{stats.allTime.toLocaleString()}</p>
          <p className="text-[#6B6862] text-[11px] mt-0.5 leading-tight">All-time visits</p>
        </div>
      </div>

      {/* Click stat cards — directions / website / call / order / menu taps */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-3">
          <div className="w-7 h-7 rounded-lg bg-violet-400/10 flex items-center justify-center mb-2">
            <MousePointerClick className="w-3.5 h-3.5 text-violet-500" />
          </div>
          <p className="text-[#1E2026] text-xl font-bold">{stats.clicksThisWeek.toLocaleString()}</p>
          <p className="text-[#6B6862] text-[11px] mt-0.5 leading-tight">Clicks this week</p>
        </div>
        <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-3">
          <div className="w-7 h-7 rounded-lg bg-violet-400/10 flex items-center justify-center mb-2">
            <MousePointerClick className="w-3.5 h-3.5 text-violet-500" />
          </div>
          <p className="text-[#1E2026] text-xl font-bold">{stats.clicksThisMonth.toLocaleString()}</p>
          <p className="text-[#6B6862] text-[11px] mt-0.5 leading-tight">Clicks this month</p>
        </div>
        <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-3">
          <div className="w-7 h-7 rounded-lg bg-violet-400/10 flex items-center justify-center mb-2">
            <MousePointerClick className="w-3.5 h-3.5 text-violet-500" />
          </div>
          <p className="text-[#1E2026] text-xl font-bold">{stats.allTimeClicks.toLocaleString()}</p>
          <p className="text-[#6B6862] text-[11px] mt-0.5 leading-tight">All-time clicks</p>
        </div>
      </div>

      {/* 7-day bar chart */}
      <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-4">
        <p className="text-[#1E2026] text-xs font-medium mb-4">Daily Visits — Last 7 Days</p>
        <div className="flex items-end gap-1.5" style={{ height: 56 }}>
          {last7.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
              <MiniBar value={d.visits} max={maxVisits} />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 bg-[#1E2026] text-white text-[10px] rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                {d.date.slice(5)}: {d.visits} visit{d.visits !== 1 ? 's' : ''} · {d.clicks} click{d.clicks !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[#6B6862]/50 text-[10px]">{last7[0]?.date.slice(5)}</span>
          <span className="text-[#6B6862]/50 text-[10px]">{last7[last7.length - 1]?.date.slice(5)}</span>
        </div>
        {stats.thisWeek === 0 && (
          <p className="text-center text-[#6B6862] text-xs mt-3 pt-3 border-t border-black/5">
            No visits recorded this week yet — data appears as visitors find your listing.
          </p>
        )}
      </div>
    </div>
  )
}
