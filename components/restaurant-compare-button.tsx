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
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-black/8 bg-black/5 hover:border-black/15 hover:text-[#1E2026] text-[#6B6862] text-sm font-medium transition-all duration-200"
    >
      <ArrowLeftRight className="w-4 h-4" />
      Compare
    </Link>
  )
}
