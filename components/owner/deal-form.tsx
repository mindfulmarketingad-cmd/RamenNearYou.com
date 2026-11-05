'use client'

import { useEffect, useState } from 'react'
import { Loader2, Tag } from 'lucide-react'
import { rpc, portalError } from '@/lib/owner-portal'

type Deal = { deal: string; fine_print: string | null; active: boolean; updated_at: string } | null

// Ramen Pass member deal for a claimed listing (owner_deal / save_owner_deal
// in supabase/ramen-pass-membership.sql). Free for owners; members see it on
// the listing page and on their account page.
export default function DealForm({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState(false)
  const [deal, setDeal] = useState('')
  const [fine, setFine] = useState('')
  const [active, setActive] = useState(true)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    rpc<Deal>('owner_deal', { p_slug: slug })
      .then(d => { if (d) { setDeal(d.deal); setFine(d.fine_print ?? ''); setActive(d.active) } })
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [slug])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    try {
      await rpc('save_owner_deal', { p_slug: slug, p_deal: deal, p_fine_print: fine, p_active: active })
      setMsg({ ok: true, text: deal.trim() ? 'Saved — Ramen Pass members can see it now.' : 'Deal removed.' })
    } catch (err) {
      setMsg({ ok: false, text: (err as { message?: string })?.message?.includes('too_long') ? 'Keep the deal under 140 characters.' : portalError(err) })
    } finally { setBusy(false) }
  }

  if (!loaded) return null
  return (
    <form onSubmit={save} className="mt-6 rounded-xl border border-line/10 p-4 space-y-3">
      <p className="flex items-center gap-2 font-semibold text-ink"><Tag className="w-4 h-4 text-brand-ink" /> Ramen Pass member deal <span className="text-xs font-normal text-ink-soft">free</span></p>
      <p className="text-xs text-ink-soft">Offer something to Ramen Pass members — they get a “member deal” badge on your page and find you in their deals list. Leave blank to remove.</p>
      <input value={deal} onChange={e => setDeal(e.target.value)} maxLength={140} placeholder="e.g. Free soft-boiled egg with any bowl"
        className="w-full rounded-xl border border-line/15 bg-page px-3 py-2 text-sm text-ink" />
      <input value={fine} onChange={e => setFine(e.target.value)} maxLength={300} placeholder="Fine print (optional) — e.g. dine-in only, show your Pass"
        className="w-full rounded-xl border border-line/15 bg-page px-3 py-2 text-sm text-ink" />
      <label className="flex items-center gap-2 text-sm text-ink-mid">
        <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} /> Deal is active
      </label>
      <button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hi disabled:opacity-60">
        {busy && <Loader2 className="w-4 h-4 animate-spin" />} Save deal
      </button>
      {msg && <p className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-700'}`}>{msg.text}</p>}
    </form>
  )
}
