import Link from 'next/link'
import { Crown, MapPin, Star, BadgeCheck, Utensils, ArrowRight } from 'lucide-react'

const PHOTO_COUNT = 8

export default function HomepageFeaturedCTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 text-xs font-medium uppercase tracking-widest">Homepage Featured</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026]">
              The Premier Spot on RamenNearYou
            </h2>
            <p className="text-[#6B6862] text-sm mt-2 max-w-2xl">
              Our most visible placement. Showcase up to 8 photos in a beautiful scrollable gallery, right at the top of the homepage where every visitor lands.
            </p>
          </div>
        </div>

        {/* The mock listing — premium hero card */}
        <div className="relative bg-gradient-to-br from-[#F5F4F0] via-[#F5F4F0] to-[#241a26] rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl shadow-amber-900/20 ring-1 ring-amber-500/20">

          {/* Outer glow */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-amber-500/[0.06] via-transparent to-transparent" />

          {/* Photo gallery — scrolls horizontally */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-[85%] sm:w-[55%] md:w-[42%] lg:w-[32%] xl:w-[26%] h-64 sm:h-72 snap-start bg-gradient-to-br from-[#2a1f2e] via-[#F5F4F0] to-[#1a2420] border-r border-black/5 last:border-r-0 overflow-hidden"
                >
                  {/* Centered icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Utensils className="w-9 h-9 text-amber-500/40" />
                      </div>
                      {i === 0 && (
                        <div className="absolute inset-0 rounded-full animate-ping bg-amber-500/10" />
                      )}
                    </div>
                  </div>

                  {/* Grid pattern overlay */}
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }} />

                  {/* Gradient bottom for depth */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Photo number badge */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/60 text-[#1E2026]/60 text-xs font-medium backdrop-blur-sm">
                    {i + 1} / {PHOTO_COUNT}
                  </span>
                </div>
              ))}
            </div>

            {/* Featured badge — premium */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#F5F4F0] text-xs font-bold shadow-xl shadow-amber-500/40 z-10">
              <Crown className="w-3.5 h-3.5" />
              Homepage Featured
            </div>

            {/* Scroll hint indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[#1E2026]/60 text-xs font-medium z-10">
              <ArrowRight className="w-3 h-3" />
              Scroll for more
            </div>

            {/* Photo position dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === 0 ? 'bg-white w-6' : 'bg-white/30 w-1.5'}`}
                />
              ))}
            </div>
          </div>

          {/* Listing details */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]/70 italic">
                    Your Restaurant Name
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-semibold">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </span>
                  <span className="text-[#1E2026]/50 text-sm">5.0 (your reviews)</span>
                  <span className="text-[#1E2026]/30">·</span>
                  <span className="flex items-center gap-1 text-[#6B6862]/60 text-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#B57F50]" />
                    Your City, ST
                  </span>
                </div>

                <p className="text-[#6B6862] text-base leading-relaxed mb-4 max-w-2xl">
                  This is where your restaurant&apos;s story lives — front and center on our homepage. Up to 8 photos showcase your space, your bowls, and your team to every visitor who arrives at RamenNearYou. Nationwide reach, premium placement, priority everything.
                </p>

                <div className="flex flex-wrap gap-2">
                  {['Nationwide Top Placement', '8 Photo Gallery', 'Verified Badge', 'Priority Support', 'Search Boost', 'Featured Email Inclusion'].map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black/5 border border-black/8 text-[#6B6862]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA panel */}
              <div className="shrink-0 lg:w-64 flex flex-col gap-3 lg:border-l lg:border-black/5 lg:pl-6">
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
                  Your spot, our homepage
                </p>
                <p className="text-[#1E2026] text-sm leading-relaxed">
                  Claim the most visible placement on the site. Limited spots — first come, first served.
                </p>
                <Link
                  href="/featured/apply"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#F5F4F0] text-sm font-bold transition-all shadow-lg shadow-amber-500/30"
                >
                  <Crown className="w-4 h-4" />
                  Get Featured
                </Link>
                <p className="text-[#1E2026]/30 text-xs text-center">No commitment · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
