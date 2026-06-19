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
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1E2026] hover:bg-[#B57F50] text-white text-xs font-semibold transition-colors whitespace-nowrap"
    >
      <ArrowLeftRight className="w-3.5 h-3.5" />
      Compare
    </Link>
  )
}
