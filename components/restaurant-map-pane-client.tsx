'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const RestaurantMapPane = dynamic(() => import('./restaurant-map-pane'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#F5F4F0]">
      <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
    </div>
  ),
})

interface Props {
  lat: number
  lng: number
  name: string
  address: string
}

export default function RestaurantMapPaneClient(props: Props) {
  return <RestaurantMapPane {...props} />
}
