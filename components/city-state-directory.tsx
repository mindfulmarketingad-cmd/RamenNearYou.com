import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getStates } from '@/lib/restaurants'

export default function CityStateDirectory() {
  const states = getStates().sort((a, b) => a.state.localeCompare(b.state))

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-black/5">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-2">Browse the Directory</p>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">
          Ramen Restaurants by State
        </h2>
        <p className="text-[#6B6862] text-sm sm:text-base max-w-xl leading-relaxed mb-10">
          Find ramen spots and restaurants near you. Pick your state to browse every city in our directory.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {states.map((s) => (
            <Link
              key={s.stateSlug}
              href={`/${s.stateSlug}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F5F4F0] border border-black/5 hover:border-[#B57F50]/40 hover:bg-[#B57F50]/5 transition-colors group"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="text-[#1E2026] text-sm font-medium group-hover:text-[#B57F50] transition-colors truncate">
                  {s.state}
                </span>
              </span>
              <span className="flex items-center gap-1 shrink-0 ml-2">
                <span className="text-[#6B6862] text-xs">{s.cityCount} cities</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B57F50]/50 group-hover:text-[#B57F50] transition-colors" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
