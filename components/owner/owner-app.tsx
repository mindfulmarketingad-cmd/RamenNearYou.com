'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'
import { BadgeCheck, Clock, Eye, Loader2, MapPin, Phone, Star, XCircle } from 'lucide-react'
import {
  DAYS, portalError, rpc, supabase,
  type ListingStats, type ListingSub, type OwnerClaim, type PortalListing,
} from '@/lib/owner-portal'
import { BILLBOARD_CHECKOUT_URL, BILLBOARD_PERIOD, BILLBOARD_PRICE } from '@/lib/homepage-billboard'
import { CLAIM_PLAN, listingCheckoutUrl, PAID_TIER_PRICES } from '@/lib/paid-listings'
import { claimMailto, CONTACT_EMAIL } from '@/lib/mailto'
import SignIn from './sign-in'

// The owner portal (/owner). Static page; everything happens in the browser
// against Supabase RPCs that enforce the rules server-side
// (supabase/owner-portal.sql):
//   ?claim=<slug>  → sign in, then pay $49.99/month. Checkout returns to
//                    /owner?session_id=… and listing_claim_session approves it.
//   (no param)     → the owner's dashboard: claims, stats, edit form, upgrades.

type Portal = { ready: boolean; listing: PortalListing | null; claimed: boolean }

export default function OwnerApp() {
  const params = useSearchParams()
  const claimSlug = (params.get('claim') ?? '').trim().toLowerCase()
  const sessionId = params.get('session_id') ?? ''
  const fallbackName = params.get('name') ?? ''
  const fallbackCity = params.get('city') ?? ''
  const fallbackState = params.get('st') ?? ''

  const [session, setSession] = useState<Session | null | undefined>(undefined)
  const [portal, setPortal] = useState<Portal | null | 'offline'>(null)

  useEffect(() => {
    const sb = supabase()
    sb.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    rpc<Portal>('owner_portal_listing', { p_slug: claimSlug })
      .then(setPortal)
      .catch(() => setPortal('offline'))
  }, [claimSlug])

  if (session === undefined || portal === null) return <Spinner />

  const listing = portal !== 'offline' ? portal.listing : null
  const name = listing?.name || fallbackName

  // Portal SQL not installed yet (or the listing isn't in the directory
  // yet): keep the old email claim working instead of a dead end.
  if (portal === 'offline' || (claimSlug && !listing && !session)) {
    return (
      <Card>
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">Claim {name || 'your listing'}</h2>
        <p className="text-ink-mid mb-5">
          Self-serve claiming is being switched on for this listing. In the meantime, send us a quick email and
          we’ll verify you by hand — usually within a day.
        </p>
        <a href={claimMailto(name || claimSlug || 'my restaurant', fallbackCity, fallbackState)} className="inline-block rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hi">
          Email {CONTACT_EMAIL}
        </a>
      </Card>
    )
  }

  const redirectPath = sessionId
    ? `/owner?session_id=${encodeURIComponent(sessionId)}`
    : claimSlug ? `/owner?claim=${encodeURIComponent(claimSlug)}` : '/owner'

  if (!session) {
    return (
      <SignIn
        redirectPath={redirectPath}
        fallbackHref={name ? claimMailto(name, listing?.city ?? fallbackCity, listing?.state_code ?? fallbackState) : undefined}
        intro={
          <div className="mb-5">
            <h2 className="font-serif text-2xl font-bold text-ink">{name ? `Claim ${name}` : 'Owner sign-in'}</h2>
            <p className="mt-1 text-ink-mid text-sm">
              {name
                ? `Sign in with your email, then subscribe for ${CLAIM_PLAN.price}/month. There’s no password to remember.`
                : 'Sign in to manage your RamenNearYou listing.'}
            </p>
          </div>
        }
      />
    )
  }

  return <Dashboard session={session} claimSlug={claimSlug} sessionId={sessionId} listing={listing} claimedByOther={portal.claimed} />
}

