import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Minus, Crown } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { jsonLdString } from '@/lib/json-ld'
import { PASS_PRICES, FREE_SAVE_LIMIT } from '@/lib/ramen-pass-config'

export const metadata: Metadata = {
  title: 'Ramen Pass — Unlimited Saves, Every Filter & Member Deals | Ramen Near You',
  description: `Free account: ${FREE_SAVE_LIMIT} saves, check-ins and badges. Ramen Pass (${PASS_PRICES.monthly.label}/mo or ${PASS_PRICES.yearly.label}/yr): unlimited saves, broth/vegan/open-late filters, trip lists, member deals and ad-free browsing. Cancel anytime.`,
  alternates: { canonical: 'https://www.ramennearyou.com/ramen-pass' },
}

const ROWS: { label: string; free: boolean | string; pass: boolean | string }[] = [
  { label: 'Browse every ramen shop, map & guide', free: true, pass: true },
  { label: 'Saved spots', free: `${FREE_SAVE_LIMIT}`, pass: 'Unlimited' },
  { label: 'Check-ins & passport badges', free: true, pass: true },
  { label: 'Your ramen stats map (cities & states)', free: false, pass: true },
  { label: 'Filters: broth style, vegan & gluten-free, open now / late, extra spicy', free: false, pass: true },
  { label: 'Custom lists & trip planner', free: false, pass: true },
  { label: 'Member deals at owner-run shops', free: false, pass: true },
  { label: 'Ad-free browsing', free: false, pass: true },
  { label: 'Monthly “new ramen near you” email', free: false, pass: true },
]

const FAQ = [
  { q: 'When am I charged?', a: 'You’re charged when you subscribe — monthly or yearly. Cancel anytime from your account; your Pass stays active until the end of the period you paid for.' },
  { q: 'How do I cancel?', a: 'Account → “Manage billing or cancel”. It opens Stripe’s billing page; your Pass stays active until the end of the period you paid for.' },
  { q: 'What are member deals?', a: 'Restaurants that claim their listing can offer Ramen Pass members a perk — a free topping, a discount, a secret menu bowl. They show on the shop’s page and in your account.' },
  { q: 'Do I need a password?', a: 'No. Sign in with a one-time email code or link, or with Google.' },
  { q: 'Does the Pass change your rankings?', a: 'No. Rankings and reviews are independent; paid listings are always labelled.' },
]

const cell = (v: boolean | string) =>
  v === true ? <Check className="w-5 h-5 text-brand-ink mx-auto" aria-label="Included" />
    : v === false ? <Minus className="w-5 h-5 text-ink-soft mx-auto" aria-label="Not included" />
    : <span className="font-semibold text-ink">{v}</span>

export default function RamenPassPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  }
  return (
    <main className="min-h-screen bg-surface">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faqLd) }} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-4">
            <Crown className="w-3.5 h-3.5 text-brand-ink" />
            <span className="text-brand-ink text-xs font-medium uppercase tracking-widest">Ramen Pass</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink mb-4">Find your next great bowl, faster</h1>
          <p className="text-ink-soft leading-relaxed max-w-2xl mx-auto">
            Start with a free account. Upgrade to the Ramen Pass for every filter, unlimited saves, trip lists,
            member deals and no ads — and help keep an independent ramen directory running.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-2xl border border-line/10 p-6">
            <p className="font-semibold text-ink">Free account</p>
            <p className="text-3xl font-bold text-ink mt-2">$0</p>
            <p className="text-sm text-ink-soft mt-1">{FREE_SAVE_LIMIT} saves, check-ins & badges</p>
            <Link href="/account" className="mt-5 block text-center rounded-xl border border-line/15 px-4 py-3 font-semibold text-ink hover:bg-sunken">Create free account</Link>
          </div>
          <div className="rounded-2xl border border-line/10 p-6">
            <p className="font-semibold text-ink">Ramen Pass · Monthly</p>
            <p className="text-3xl font-bold text-ink mt-2">{PASS_PRICES.monthly.label}<span className="text-base font-normal text-ink-soft">/month</span></p>
            <p className="text-sm text-ink-soft mt-1">Cancel anytime</p>
            <Link href="/account?plan=monthly" className="mt-5 block text-center rounded-xl border border-brand px-4 py-3 font-semibold text-brand-ink hover:bg-brand/5">Get Ramen Pass</Link>
          </div>
          <div className="rounded-2xl border-2 border-brand p-6 relative">
            <span className="absolute -top-3 left-6 bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">Save 35%</span>
            <p className="font-semibold text-ink">Ramen Pass · Yearly</p>
            <p className="text-3xl font-bold text-ink mt-2">{PASS_PRICES.yearly.label}<span className="text-base font-normal text-ink-soft">/year</span></p>
            <p className="text-sm text-ink-soft mt-1">$3.25/mo · cancel anytime</p>
            <Link href="/account?plan=yearly" className="mt-5 block text-center rounded-xl bg-brand px-4 py-3 font-semibold text-white hover:bg-brand-hi">Get Ramen Pass</Link>
          </div>
        </div>

        <div className="overflow-x-auto mb-14">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line/10">
                <th className="text-left py-3 pr-4 font-semibold text-ink">What you get</th>
                <th className="py-3 px-4 font-semibold text-ink w-28">Free</th>
                <th className="py-3 px-4 font-semibold text-brand-ink w-28">Ramen Pass</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(r => (
                <tr key={r.label} className="border-b border-line/6">
                  <td className="py-3 pr-4 text-ink-mid">{r.label}</td>
                  <td className="py-3 px-4 text-center">{cell(r.free)}</td>
                  <td className="py-3 px-4 text-center">{cell(r.pass)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="font-serif text-2xl font-bold text-ink mb-4">Questions</h2>
        <div className="space-y-4 mb-12">
          {FAQ.map(f => (
            <div key={f.q}>
              <h3 className="font-semibold text-ink">{f.q}</h3>
              <p className="text-ink-mid text-sm mt-1">{f.a}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-ink-soft">
          Own a ramen shop? <Link href="/owner" className="underline">Claim your listing</Link> to post a member deal for free.
          Payments are processed securely by Stripe.
        </p>
      </div>
      <Footer />
    </main>
  )
}
