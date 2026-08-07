import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CheckCircle2, Zap, ShieldCheck, Gift, Crown, MapPin, Map, Home, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import ClaimSearch from './claim-search'
import RecentlyClaimed from './recently-claimed'

export const metadata = {
  title: 'Claim Your Ramen Restaurant Listing — $19.99/mo | Ramen Near You',
  description: 'Claim your restaurant on RamenNearYou for $19.99/month. Search your name, sign in with Google, subscribe — done. Control your hours, photos, and menu — plus the option to get featured on your city, state, and homepage search map.',
  alternates: { canonical: 'https://www.ramennearyou.com/claim-your-listing' },
}

const BENEFITS = [
  'Verified badge on your listing and the ramen search map',
  'Update your hours, photos, menu, and description anytime',
  'A dedicated owner dashboard with visit & click analytics',
  'An ad-free listing page — nothing competing for your customers',
  'You control what diners see — your listing, your details',
]

const STEPS = [
  { title: 'Search your restaurant', text: 'Type your name and tap it from the list.' },
  { title: 'Sign in with Google', text: 'One tap — no password to create. Skip this if you\'re already signed in.' },
  { title: 'Subscribe for $19.99/mo', text: 'Everything\'s pre-filled from your Google account and our listing data. Subscribe and submit — no lengthy form to fill out.' },
]

// The optional upgrade a claimed owner can add — the three search-map surfaces
// a Featured listing shows up on.
const FEATURED_SURFACES = [
  { icon: MapPin, label: 'Your city\'s search map', desc: 'Top spot when locals search your city.' },
  { icon: Map, label: 'Your state\'s search map', desc: 'Stand out across your whole state.' },
  { icon: Home, label: 'The homepage search map', desc: '#1 position seen by every visitor.' },
]

// The questions owners actually ask before paying. Answers stay factual —
// for "does this get traffic" we point at the public /dashboard instead of
// quoting a number we'd have to keep in sync.
const CLAIM_FAQS = [
  {
    q: 'Does this site actually get traffic?',
    a: 'Yes — and you don\'t have to take our word for it. Our traffic numbers are public and live at /dashboard: sessions, unique visitors, searches, and how many people tapped call, directions, or reviews on a listing. Check it before you subscribe, and check it again after you claim.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. It\'s a $19.99/month subscription with no contract and no cancellation fee. Cancel whenever you like and your claim stays active through the end of the period you already paid for.',
  },
  {
    q: 'What do I get for $19.99 a month?',
    a: 'A verified badge on your listing and on the search map, full control of your hours, photos, menu, and description, an owner dashboard with visit and click analytics for your listing, and an ad-free listing page so nothing competes with your restaurant.',
  },
  {
    q: 'Can I see analytics for my own restaurant?',
    a: 'Yes. Claimed owners get a dashboard with visits and clicks for their own listing. Site-wide analytics for the whole directory are public to everyone at /dashboard, so you can see the traffic your listing is sitting in front of.',
  },
  {
    q: 'How long does verification take?',
    a: 'Most claims are reviewed within a few business days. We confirm you\'re the owner or an authorized manager, then your listing gets the verified badge and edit access.',
  },
  {
    q: 'What if my restaurant isn\'t in the search?',
    a: 'Use the contact page and tell us your restaurant name and address — we\'ll add it to the directory so you can claim it.',
  },
  {
    q: 'Do I need a website or a Google Business account?',
    a: 'No. All you need is a Google account to sign in with — one tap, no password to create. Everything else is pre-filled from our listing data, so claiming takes about 30 seconds.',
  },
  {
    q: 'Is Featured placement included?',
    a: 'No — Featured is a separate optional upgrade that puts a gold crown pin at the top of your city page, state page, and the homepage search map. Your $19.99/mo claim gets you everything listed above without it.',
  },
  {
    q: 'What happens if I don\'t claim my listing?',
    a: 'Your listing stays up, but it shows whatever public data we have — which may be wrong hours, an old photo, or a missing menu. Claiming is the only way to control what diners see.',
  },
]

