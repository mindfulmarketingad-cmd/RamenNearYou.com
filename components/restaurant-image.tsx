'use client'

import { useState } from 'react'
import Image from 'next/image'
import { safePhotoSrc } from '@/lib/photo-guard'

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
  const [imgSrc, setImgSrc] = useState(safePhotoSrc(src) || DEFAULT)

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
