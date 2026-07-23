import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { CheckCircle2 } from 'lucide-react'
import ClaimSearch from './claim-search'
import RecentlyClaimed from './recently-claimed'

export const metadata = {
  title: 'Claim Your Ramen Restaurant Listing — Free | Ramen Near You',
  description: 'Claim your restaurant on RamenNearYou for free. Search your restaurant, submit a short claim form, and once verified you control your hours, photos, menu, and description.',
  alternates: { canonical: 'https://www.ramennearyou.com/claim-your-listing' },
}

const BENEFITS = [
  'Verified badge on your listing and the ramen search map',
  'Update your hours, photos, menu, and description anytime',
  'Respond to what diners see — your listing, your details',
  'Ad-free listing page (no ads on your dedicated listing page)',
]

const STEPS = [
  { title: 'Enter your restaurant\'s name', text: 'Type your restaurant name in the box above and pick it from the list.' },
  { title: 'Fill out the short claim form', text: 'Just four fields — your name, business name, phone, and email.' },
  { title: 'Get verified', text: 'We review every claim within 2–3 business days. Once approved, the listing is yours to manage.' },
]

export default function ClaimYourListingPage() {
  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-20">
        {/* Compact header — the search form is the first thing on screen */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/20 mb-3">
            <span className="text-[#96602F] text-xs font-medium uppercase tracking-widest">For Restaurant Owners</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-2">
            Claim Your Free Restaurant Listing
          </h1>
          <p className="text-[#6B6862] text-sm leading-relaxed max-w-md mx-auto">
            Thousands of diners use RamenNearYou to decide where to eat.
            Make sure they see <strong className="text-[#1E2026]">your</strong> hours, your photos, and your menu —
            not outdated info. Takes about 2 minutes. No card, no fees.
          </p>
        </div>

        <ClaimSearch />

        {/* What a free claim gets you */}
        <div className="mt-8 bg-[#ffffff] rounded-2xl border border-black/8 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-4">What you get — free, forever</h2>
          <ul className="space-y-3">
            {BENEFITS.map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-[#1E2026]">
                <CheckCircle2 className="w-4 h-4 text-[#96602F] shrink-0 mt-0.5" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* How it works — 3 steps, nothing more */}
        <div className="mt-6 bg-[#ffffff] rounded-2xl border border-black/8 p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">How it works</h2>
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
