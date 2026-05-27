'use client'

import { useState } from 'react'
import { GitCompare } from 'lucide-react'
import { type Restaurant } from '@/lib/restaurants'
import RestaurantCompareModal from '@/components/restaurant-compare-modal'

interface Props {
  restaurant: Restaurant
}

export default function RestaurantCompareButton({ restaurant }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/10 text-[#1E2026] text-sm font-medium hover:border-[#B57F50] hover:text-[#B57F50] transition-colors"
      >
        <GitCompare className="w-4 h-4" />
        Compare
      </button>

      {open && (
        <RestaurantCompareModal
          currentRestaurant={restaurant}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
