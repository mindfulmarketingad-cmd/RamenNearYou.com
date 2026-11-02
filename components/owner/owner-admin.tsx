'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'
import { portalError, rpc, supabase } from '@/lib/owner-portal'
import SignIn from './sign-in'
import { Card, Spinner } from './owner-app'

// David's review queue. The emailed "Approve"/"Reject" links land here as
// ?claim=<id>&action=approve|reject: after sign-in that claim is pinned to
// the top with one confirm button (links alone never change anything, so a
// mail scanner pre-fetching the URL can't approve a claim).

type AdminClaim = {
  id: string; slug: string; name: string | null; city: string | null; contact_name: string | null
  contact_email: string | null; message: string | null; status: string; admin_note: string | null
  created_at: string; website: string | null; path: string | null
}

const TABS = ['pending', 'approved', 'rejected'] as const

export default function OwnerAdmin() {
  const params = useSearchParams()
  const focusId = params.get('claim')
  const action = params.get('action')
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    const sb = supabase()
    sb.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <Spinner />
  if (!session) {
    const path = `/owner/admin${focusId ? `?claim=${encodeURIComponent(focusId)}${action ? `&action=${encodeURIComponent(action)}` : ''}` : ''}`
    return <SignIn redirectPath={path} intro={<p className="mb-4 text-ink-mid">Sign in with your admin email.</p>} />
  }
  return <Queue email={session.user.email ?? ''} focusId={focusId} action={action} />
}

function Queue({ email, focusId, action }: { email: string; focusId: string | null; action: string | null }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>('pending')
  const [rows, setRows] = useState<AdminClaim[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<Record<string, string>>({})

  const load = useCallback(() => {
    setRows(null)
    rpc<AdminClaim[]>('admin_list_claims', { p_status: tab }).then(setRows).catch(e => setError(portalError(e)))
  }, [tab])
  useEffect(load, [load])

  async function review(id: string, approve: boolean) {
    try {
      await rpc('review_claim', { p_id: id, p_approve: approve })
      setDone(d => ({ ...d, [id]: approve ? 'Approved — welcome email sent.' : 'Rejected.' }))
    } catch (e) {
      setDone(d => ({ ...d, [id]: portalError(e) }))
    }
  }

  if (error) return <Card><p className="text-red-600">{error}</p><p className="mt-2 text-sm text-ink-soft">Signed in as {email}. <button className="underline" onClick={() => supabase().auth.signOut()}>Sign out</button></p></Card>

  const sorted = rows ? [...rows].sort((a, b) => (a.id === focusId ? -1 : b.id === focusId ? 1 : 0)) : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${tab === t ? 'bg-brand text-white' : 'bg-surface text-ink-mid border border-line/10'}`}>{t}</button>
        ))}
        <span className="ml-auto text-xs text-ink-soft">{email} · <button className="underline" onClick={() => supabase().auth.signOut()}>Sign out</button></span>
      </div>
      {!sorted && <Spinner />}
      {sorted?.length === 0 && <Card><p className="text-ink-mid">Nothing {tab}.</p></Card>}
      {sorted?.map(c => {
        const focused = c.id === focusId
        return (
          <Card key={c.id}>
            <div className={focused ? 'ring-2 ring-brand/40 rounded-xl p-3 -m-3' : ''}>
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-serif text-xl font-bold text-ink">
                    {c.path ? <Link href={c.path} className="underline" target="_blank">{c.name || c.slug}</Link> : (c.name || c.slug)}
                  </p>
                  <p className="text-sm text-ink-soft">{c.city} · {new Date(c.created_at).toLocaleString()}</p>
                </div>
                {c.admin_note && <p className="text-xs text-ink-soft max-w-xs">{c.admin_note}</p>}
              </div>
              <dl className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <dt className="text-ink-soft">Claimant</dt><dd className="text-ink">{c.contact_name || '—'} &lt;{c.contact_email}&gt;</dd>
                <dt className="text-ink-soft">Listing website</dt><dd className="text-ink break-all">{c.website ? <a href={c.website} target="_blank" rel="noopener noreferrer nofollow" className="underline">{c.website}</a> : '—'}</dd>
                {c.message && <><dt className="text-ink-soft">Message</dt><dd className="text-ink whitespace-pre-wrap">{c.message}</dd></>}
              </dl>
              {tab === 'pending' && (
                done[c.id] ? <p className="mt-4 text-sm font-semibold text-ink">{done[c.id]}</p> : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={() => review(c.id, true)} className={`rounded-xl px-5 py-2.5 font-semibold text-white bg-green-700 hover:bg-green-800 ${focused && action === 'approve' ? 'ring-4 ring-green-300' : ''}`}>Approve</button>
                    <button onClick={() => review(c.id, false)} className={`rounded-xl px-5 py-2.5 font-semibold text-white bg-red-700 hover:bg-red-800 ${focused && action === 'reject' ? 'ring-4 ring-red-300' : ''}`}>Reject</button>
                  </div>
                )
              )}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
