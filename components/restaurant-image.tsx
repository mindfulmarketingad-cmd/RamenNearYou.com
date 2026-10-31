'use client'

import { useState } from 'react'
import Image from 'next/image'
import { safePhotoSrc } from '@/lib/photo-guard'
import { pickStockPhoto } from '@/lib/stock-photos'

const DEFAULT = '/images/hero-ramen.jpg'

interface Props {
  src?: string | null
  alt: string
  fill?: boolean
  sizes?: string
  className?: string
  priority?: boolean
}

export default function RestaurantImage({ src, alt, fill, sizes, className, priority }: Props) {
  // No real photo — either empty (common for Places-supplement listings) or
  // explicitly hardcoded to the generic DEFAULT (many city-guide entries) —
  // pick a varied stock photo keyed on the restaurant name instead of always
  // showing the same placeholder. A true load failure still falls back to
  // the single local DEFAULT (guaranteed to exist, no network dependency).
  const real = safePhotoSrc(src)
  const [imgSrc, setImgSrc] = useState(real && real !== DEFAULT ? real : pickStockPhoto(alt || 'ramen'))

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      unoptimized
      onError={() => setImgSrc(DEFAULT)}
    />
  )
}
