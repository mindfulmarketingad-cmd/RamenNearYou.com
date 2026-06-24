'use client'

import { useState } from 'react'
import { Utensils } from 'lucide-react'
import { safePhotoSrc } from '@/lib/photo-guard'

interface Props {
  src?: string | null
  alt: string
  className?: string
}

export default function SafeImg({ src, alt, className }: Props) {
  const [failed, setFailed] = useState(false)
  const clean = safePhotoSrc(src)

  if (!clean || failed) {
    return (
      <div className={`flex items-center justify-center bg-[#F0EDE8] ${className ?? ''}`}>
        <Utensils className="w-5 h-5 text-[#B57F50]/40" />
      </div>
    )
  }

  return (
    <img
      src={clean}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
