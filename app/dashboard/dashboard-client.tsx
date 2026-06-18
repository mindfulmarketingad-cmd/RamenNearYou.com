'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Copy, Check, Trophy, ExternalLink } from 'lucide-react'
import {
  CONTRIBUTION_LABELS,
  RANK_TIERS,
  type ContributionType,
  type RamenRank,
} from '@/lib/ramen-pass'

interface DashboardData {
  subscription: { status: string; isActive: boolean; periodEnd: string | null }
  credits: { earned: number; cap: number; capReached: boolean }
  rank: { current: RamenRank; contributions: number }
  referralCode: string | null
  rewards: {
    id: string
    type: string
    amount: number
    status: string
    billing_period: string
    created_at: string
  }[]
}

function nextRankInfo(contributions: number) {
  const next = RANK_TIERS.find(t => t.min > contributions)
  if (!next) return null
  const prev = [...RANK_TIERS].reverse().find(t => t.min <= contributions) ?? RANK_TIERS[0]
  const span = next.min - prev.min
  const progress = span > 0 ? Math.min(100, ((contributions - prev.min) / span) * 100) : 100
  return { next, remaining: next.min - contributions, progress }
}

export default function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/ramen-pass/me')
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[#B57F50]" />
      </div>
    )
  }

  if (!data || !data.subscription) {
    return <p className="text-[#6B6862]">Couldn&apos;t load your dashboard. Please try again.</p>
  }

  const { subscription, credits, rank, referralCode, rewards } = data

  // Not a member yet — invite to join.
  if (!subscription.isActive && subscription.status === 'none') {
    return (
      <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-3">Join Ramen Pass</h1>
        <p className="text-[#6B6862] mb-6 max-w-md mx-auto">
          You don&apos;t have an active Ramen Pass yet. Subscribe to start earning credit back on
          every review, photo, and check-in.
        </p>
        <Link
          href="/ramen-pass"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white font-bold transition-colors"
        >
          Learn about Ramen Pass
        </Link>
      </div>
    )
  }

  const creditPct = Math.min(100, (credits.earned / credits.cap) * 100)
  const referralLink =
    referralCode && typeof window !== 'undefined'
      ? `${window.location.origin}/join?ref=${referralCode}`
      : ''
  const rankNext = nextRankInfo(rank.contributions)

  const statusStyle =
    subscription.status === 'active' || subscription.status === 'trialing'
      ? 'bg-emerald-50 text-emerald-600'
      : subscription.status === 'past_due'
      ? 'bg-amber-50 text-amber-600'
      : 'bg-red-50 text-red-600'

  return (
    <div className="space-y-6">
      {/* Header + status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-bold text-[#1E2026]">Your Ramen Pass</h1>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle}`}>
          {subscription.status === 'none' ? 'Inactive' : subscription.status.replace('_', ' ')}
        </span>
      </div>

      {/* Credits this month */}
      <div className="bg-white rounded-2xl border border-black/5 p-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[#6B6862] text-sm">Credit earned this month</p>
            <p className="font-serif text-3xl font-bold text-[#1E2026]">
              ${credits.earned.toFixed(2)}
              <span className="text-[#9B9490] text-lg font-sans font-normal"> / ${credits.cap.toFixed(2)}</span>
            </p>
          </div>
          {subscription.periodEnd && (
            <p className="text-[#9B9490] text-xs text-right">
              Next bill<br />
              {new Date(subscription.periodEnd).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="h-2.5 rounded-full bg-[#F5F4F0] overflow-hidden">
          <div className="h-full rounded-full bg-[#B57F50] transition-all" style={{ width: `${creditPct}%` }} />
        </div>
        {credits.capReached && (
          <p className="text-emerald-600 text-xs font-semibold mt-2">
            You&apos;ve maxed your credits this month — applied to your next bill 🎉
          </p>
        )}
      </div>

      {/* Rank */}
      <div className="bg-white rounded-2xl border border-black/5 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-[#B57F50]/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[#B57F50]" />
          </div>
          <div>
            <p className="text-[#6B6862] text-sm">Your rank</p>
            <p className="font-bold text-[#1E2026]">{rank.current}</p>
          </div>
          <p className="ml-auto text-[#9B9490] text-sm">{rank.contributions} contributions</p>
        </div>
        {rankNext ? (
          <>
            <div className="h-2 rounded-full bg-[#F5F4F0] overflow-hidden">
              <div className="h-full rounded-full bg-[#1E2026] transition-all" style={{ width: `${rankNext.progress}%` }} />
            </div>
            <p className="text-[#9B9490] text-xs mt-2">
              {rankNext.remaining} more to reach <strong>{rankNext.next.rank}</strong>
            </p>
          </>
        ) : (
          <p className="text-[#B57F50] text-xs font-semibold">You&apos;ve reached the top rank — Ramen Master 🏆</p>
        )}
      </div>

      {/* Referral */}
      {referralCode && (
        <div className="bg-white rounded-2xl border border-black/5 p-6">
          <p className="font-semibold text-[#1E2026] text-sm mb-1">Refer a friend, earn $2.00</p>
          <p className="text-[#9B9490] text-xs mb-3">
            You earn credit when a friend joins with your link and makes their first payment.
          </p>
          <div className="flex items-center gap-2">
            <input
              readOnly
              value={referralLink}
              className="flex-1 px-3 py-2 rounded-lg border border-black/10 bg-[#F5F4F0] text-[#1E2026] text-xs"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-none bg-[#1E2026] text-white text-xs font-semibold shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Contribution history */}
      <div className="bg-white rounded-2xl border border-black/5 p-6">
        <p className="font-semibold text-[#1E2026] text-sm mb-4">Contribution history</p>
        {rewards.length === 0 ? (
          <p className="text-[#9B9490] text-sm">No contributions yet. Leave a review to start earning!</p>
        ) : (
          <div className="divide-y divide-black/5">
            {rewards.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-[#1E2026] text-sm font-medium">
                    {CONTRIBUTION_LABELS[r.type as ContributionType] ?? r.type}
                  </p>
                  <p className="text-[#9B9490] text-xs">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                      r.status === 'rejected'
                        ? 'bg-red-50 text-red-600'
                        : r.status === 'pending'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="font-bold text-[#B57F50] text-sm w-14 text-right">
                    +${Number(r.amount).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manage subscription */}
      <div className="text-center pt-2">
        <a
          href="/api/ramen-pass/portal"
          className="inline-flex items-center gap-1.5 text-[#6B6862] hover:text-[#1E2026] text-sm font-medium transition-colors"
        >
          Manage subscription <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  )
}
