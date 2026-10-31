'use client'

import BlogScrollMap, { type MapCard } from './blog-scroll-map'

// Server-renders the card list; the Leaflet map inside loads in the browser
// only (blog-scroll-map.tsx imports Leaflet lazily).
export default function BlogScrollMapWrapper({
  cards,
  listHeading,
  adList,
}: {
  cards: MapCard[]
  listHeading?: string
  adList?: boolean
}) {
  return <BlogScrollMap cards={cards} listHeading={listHeading} adList={adList} />
}
