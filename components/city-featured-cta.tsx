import Link from 'next/link'
import { Crown, MapPin, Star, BadgeCheck, Utensils } from 'lucide-react'

interface Props {
  cityName: string
  stateCode: string
}

const PHOTO_COUNT = 4

export default function CityFeaturedCTA({ cityName, stateCode }: Props) {
  return (
    <div className="bg-[#F5F4F0] rounded-xl border border-black/8 overflow-hidden">

      {/* Photo gallery */}
      <div className="relative">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
            <div
              key={i}
              className="relative shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 h-44 snap-start bg-[#ECEAE4] border-r border-black/5 last:border-r-0 flex items-center justify-center"
            >
              <Utensils className="w-7 h-7 text-[#96602F]/25" />
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/8 text-[#6B6862] text-[10px] font-medium">
                {i + 1} / {PHOTO_COUNT}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B57F50] text-white text-xs font-semibold z-10">
          <Crown className="w-3 h-3" />
          Featured
        </div>

        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/8 text-[#6B6862] text-xs font-medium z-10">
          $$
        </span>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {Array.from({ length: PHOTO_COUNT }).map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#B57F50]' : 'bg-[#B57F50]/30'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5 gap-3 min-w-0">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="font-semibold text-[#1E2026]/50 text-lg leading-snug italic">
              Your Restaurant Name
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B57F50]/10 border border-[#B57F50]/25 text-[#96602F] text-xs font-semibold shrink-0">
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
            <span className="text-[#6B6862]/60 text-xs">5.0 (your reviews)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[#6B6862] text-xs">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-[#96602F]" />
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
          <p className="text-[#96602F] text-xs font-medium">
            Own a ramen shop in {cityName}?
          </p>
          <Link
            href="/featured/apply"
            className="shrink-0 px-4 py-2 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-xs font-bold transition-colors"
          >
            Get Featured
          </Link>
        </div>
      </div>
    </div>
  )
}