export default function ClaimYourListingPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Compact, enticing header — the search form is the first thing on screen */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/20 mb-3">
            <span className="text-[#96602F] text-xs font-medium uppercase tracking-widest">For Restaurant Owners</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">
            Claim Your Restaurant — $19.99/mo
          </h1>
          <p className="text-[#6B6862] text-sm leading-relaxed max-w-md mx-auto">
            Thousands of diners use RamenNearYou to decide where to eat tonight.
            Put <strong className="text-[#1E2026]">your</strong> hours, photos, and menu in front of them —
            and get found first.
          </p>

          {/* Trust chips — reinforce how effortless and low-friction it is */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold">
              <Gift className="w-3.5 h-3.5" /> $19.99/mo
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#1E2026] text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#96602F]" /> Cancel anytime
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/8 text-[#1E2026] text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-[#96602F]" /> ~30 seconds
            </span>
          </div>
        </div>

        <ClaimSearch />

        {/* Featured upsell — mentioned right after the claim action, framed as
            an optional bonus so it never muddies the "claiming is free" message */}
        <div className="mt-6 rounded-2xl border-2 border-amber-400/50 bg-gradient-to-b from-amber-50 to-white p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest">
              <Crown className="w-3 h-3" /> Optional Upgrade
            </span>
          </div>
          <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1.5">
            Want to be impossible to miss?
          </h2>
          <p className="text-[#6B6862] text-sm leading-relaxed mb-5">
            Claiming is $19.99/mo. Once you&apos;ve claimed, you can choose to also get{' '}
            <strong className="text-[#1E2026]">Featured</strong> — a stand-out gold crown pin that puts you at the
            very top of the search map on three levels:
          </p>
          <div className="space-y-3 mb-5">
            {FEATURED_SURFACES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1E2026]">{label}</p>
                  <p className="text-xs text-[#6B6862] leading-snug">{desc}</p>
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
          <p className="text-xs text-[#6B6862]/70 mt-3">
            Totally optional — your $19.99/mo claim already gets you everything below.
          </p>
        </div>

        {/* What a paid claim gets you */}
        <div className="mt-6 bg-[#ffffff] rounded-2xl border border-black/8 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">What you get for $19.99/mo</h2>
          <ul className="space-y-3">
            {BENEFITS.map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-[#1E2026]">
                <CheckCircle2 className="w-4 h-4 text-[#96602F] shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* How it works — 3 dead-simple steps */}
        <div className="mt-6 bg-[#ffffff] rounded-2xl border border-black/8 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1">How it works</h2>
          <p className="text-[#6B6862] text-sm mb-5">One-click claiming. No form to fill out.</p>
          <ol className="space-y-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex items-start gap-4">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#B57F50] text-white text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#1E2026]">{step.title}</p>
                  <p className="text-sm text-[#6B6862] leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Owners deciding whether the traffic is worth $19.99/mo can check
            the real numbers instead of taking our word for it. */}
        <div className="mt-6 bg-[#ffffff] rounded-2xl border border-black/8 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#B57F50]/15 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-[#96602F]" />
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1.5">
                See our traffic before you pay
              </h2>
              <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
                Restaurant owners can view this site&apos;s analytics at{' '}
                <Link href="/dashboard" className="text-[#96602F] font-semibold hover:underline">
                  /dashboard
                </Link>
                . It&apos;s public and updates in real time — sessions, unique visitors, on-site searches,
                and how many diners tapped call, directions, or reviews. No sign-in required.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#B57F50] hover:bg-[#96602F] text-white text-sm font-bold transition-colors"
              >
                <BarChart3 className="w-4 h-4" /> View Site Analytics
              </Link>
            </div>
          </div>
        </div>

        {/* Common questions — the objections owners raise before subscribing */}
        <div className="mt-6 bg-[#ffffff] rounded-2xl border border-black/8 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1">Frequently asked questions</h2>
          <p className="text-[#6B6862] text-sm mb-5">Everything owners usually ask before claiming.</p>
          <div className="space-y-2.5">
            {CLAIM_FAQS.map(({ q, a }) => (
              <details key={q} className="group border border-black/8 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                  {q}
                  <span className="text-[#96602F] shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#6B6862]/70 mt-6">
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
