'use client'

import dynamic from 'next/dynamic'
import type { MapCard } from './blog-scroll-map'

// Dynamic import with ssr:false must live in a Client Component
const BlogScrollMap = dynamic(() => import('./blog-scroll-map'), { ssr: false })

export default function BlogScrollMapWrapper({
  cards,
  listHeading,
}: {
  cards: MapCard[]
  listHeading?: string
}) {
  return <BlogScrollMap cards={cards} listHeading={listHeading} />
}
