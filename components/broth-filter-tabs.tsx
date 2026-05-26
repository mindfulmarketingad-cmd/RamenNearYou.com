'use client'

import { useRouter } from 'next/navigation'
import type { BrothType } from '@/lib/restaurants'

const BROTH_TYPES = ['Tonkotsu', 'Shoyu', 'Miso', 'Spicy', 'Vegan'] as const

const brothMeta: Record<BrothType, { label: string; color: string; border: string }> = {
  Tonkotsu: { label: 'Tonkotsu', color: 'text-amber-300',  border: 'border-amber-500/30 bg-amber-500/10 hover:border-amber-400/60' },
  Shoyu:    { label: 'Shoyu',    color: 'text-orange-300', border: 'border-orange-500/30 bg-orange-500/10 hover:border-orange-400/60' },
  Miso:     { label: 'Miso',     color: 'text-yellow-300', border: 'border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-400/60' },
  Spicy:    { label: 'Spicy',    color: 'text-red-400',    border: 'border-red-500/30 bg-red-500/10 hover:border-red-400/60' },
  Vegan:    { label: 'Vegan',    color: 'text-green-400',  border: 'border-green-500/30 bg-green-500/10 hover:border-green-400/60' },
}

interface Props {
  selected: BrothType | null
  counts: Record<string, number>
}

export default function BrothFilterTabs({ selected, counts }: Props) {
  const router = useRouter()

  function select(type: BrothType | null) {
    if (type) {
      router.push(`/broth?type=${type}`)
    } else {
      router.push('/broth')
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={() => select(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
          !selected
            ? 'bg-[#B57F50] border-[#B57F50] text-white'
            : 'border-black/8 text-[#6B6862] hover:text-[#1E2026]'
        }`}
      >
        All ({counts.All?.toLocaleString()})
      </button>
      {BROTH_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => select(selected === type ? null : type)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            selected === type
              ? 'bg-[#B57F50] border-[#B57F50] text-white'
              : 'border-black/8 text-[#6B6862] hover:text-[#1E2026]'
          }`}
        >
          {brothMeta[type].label} ({counts[type]?.toLocaleString()})
        </button>
      ))}
    </div>
  )
}
