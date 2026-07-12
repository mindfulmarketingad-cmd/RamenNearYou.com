'use client'

import { useEffect, useState } from 'react'
import { Eye, MousePointerClick, TrendingUp, Calendar, BarChart3, Crown } from 'lucide-react'

type DailyRow = { date: string; views: number; clicks: number }

type Stats = {
  totalViews: number
  totalClicks: number
  ctr: string
  avgDailyViews: string
  viewsThisWeek: number
  clicksThisWeek: number
  daily: DailyRow[]
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex-1 flex flex-col justify-end" style={{ height: 60 }}>
      <div
        className="w-full rounded-t-sm transition-all duration-300"
        style={{ height: `${Math.max(pct, value > 0 ? 4 : 0)}%`, backgroundColor: color, minHeight: value > 0 ? 3 : 0 }}
      />
    </div>
  )
}

export default function StatsChart({ listingId, restaurantName }: { listingId: string; restaurantName: string }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/featured/analytics?listing_id=${listingId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(true); return }
        setStats(data)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [listingId])

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-24 bg-black/5 rounded-xl" />
        <div className="h-48 bg-black/5 rounded-xl" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="p-6 rounded-xl bg-[#F5F4F0] border border-black/8 text-center text-[#6B6862] text-sm">
        Could not load analytics. Make sure the <code className="text-xs bg-black/8 px-1 rounded">listing_analytics</code> table exists in Supabase.
      </div>
    )
  }

  const last14 = stats.daily.slice(-14)
  const maxViews = Math.max(...last14.map(d => d.views), 1)

  const statCards = [
    {
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'text-[#96602F]',
      bg: 'bg-[#B57F50]/10',
    },
    {
      label: 'Total Clicks',
      value: stats.totalClicks.toLocaleString(),
      icon: MousePointerClick,
      color: 'text-sky-400',
      bg: 'bg-sky-400/10',
    },
    {
      label: 'Avg Daily Views',
      value: stats.avgDailyViews,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Click-Through Rate',
      value: `${stats.ctr}%`,
      icon: BarChart3,
      color: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
    {
      label: 'Views This Week',
      value: stats.viewsThisWeek.toLocaleString(),
      icon: Calendar,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Clicks This Week',
      value: stats.clicksThisWeek.toLocaleString(),
      icon: MousePointerClick,
      color: 'text-pink-400',
      bg: 'bg-pink-400/10',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Listing header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#B57F50]/15 flex items-center justify-center shrink-0">
          <Crown className="w-4 h-4 text-[#96602F]" />
        </div>
        <div>
          <p className="text-[#1E2026] font-semibold">{restaurantName}</p>
          <p className="text-[#6B6862] text-xs">Featured listing · analytics</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[#F5F4F0] border border-black/5 rounded-xl p-4">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-[#1E2026] text-2xl font-bold">{value}</p>
            <p className="text-[#6B6862] text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* 14-day view bar chart */}
      <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-5">
        <p className="text-[#1E2026] text-sm font-semibold mb-1">Daily Views — Last 14 Days</p>
        <p className="text-[#6B6862] text-xs mb-5">Each bar = one day</p>
        <div className="flex items-end gap-1" style={{ height: 60 }}>
          {last14.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
              <MiniBar value={d.views} max={maxViews} color="#B57F50" />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 bg-[#1E2026] text-white text-[10px] rounded px-2 py-1 whitespace-nowrap pointer-events-none">
                {d.date.slice(5)}: {d.views}v {d.clicks}c
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[#6B6862]/50 text-[10px]">{last14[0]?.date.slice(5)}</span>
          <span className="text-[#6B6862]/50 text-[10px]">{last14[last14.length - 1]?.date.slice(5)}</span>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-black/5">
          <span className="flex items-center gap-1.5 text-xs text-[#6B6862]">
            <span className="inline-block w-3 h-2 rounded-sm bg-[#B57F50]" /> Views
          </span>
        </div>
      </div>

      {stats.totalViews === 0 && (
        <div className="text-center py-4 text-[#6B6862] text-sm">
          No views recorded yet — data will appear once visitors see your featured listing.
        </div>
      )}
    </div>
  )
}
