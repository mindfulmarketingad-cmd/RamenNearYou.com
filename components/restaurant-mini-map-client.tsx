'use client'

import dynamic from 'next/dynamic'

const RestaurantMiniMap = dynamic(() => import('./restaurant-mini-map'), { ssr: false })

interface Props {
  lat: number
  lng: number
  name: string
  address: string
  directionsUrl: string
}

export default function RestaurantMiniMapClient(props: Props) {
  return <RestaurantMiniMap {...props} />
}
