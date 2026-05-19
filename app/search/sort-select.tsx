'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'relevant', label: 'Best Match' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'alpha', label: 'A → Z' },
] as const

export default function SortSelect({ current }: { current: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-3.5 h-3.5 text-[#B0B3BB] shrink-0" />
      <label htmlFor="sort-select" className="text-[#B0B3BB] text-xs font-medium whitespace-nowrap">
        Sort by
      </label>
      <select
        id="sort-select"
        value={current}
        onChange={handleChange}
        className="bg-[#1E2026] border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#77567A] transition-colors cursor-pointer"
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