function Dashboard({ session, claimSlug, sessionId, listing, claimedByOther }: {
  session: Session; claimSlug: string; sessionId: string; listing: PortalListing | null; claimedByOther: boolean
}) {
  const [claims, setClaims] = useState<OwnerClaim[] | null>(null)
  const [subs, setSubs] = useState<ListingSub[]>([])
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(!!sessionId)

  const load = useCallback(() => {
    rpc<OwnerClaim[]>('my_claims').then(c => setClaims(c ?? [])).catch(e => setError(portalError(e)))
    rpc<ListingSub[]>('my_listing_subscriptions').then(s => setSubs(s ?? [])).catch(() => {})
  }, [])
  useEffect(load, [load])

  useEffect(() => {
    let cancelled = false
    async function confirm() {
      try {
        if (sessionId) {
          const result = await rpc<{ ok?: boolean; claim?: string; product?: string }>('listing_claim_session', { p_session_id: sessionId })
          if (!cancelled) {
            if (result?.claim === 'already_claimed') setNotice('That listing is already claimed by someone else. Use billing below if you need to cancel this charge.')
            else if (result?.product === 'claim') setNotice('You’re verified. Your dashboard is ready.')
            else if (result?.product) setNotice('That upgrade is on.')
          }
        }
        try { await rpc('listing_sync_mine') } catch { /* the session check above is the one that matters */ }
      } catch (err) {
        if (!cancelled && sessionId) setError(portalError(err))
      } finally {
        if (!cancelled) {
          setConfirming(false)
          if (sessionId) window.history.replaceState(null, '', '/owner')
          load()
        }
      }
    }
    void confirm()
    return () => { cancelled = true }
    // sessionId is the checkout return; sync once per mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  const pendingClaim = claimSlug && claims && !claims.some(c => c.slug === claimSlug && c.status !== 'rejected') ? claimSlug : null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">Signed in as <strong className="text-ink">{session.user.email}</strong></p>
        <button onClick={() => supabase().auth.signOut()} className="text-sm text-ink-soft underline">Sign out</button>
      </div>

      {confirming && <Card><p className="text-ink-mid flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Confirming your payment…</p></Card>}
      {notice && <Card><p className="text-green-800">{notice}</p></Card>}
      {error && <Card><p className="text-red-600">{error}</p></Card>}
      {claims === null && !error && <Spinner />}

      {pendingClaim && (
        listing
          ? <ClaimCard listing={listing} email={session.user.email ?? ''} claimedByOther={claimedByOther} />
          : <Card><p className="text-ink-mid">We couldn’t find that listing. <Link className="underline" href="/claim-your-listing">Search for your restaurant</Link>.</p></Card>
      )}

      {claims?.map(c => <ClaimPanel key={c.id} claim={c} subs={subs.filter(s => s.slug === c.slug)} email={session.user.email ?? ''} onSaved={load} />)}

      {claims && claims.length === 0 && !pendingClaim && (
        <Card>
          <h2 className="font-serif text-xl font-bold text-ink mb-1">No listings yet</h2>
          <p className="text-ink-mid">Find your restaurant and press <strong>Claim</strong> to get started.</p>
          <Link href="/claim-your-listing" className="mt-4 inline-block rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hi">Find my restaurant</Link>
        </Card>
      )}
    </div>
  )
}

function ClaimCard({ listing, email, claimedByOther }: {
  listing: PortalListing; email: string; claimedByOther: boolean
}) {
  const pay = listingCheckoutUrl('claim', listing.slug, email)
  return (
    <Card>
      <h2 className="font-serif text-2xl font-bold text-ink">Claim {listing.name}</h2>
      <p className="text-sm text-ink-soft mb-4 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{[listing.city, listing.state_code].filter(Boolean).join(', ')}</p>
      {claimedByOther ? (
        <p className="text-ink-mid">This listing has already been claimed. If you’re the owner and that’s news to you, reply to any RamenNearYou email or write to {CONTACT_EMAIL}.</p>
      ) : (
        <div className="space-y-3">
          <p className="text-ink-mid">
            <strong className="text-ink">{CLAIM_PLAN.price}/{CLAIM_PLAN.period}</strong>. You get the verified badge, an ad-free listing page, and this dashboard — edits plus views, calls, directions and review taps.
          </p>
          <p className="text-xs text-ink-soft">
            Checkout uses <strong>{email}</strong>. Keep that email on the payment page so the claim attaches to this account. You’re verified as soon as payment clears — nothing to wait on.
          </p>
          <a href={pay} className="inline-block rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hi">
            Subscribe and claim — {CLAIM_PLAN.price}/mo
          </a>
        </div>
      )}
    </Card>
  )
}

function ClaimPanel({ claim, subs, email, onSaved }: { claim: OwnerClaim; subs: ListingSub[]; email: string; onSaved: () => void }) {
  const where = [claim.city, claim.state_code].filter(Boolean).join(', ')
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">{claim.name}</h2>
          {where && <p className="text-sm text-ink-soft">{where}</p>}
        </div>
        <StatusChip status={claim.status} />
      </div>

      {claim.status === 'pending' && (
        <div className="space-y-3">
          <p className="text-ink-mid">
            This claim isn’t verified yet. Subscribe at {CLAIM_PLAN.price}/month and it will be verified as soon as payment clears.
          </p>
          <a href={listingCheckoutUrl('claim', claim.slug, email)} className="inline-block rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hi">
            Subscribe and verify — {CLAIM_PLAN.price}/mo
          </a>
        </div>
      )}
      {claim.status === 'rejected' && (
        <p className="text-ink-mid">
          We couldn’t verify this claim. If you are the owner, email {CONTACT_EMAIL} from your restaurant’s address, or
          from any address with a photo of a menu or receipt showing the business name, and we’ll take another look.
        </p>
      )}
      {claim.status === 'approved' && (
        <div className="space-y-8">
          {claim.path && <Link href={claim.path} className="text-sm font-semibold text-brand-ink underline">View your public listing →</Link>}
          <Stats slug={claim.slug} />
          <EditForm claim={claim} onSaved={onSaved} />
          <Upgrades slug={claim.slug} email={email} subs={subs} />
        </div>
      )}
    </Card>
  )
}

function Stats({ slug }: { slug: string }) {
  const [s, setS] = useState<ListingStats | null>(null)
  const [err, setErr] = useState(false)
  useEffect(() => { rpc<ListingStats>('owner_listing_stats', { p_slug: slug }).then(setS).catch(() => setErr(true)) }, [slug])
  if (err) return null
  const trend = s && s.views_prev_30d > 0 ? Math.round(((s.views_30d - s.views_prev_30d) / s.views_prev_30d) * 100) : null
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft mb-3">Last 30 days</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={Eye} label="Page views" value={s?.views_30d} hint={trend === null ? undefined : `${trend >= 0 ? '+' : ''}${trend}% vs prior 30 days`} />
        <Stat icon={Phone} label="Call taps" value={s?.calls_30d} />
        <Stat icon={MapPin} label="Directions" value={s?.directions_30d} />
        <Stat icon={Star} label="Review clicks" value={s?.reviews_30d} />
      </div>
      {s && <p className="mt-2 text-xs text-ink-soft">{s.views_all.toLocaleString()} page views all-time.</p>}
    </section>
  )
}

