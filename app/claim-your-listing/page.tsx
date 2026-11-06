import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CheckCircle2, Zap, ShieldCheck, Crown, BarChart3 } from 'lucide-react'
import ListingPlans from '@/components/listing-plans'
import Link from 'next/link'
import ClaimSearch from './claim-search'
import RecentlyClaimed from './recently-claimed'

export const metadata = {
  title: 'Claim Your Ramen Restaurant Listing | Ramen Near You',
  description: 'Claim your restaurant on RamenNearYou for $49.99/month. Verified badge, owner dashboard, listing analytics, and edits. Add Featured ($29/mo) or Premium ($79/mo) from the dashboard.',
  alternates: { canonical: 'https://www.ramennearyou.com/claim-your-listing' },
}

const BENEFITS = [
  'Verified badge on your listing and the ramen search map',
  'Your own owner dashboard: edit hours, phone, menu link, and description, and see your page views and call taps',
  'An ad-free listing page — nothing competing for your customers',
  'You control what diners see — your listing, your details',
]

const STEPS = [
  { title: 'Search your restaurant', text: 'Type your name and tap it from the list.' },
  { title: 'Sign in with your email', text: 'We email you a sign-in link — no password. Use your restaurant\'s email address if you have one.' },
  { title: 'Subscribe', text: 'Pay $49.99/month at checkout. You\'re verified as soon as payment clears, and we email you a link to your dashboard.' },
]

// The questions owners actually ask before paying. Answers stay factual —
// for "does this get traffic" we point at the public /dashboard instead of
// quoting a number we'd have to keep in sync.
const CLAIM_FAQS = [
  {
    q: 'Does this site actually get traffic?',
    a: 'Yes — and you don\'t have to take our word for it. Our traffic numbers are public and live at /dashboard: sessions, unique visitors, searches, and how many people tapped call, directions, or reviews on a listing. Check it before you claim.',
  },
  {
    q: 'How long does verification take?',
    a: 'Right after checkout. You sign in, pay $49.99/month, and the listing is verified on the spot. We email you a link to the owner dashboard. Edits to hours and description show up with the next daily site update; the verified badge is live immediately.',
  },
  {
    q: 'What if my restaurant isn\'t in the search?',
    a: 'Use the contact page and tell us your restaurant name and address — we\'ll add it to the directory so you can claim it.',
  },
  {
    q: 'Is Featured placement included?',
    a: 'No. Claiming is $49.99/month and includes the verified badge, dashboard, analytics and an ad-free listing page. Featured is a $29/month add-on ($78.99 total) that puts your restaurant first on its city page, labelled Featured, with a gold map pin. Premium is a $79/month add-on ($128.99 total) and also adds your state page and your city\'s blog ramen guide. The homepage billboard ($99/month) is a separate add-on. All are monthly and cancel anytime.',
  },
  {
    q: 'What happens if I don\'t claim my listing?',
    a: 'Your listing stays up, but it shows whatever public data we have — which may be wrong hours, an old photo, or a missing menu. Claiming is the only way to control what diners see.',
  },
]

export default function ClaimYourListingPage() {
  return (
    <main className="min-h-screen bg-sunken">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Compact, enticing header — the search form is the first thing on screen */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 mb-3">
            <span className="text-brand-ink text-xs font-medium uppercase tracking-widest">For Restaurant Owners</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-2">
            Claim Your Restaurant
          </h1>
          <p className="text-ink-soft text-sm leading-relaxed max-w-md mx-auto">
            Thousands of diners use RamenNearYou to decide where to eat tonight.
            Put <strong className="text-ink">your</strong> hours, photos, and menu in front of them —
            and get found first.
          </p>

          {/* Trust chips — reinforce how effortless and low-friction it is */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line/8 text-ink text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-ink" /> Verified badge
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-line/8 text-ink text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-brand-ink" /> ~1 minute
            </span>
          </div>
        </div>

        <ClaimSearch />

        {/* Featured and Premium are add-ons on the $49.99 claim. */}
        <div id="plans" className="mt-6 scroll-mt-24 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-b from-amber-50 dark:from-amber-500/10 to-transparent p-6 sm:p-8">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest">
            <Crown className="w-3 h-3" /> Optional Upgrade
          </span>
          <ListingPlans showClaim={false} cardBg="bg-surface" />
          <p className="text-xs text-ink-soft/70 mt-3">
            These are add-ons after you claim ($49.99/month).{' '}
            <Link href="/featured-listing" className="underline hover:text-ink">Compare all plans</Link>
          </p>
        </div>

        {/* What a paid claim gets you */}
        <div className="mt-6 bg-surface rounded-2xl border border-line/8 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-ink mb-4">What claiming gets you</h2>
          <ul className="space-y-3">
            {BENEFITS.map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-ink">
                <CheckCircle2 className="w-4 h-4 text-brand-ink shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* How it works — 3 dead-simple steps */}
        <div className="mt-6 bg-surface rounded-2xl border border-line/8 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-ink mb-1">How it works</h2>
          <p className="text-ink-soft text-sm mb-5">$49.99/month. No password to remember.</p>
          <ol className="space-y-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand text-white text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="text-sm text-ink-soft leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Owners can check the real traffic numbers instead of taking our
            word for it. */}
        <div className="mt-6 bg-surface rounded-2xl border border-line/8 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand/15 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-brand-ink" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-xl font-bold text-ink mb-1.5">
                See our traffic first
              </h2>
              <p className="text-ink-soft text-sm leading-relaxed mb-4">
                Restaurant owners can view this site&apos;s analytics at{' '}
                <Link href="/dashboard" className="text-brand-ink font-semibold hover:underline">
                  /dashboard
                </Link>
                . It&apos;s public and updates in real time — sessions, unique visitors, on-site searches,
                and how many diners tapped call, directions, or reviews. No sign-in required.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-brand hover:bg-brand-ink text-white text-sm font-bold transition-colors"
              >
                <BarChart3 className="w-4 h-4" /> View Site Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Common questions — the objections owners raise before subscribing */}
        <div className="mt-6 bg-surface rounded-2xl border border-line/8 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-ink mb-1">Frequently asked questions</h2>
          <p className="text-ink-soft text-sm mb-5">Everything owners usually ask before claiming.</p>
          <div className="space-y-2.5">
            {CLAIM_FAQS.map(({ q, a }) => (
              <details key={q} className="group border border-line/8 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-ink list-none">
                  {q}
                  <span className="text-brand-ink shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-ink-soft leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-ink-soft/70 mt-6">
          Unclaimed listings show whatever public data we have — claiming is the only way to control it.
        </p>

        <RecentlyClaimed />
      </div>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: CLAIM_FAQS.map(({ q, a }) => ({
              '@type': 'Question',
              name: q,
              acceptedAnswer: { '@type': 'Answer', text: a },
            })),
          }),
        }}
      />
    </main>
  )
}
