import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CheckCircle2, Zap, ShieldCheck, Gift, Crown, MapPin, Map, Home } from 'lucide-react'
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

        <p className="text-center text-xs text-[#6B6862]/70 mt-6">
          Unclaimed listings show whatever public data we have — claiming is the only way to control it.
        </p>

        <RecentlyClaimed />
      </div>
      <Footer />
    </main>
  )
}
