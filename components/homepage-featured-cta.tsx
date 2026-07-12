import Link from 'next/link'
import { Crown, MapPin, Star, BadgeCheck, Utensils } from 'lucide-react'

const PHOTO_COUNT = 8

export default function HomepageFeaturedCTA() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Homepage Featured</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026]">
              The Premier Spot on RamenNearYou
            </h2>
            <p className="text-[#6B6862] text-sm mt-2 max-w-2xl">
              Our most visible placement. Showcase up to 8 photos in a scrollable gallery, right at the top of the homepage where every visitor lands.
            </p>
          </div>
        </div>

        <div className="bg-[#F5F4F0] rounded-xl border border-black/8 overflow-hidden">

          {/* Photo gallery */}
          <div className="relative">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
              {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="relative shrink-0 w-[85%] sm:w-[55%] md:w-[42%] lg:w-[32%] xl:w-[26%] h-64 sm:h-72 snap-start bg-[#ECEAE4] border-r border-black/5 last:border-r-0 flex items-center justify-center"
                >
                  <Utensils className="w-9 h-9 text-[#96602F]/20" />
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/8 text-[#6B6862] text-xs font-medium">
                    {i + 1} / {PHOTO_COUNT}
                  </span>
                </div>
              ))}
            </div>

            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B57F50] text-white text-xs font-bold z-10">
              <Crown className="w-3.5 h-3.5" />
              Homepage Featured
            </div>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full ${i === 0 ? 'bg-[#B57F50] w-6' : 'bg-[#B57F50]/30 w-1.5'}`}
                />
              ))}
            </div>
          </div>

          {/* Listing details */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026]/50 italic">
                    Your Restaurant Name
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/25 text-[#96602F] text-xs font-semibold">
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
                  <span className="text-[#6B6862]/70 text-sm">5.0 (your reviews)</span>
                  <span className="text-[#6B6862]/30">·</span>
                  <span className="flex items-center gap-1 text-[#6B6862] text-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#96602F]" />
                    Your City, ST
                  </span>
                </div>

                <p className="text-[#6B6862] text-base leading-relaxed mb-4 max-w-2xl">
                  This is where your restaurant&apos;s story lives — front and center on our homepage. Up to 8 photos showcase your space, your bowls, and your team to every visitor who arrives at RamenNearYou.
                </p>

                <div className="flex flex-wrap gap-2">
                  {['Nationwide Top Placement', '8 Photo Gallery', 'Verified Badge', 'Priority Support', 'Search Boost', 'Featured Email Inclusion'].map(tag => (
                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-black/5 border border-black/8 text-[#6B6862]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 lg:w-64 flex flex-col gap-3 lg:border-l lg:border-black/8 lg:pl-6">
                <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest">
                  Your spot, our homepage
                </p>
                <p className="text-[#1E2026] text-sm leading-relaxed">
                  Claim the most visible placement on the site. Limited spots — first come, first served.
                </p>
                <Link
                  href="/featured/apply"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Get Featured
                </Link>
                <p className="text-[#6B6862]/50 text-xs text-center">No commitment · Cancel anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
