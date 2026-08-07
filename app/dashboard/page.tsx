import Link from 'next/link'
import { Users, UserCheck, PhoneCall, Search as SearchIcon, Eye, Inbox } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getDashboardData, type RangeDays } from '@/lib/dashboard-data'
import { ActionBreakdownChart, DailyTrendChart } from './charts'
import LiveActivity from './live-activity'

// Always render fresh — a dashboard showing cached numbers next to a live
// feed would contradict itself.
export const dynamic = 'force-dynamic'

const RANGES: RangeDays[] = [7, 30, 90]

function parseRange(v: string | undefined): RangeDays {
  const n = Number(v)
  return (RANGES as number[]).includes(n) ? (n as RangeDays) : 30
}

function StatCard({
  icon: Icon, label, value, hint,
}: {
  icon: typeof Users; label: string; value: string; hint?: string
}) {
  return (
    <div className="bg-white border border-black/8 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#96602F]" />
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6862]">{label}</p>
      </div>
      <p className="font-serif text-3xl font-bold text-[#1E2026]">{value}</p>
      {hint && <p className="text-xs text-[#6B6862] mt-1">{hint}</p>}
    </div>
  )
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>
}) {
  const { range } = await searchParams
  const days = parseRange(range)
  const d = await getDashboardData(days)
  const n = (v: number) => v.toLocaleString()

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-2">Site Analytics</p>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">
              RamenNearYou Traffic &amp; Leads
            </h1>
            <p className="text-[#6B6862] text-sm max-w-2xl">
              Live, public analytics for this directory — how many people are browsing, what they search
              for, and which restaurants they actually try to reach.
            </p>
          </div>

          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-white border border-black/10 shrink-0">
            {RANGES.map(r => (
              <Link
                key={r}
                href={`/dashboard?range=${r}`}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  r === days ? 'bg-[#B57F50] text-white' : 'text-[#6B6862] hover:text-[#1E2026]'
                }`}
              >
                {r} days
              </Link>
            ))}
          </div>
        </div>

        {!d.ok && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
            Analytics storage isn&apos;t reachable right now, so the totals below read zero. Run
            <code className="mx-1 font-mono text-xs">supabase/ramennearyou_dashboard.sql</code>
            and confirm <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> is set.
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          <StatCard icon={Users} label="Sessions" value={n(d.sessions)} hint={`Last ${days} days`} />
          <StatCard icon={UserCheck} label="Unique Visitors" value={n(d.visitors)} hint="Distinct browsers" />
          <StatCard icon={PhoneCall} label="Lead Actions" value={n(d.leadActions)} hint="Calls, directions, reviews" />
          <StatCard icon={SearchIcon} label="Searches" value={n(d.searches)} hint="On-site queries" />
          <StatCard icon={Eye} label="Impressions" value={n(d.impressions)} hint="Pages + listings viewed" />
          {d.leadsReceived !== null && (
            <StatCard
              icon={Inbox}
              label="Leads Received"
              value={n(d.leadsReceived)}
              hint="Submitted inquiry forms"
            />
          )}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white border border-black/8 rounded-2xl p-5">
            <h2 className="font-serif text-lg font-bold text-[#1E2026] mb-4">Action Breakdown</h2>
            <ActionBreakdownChart data={d.actionBreakdown} />
          </div>
          <div className="bg-white border border-black/8 rounded-2xl p-5">
            <h2 className="font-serif text-lg font-bold text-[#1E2026] mb-4">Daily Trend</h2>
            <DailyTrendChart data={d.daily} />
          </div>
        </div>

        {/* Live feed */}
        <div className="mb-4">
          <LiveActivity />
        </div>

        {/* Per-business breakdown */}
        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-black/8">
            <h2 className="font-serif text-lg font-bold text-[#1E2026]">Per-Business Breakdown</h2>
            <p className="text-xs text-[#6B6862] mt-0.5">
              {d.businesses.length === 0
                ? 'No per-business activity recorded yet.'
                : `${n(d.businesses.length)} businesses with activity in the last ${days} days.`}
            </p>
          </div>
          {d.businesses.length > 0 && (
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#FAFAF9] border-b border-black/8 z-10">
                  <tr className="text-left text-[11px] uppercase tracking-widest text-[#6B6862]">
                    <th className="px-5 py-3 font-semibold">Business</th>
                    <th className="px-3 py-3 font-semibold">City</th>
                    <th className="px-3 py-3 font-semibold text-right">Directions</th>
                    <th className="px-3 py-3 font-semibold text-right">Phone</th>
                    <th className="px-3 py-3 font-semibold text-right">Reviews</th>
                    <th className="px-3 py-3 font-semibold text-right">Lead Actions</th>
                    <th className="px-3 py-3 font-semibold text-right">Views</th>
                    <th className="px-5 py-3 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {d.businesses.map(b => (
                    <tr key={b.slug} className="hover:bg-[#FAFAF9]">
                      <td className="px-5 py-3 font-semibold text-[#1E2026]">{b.name}</td>
                      <td className="px-3 py-3 text-[#6B6862]">{b.city}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{n(b.directions)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{n(b.calls)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{n(b.reviews)}</td>
                      <td className="px-3 py-3 text-right tabular-nums font-semibold text-emerald-600">{n(b.leadActions)}</td>
                      <td className="px-3 py-3 text-right tabular-nums">{n(b.views)}</td>
                      <td className="px-5 py-3 text-right tabular-nums font-bold text-[#1E2026]">{n(b.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top searches */}
        {d.topSearches.length > 0 && (
          <div className="bg-white border border-black/8 rounded-2xl p-5">
            <h2 className="font-serif text-lg font-bold text-[#1E2026] mb-3">Top Searches</h2>
            <div className="flex flex-wrap gap-2">
              {d.topSearches.map(s => (
                <span
                  key={s.query}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F4F0] border border-black/8 text-xs text-[#1E2026]"
                >
                  {s.query}
                  <span className="text-[#6B6862]">{s.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
