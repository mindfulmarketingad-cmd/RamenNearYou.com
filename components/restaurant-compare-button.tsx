import Link from 'next/link'
import { ArrowLeftRight } from 'lucide-react'
import { type Restaurant } from '@/lib/restaurants'

interface Props {
  restaurant: Restaurant
}

export default function RestaurantCompareButton({ restaurant }: Props) {
  return (
    <Link
      href={`/compare?a=${restaurant.slug}`}
      className="group w-full flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl bg-[#1E2026] hover:bg-[#B57F50] border border-transparent hover:border-[#c8934f] text-white transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors shrink-0">
          <ArrowLeftRight className="w-4 h-4" />
        </span>
        <div className="text-left">
          <p className="text-sm font-semibold leading-tight">Compare Restaurants</p>
          <p className="text-[11px] text-white/60 group-hover:text-white/80 transition-colors leading-tight mt-0.5">
            Side-by-side ratings, hours, amenities &amp; more
          </p>
        </div>
      </div>
      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors shrink-0 whitespace-nowrap">
        Compare →
      </span>
    </Link>
  )
}
