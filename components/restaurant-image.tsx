'use client'

import { useState } from 'react'
import Image from 'next/image'

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
  const [imgSrc, setImgSrc] = useState(src || DEFAULT)

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