function Stat({ icon: Icon, label, value, hint }: { icon: typeof Eye; label: string; value?: number; hint?: string }) {
  return (
    <div className="rounded-xl border border-line/8 bg-sunken p-4">
      <p className="flex items-center gap-1.5 text-xs text-ink-soft"><Icon className="w-3.5 h-3.5" />{label}</p>
      <p className="font-serif text-2xl font-bold text-ink">{value === undefined ? '…' : value.toLocaleString()}</p>
      {hint && <p className="text-[11px] text-ink-soft">{hint}</p>}
    </div>
  )
}

function EditForm({ claim, onSaved }: { claim: OwnerClaim; onSaved: () => void }) {
  const l = claim.listing
  const [description, setDescription] = useState(l.description ?? '')
  const [phone, setPhone] = useState(l.phone ?? '')
  const [website, setWebsite] = useState(l.website ?? '')
  const [menuLink, setMenuLink] = useState(l.menu_link ?? '')
  const [hours, setHours] = useState<Record<string, string>>(
    Object.fromEntries(DAYS.map(d => [d, (l.hours?.[d] ?? []).join(', ')])),
  )
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const h: Record<string, string[]> = {}
    for (const d of DAYS) {
      const parts = (hours[d] ?? '').split(',').map(s => s.trim()).filter(Boolean)
      if (parts.length) h[d] = parts
    }
    try {
      await rpc('save_listing_override', {
        p_slug: claim.slug,
        p_description: description,
        p_phone: phone,
        p_website: website,
        p_menu_link: menuLink,
        p_hours: Object.keys(h).length ? h : null,
      })
      setMsg({ ok: true, text: 'Saved! Your changes go live with the next daily site update.' })
      onSaved()
    } catch (err) {
      setMsg({ ok: false, text: portalError(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft mb-1">Edit your listing</h3>
      <p className="text-xs text-ink-soft mb-4">
        Leave a field blank to keep what’s on the site now. Changes appear with the next daily site update.
        {claim.edited_at && <> Last saved {new Date(claim.edited_at).toLocaleString()}.</>}
      </p>
      <form onSubmit={save} className="space-y-4">
        <Field label="Description">
          <textarea value={description} onChange={e => setDescription(e.target.value)} maxLength={1500} rows={4} className={input} placeholder="What makes your ramen special?" />
        </Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Phone"><input value={phone} onChange={e => setPhone(e.target.value)} maxLength={40} className={input} placeholder="(555) 123-4567" /></Field>
          <Field label="Website"><input value={website} onChange={e => setWebsite(e.target.value)} maxLength={300} className={input} placeholder="https://" /></Field>
          <Field label="Menu link"><input value={menuLink} onChange={e => setMenuLink(e.target.value)} maxLength={300} className={input} placeholder="https://" /></Field>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold text-ink mb-2">Hours <span className="font-normal text-ink-soft">(e.g. “11:30 AM – 3 PM, 5 – 9 PM”, or “Closed”)</span></legend>
          <div className="grid sm:grid-cols-2 gap-2">
            {DAYS.map(d => (
              <label key={d} className="flex items-center gap-2 text-sm">
                <span className="w-24 text-ink-mid">{d}</span>
                <input value={hours[d]} onChange={e => setHours(h => ({ ...h, [d]: e.target.value }))} maxLength={90} className={`${input} py-2`} />
              </label>
            ))}
          </div>
        </fieldset>
        <p className="text-xs text-ink-soft">New photos? Email them to {CONTACT_EMAIL} and we’ll add them.</p>
        <button disabled={busy} className="rounded-xl bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-hi disabled:opacity-60">
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        {msg && <p className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`} role="status">{msg.text}</p>}
      </form>
    </section>
  )
}

function Upgrades({ slug, email, subs }: { slug: string; email: string; subs: ListingSub[] }) {
  const [billing, setBilling] = useState<string | null>(null)
  const live = (product: ListingSub['product']) => subs.find(s => s.product === product && s.live)
  const tiers = [
    { key: 'featured' as const, name: 'Featured', perks: 'Top of your city page, gold map pin, Featured badge.' },
    { key: 'premium' as const, name: 'Premium', perks: 'Everything in Featured, plus the top of your state page and a spot in your city’s ramen guide.' },
  ]
  async function portal() {
    try {
      const url = await rpc<string>('listing_portal_url')
      if (url) window.location.href = url
    } catch (err) {
      setBilling(portalError(err))
    }
  }
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-soft mb-3">Get in front of more diners</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {tiers.map(t => {
          const p = PAID_TIER_PRICES[t.key]
          const on = !!live(t.key) || (t.key === 'featured' && !!live('premium'))
          return (
            <div key={t.key} className="rounded-xl border border-line/8 p-4 flex flex-col">
              <p className="font-semibold text-ink">{t.name} <span className="text-ink-soft font-normal">· {p.price}/{p.period}</span></p>
              <p className="text-xs text-ink-soft">{p.withClaim}/month with your claim</p>
              <p className="text-sm text-ink-mid flex-1 mt-1">{t.perks}</p>
              {on ? (
                <p className="mt-3 text-sm font-semibold text-green-800">On</p>
              ) : (
                <a href={listingCheckoutUrl(t.key, slug, email)} className="mt-3 block text-center rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-hi">Add {t.name}</a>
              )}
            </div>
          )
        })}
      </div>
      <p className="mt-3 text-sm text-ink-mid">
        Homepage billboard <span className="text-ink-soft">· {BILLBOARD_PRICE}/{BILLBOARD_PERIOD}</span>
        {live('billboard') ? <span className="ml-2 font-semibold text-green-800">On</span> : (
          <a href={listingCheckoutUrl('billboard', slug, email) || BILLBOARD_CHECKOUT_URL} className="ml-2 font-semibold text-brand-ink underline">Add the billboard</a>
        )}
      </p>
      <button type="button" onClick={() => void portal()} className="mt-3 text-sm text-ink-soft underline">Manage billing or cancel</button>
      {billing && <p className="mt-1 text-sm text-red-600">{billing}</p>}
      <p className="mt-2 text-xs text-ink-soft">Featured and Premium turn on as soon as checkout finishes. Stripe emails receipts and renewal notices.</p>
    </section>
  )
}

function StatusChip({ status }: { status: OwnerClaim['status'] }) {
  if (status === 'approved') return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800"><BadgeCheck className="w-3.5 h-3.5" />Verified owner</span>
  if (status === 'pending') return <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"><Clock className="w-3.5 h-3.5" />Under review</span>
  return <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800"><XCircle className="w-3.5 h-3.5" />Not approved</span>
}

const input = 'w-full rounded-xl border border-line/15 bg-page px-3 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-brand/40'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-sm font-semibold text-ink mb-1">{label}</span>{children}</label>
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="bg-surface border border-line/8 rounded-2xl p-6 sm:p-8">{children}</div>
}

export function Spinner() {
  return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-ink-soft" /></div>
}
