import Link from 'next/link'
import { Crown, MapPin, Star, BadgeCheck, Utensils } from 'lucide-react'

interface Props {
  cityName: string
  stateCode: string
}

export default function CityFeaturedCTA({ cityName, stateCode }: Props) {
  return (
    <div className="relative flex flex-col sm:flex-row bg-[#1E2026] rounded-xl border border-amber-500/25 overflow-hidden shadow-xl shadow-amber-900/10 ring-1 ring-amber-500/10">

      {/* Glow edge */}
      <div className="absolute inset-0 pointer-events-none rounded-xl bg-gradient-to-br from-amber-500/5 via-transparent to-transparent" />

      {/* Photo area — styled placeholder */}
      <div className="relative w-full sm:w-48 shrink-0 h-44 sm:h-auto bg-gradient-to-br from-[#2a1f2e] via-[#1E2026] to-[#1a2420] overflow-hidden">
        {/* Abstract ramen bowl illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Utensils className="w-10 h-10 text-amber-500/40" />
            </div>
            <div className="absolute inset-0 rounded-full animate-ping bg-amber-500/5" />
          </div>
        </div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }} />
        {/* Price badge placeholder */}
        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 text-white/40 text-xs font-medium backdrop-blur-sm">
          $$
        </span>
        {/* Featured badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-[#1E2026] text-xs font-bold shadow-lg shadow-amber-500/30">
          <Crown className="w-3 h-3" />
          Featured
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3 min-w-0">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="font-semibold text-white/60 text-lg leading-snug italic">
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
            <span className="text-white/40 text-xs">5.0 (your reviews)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[#B0B3BB]/50 text-xs">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#77567A]" />
          <span>{cityName}, {stateCode}</span>
        </div>

        <p className="text-[#B0B3BB] text-sm leading-relaxed line-clamp-2">
          This is where your restaurant&apos;s story goes. Featured listings appear at the top of every search in {cityName} — putting your bowls in front of every local ramen lover before they see anyone else.
        </p>

        <div className="flex flex-wrap gap-1.5">
          {['Top Placement', 'Verified Badge', 'Up to 4 Photos', 'Dine-in', 'Takeout'].map(tag => (
            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-[#B0B3BB]">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-amber-400/70 text-xs font-medium">
            ✦ This spot could be yours — own a ramen shop in {cityName}?
          </p>
          <Link
            href="/featured/apply"
            className="shrink-0 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#1E2026] text-xs font-bold transition-colors shadow-md shadow-amber-500/20"
          >
            Get Featured →
          </Link>
        </div>
      </div>
    </div>
  )
}
