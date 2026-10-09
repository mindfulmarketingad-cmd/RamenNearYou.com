import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CheckCircle2, Zap, ShieldCheck, Crown, Home, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import ClaimSearch from './claim-search'
import RecentlyClaimed from './recently-claimed'

export const metadata = {
  title: 'Claim Your Ramen Restaurant Listing | Ramen Near You',
  description: 'Claim your restaurant on RamenNearYou. Find your listing, send us a quick email, and we\'ll verify you and keep your hours, photos, and menu up to date — plus the option to get featured on the homepage.',
  alternates: { canonical: 'https://www.ramennearyou.com/claim-your-listing' },
}

const BENEFITS = [
  'Verified badge on your listing and the ramen search map',
  'Send us new hours, photos, menu, or description and we update your listing',
  'An ad-free listing page — nothing competing for your customers',
  'You control what diners see — your listing, your details',
]

const STEPS = [
  { title: 'Search your restaurant', text: 'Type your name and tap it from the list.' },
  { title: 'Send the email', text: 'Your email app opens with the claim filled in — add your name and role, then send.' },
  { title: 'We verify you', text: 'We confirm you\'re the owner or an authorized manager and reply with next steps and pricing.' },
]

// The optional upgrade a claimed owner can add (see /featured-listing).
const FEATURED_SURFACES = [
  { icon: Home, label: 'The homepage billboard', desc: 'The first thing every visitor sees, above the map.' },
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
    a: 'Most claims are reviewed within a few business days. We confirm you\'re the owner or an authorized manager, then your listing gets the verified badge.',
  },
  {
    q: 'What if my restaurant isn\'t in the search?',
    a: 'Use the contact page and tell us your restaurant name and address — we\'ll add it to the directory so you can claim it.',
  },
  {
    q: 'Is Featured placement included?',
    a: 'No — Featured is a separate optional upgrade that puts your restaurant on the homepage billboard. Claiming gets you everything listed above without it.',
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

        {/* Featured upsell — mentioned right after the claim action, framed as
            an optional bonus so it never muddies the "claiming is free" message */}
        <div className="mt-6 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-b from-amber-50 dark:from-amber-500/10 to-white p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest">
              <Crown className="w-3 h-3" /> Optional Upgrade
            </span>
          </div>
          <h2 className="font-serif text-xl font-bold text-ink mb-1.5">
            Want to be impossible to miss?
          </h2>
          <p className="text-ink-soft text-sm leading-relaxed mb-5">
            Once you&apos;ve claimed, you can choose to also get{' '}
            <strong className="text-ink">Featured</strong> — the billboard at the very top of the homepage:
          </p>
          <div className="space-y-3 mb-5">
            {FEATURED_SURFACES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  <p className="text-xs text-ink-soft leading-snug">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/featured-listing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition-colors"
          >
            <Crown className="w-4 h-4" /> See Featured plans
          </Link>
          <p className="text-xs text-ink-soft/70 mt-3">
            Totally optional — claiming already gets you everything below.
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
          <p className="text-ink-soft text-sm mb-5">No account to create.</p>
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
