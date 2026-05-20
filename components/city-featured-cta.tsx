import Link from 'next/link'
import { Crown, MapPin, Star, BadgeCheck, Utensils } from 'lucide-react'

interface Props {
  cityName: string
  stateCode: string
}

const PHOTO_COUNT = 4

export default function CityFeaturedCTA({ cityName, stateCode }: Props) {
  return (
    <div className="relative bg-[#F5F4F0] rounded-xl border border-amber-500/25 overflow-hidden shadow-xl shadow-amber-900/10 ring-1 ring-amber-500/10">

      {/* Glow edge */}
      <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />

      {/* Scrollable photo gallery */}
      <div className="relative">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
            <div
              key={i}
              className="relative shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-44 snap-start bg-gradient-to-br from-[#2a1f2e] via-[#F5F4F0] to-[#1a2420] border-r border-black/5 last:border-r-0 overflow-hidden"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Utensils className="w-7 h-7 text-amber-500/40" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }} />
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[#1E2026]/50 text-[10px] font-medium backdrop-blur-sm">
                {i + 1} / {PHOTO_COUNT}
              </span>
            </div>
          ))}
        </div>

        {/* Featured badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-[#F5F4F0] text-xs font-bold shadow-lg shadow-amber-500/30 z-10">
          <Crown className="w-3 h-3" />
          Featured
        </div>

        {/* Price badge */}
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-[#1E2026]/40 text-xs font-medium backdrop-blur-sm z-10">
          $$
        </span>

        {/* Scroll hint dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5 gap-3 min-w-0">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="font-semibold text-[#1E2026]/60 text-lg leading-snug italic">
              Your Restaurant Name
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-semibold shrink-0">
              <BadgeCheck className="w-3 h-3" />
              Verified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </span>
            <span className="text-[#1E2026]/40 text-xs">5.0 (your reviews)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[#6B6862]/50 text-xs">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#B57F50]" />
          <span>{cityName}, {stateCode}</span>
        </div>

        <p className="text-[#6B6862] text-sm leading-relaxed line-clamp-2">
          Up to 4 photos of your space, your bowls, and your team — scrollable right here at the top of every search in {cityName}. Put your ramen in front of every local ramen lover before they see anyone else.
        </p>

        <div className="flex flex-wrap gap-1.5">
          {['Top Placement', 'Verified Badge', '4 Photo Gallery', 'Dine-in', 'Takeout'].map(tag => (
            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/5 border border-black/8 text-[#6B6862]">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 border-t border-black/5 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-amber-400/70 text-xs font-medium">
            ✦ This spot could be yours — own a ramen shop in {cityName}?
          </p>
          <Link
            href="/featured/apply"
            className="shrink-0 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#F5F4F0] text-xs font-bold transition-colors shadow-md shadow-amber-500/20"
          >
            Get Featured →
          </Link>
        </div>
      </div>
    </div>
  )
}
