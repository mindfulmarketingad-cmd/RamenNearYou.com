import { Eye, MapPin, Search, Users } from 'lucide-react'

const stats = [
  { icon: Eye, value: '89,431', label: 'Restaurants Viewed' },
  { icon: MapPin, value: '10,890+', label: 'Restaurants Listed' },
  { icon: Search, value: '124,057', label: 'Searches Made' },
  { icon: Users, value: '8,312', label: 'Members' },
]

export default function StatsBar() {
  return (
    <div className="w-full bg-[#1E2026] py-5 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 ${
              i < stats.length - 1
                ? 'sm:border-r sm:border-white/10 sm:pr-4'
                : ''
            }`}
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#B57F50]/20 flex items-center justify-center">
              <Icon className="w-4 h-4 text-[#96602F]" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none">{value}</p>
              <p className="text-white/50 text-xs mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
