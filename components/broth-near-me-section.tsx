import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ArrowRight, Utensils } from 'lucide-react'
import type { Restaurant } from '@/lib/restaurants'

interface BrothNearMeSectionProps {
  title: string
  description: string
  href: string
  restaurants: Restaurant[]
  accentColor?: string
}

export default function BrothNearMeSection({
  title,
  description,
  href,
  restaurants,
  accentColor = '#77567A',
}: BrothNearMeSectionProps) {
  const preview = restaurants.slice(0, 4)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#1E2026]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">{title}</h2>
            <p className="text-[#B0B3BB] text-sm sm:text-base max-w-xl leading-relaxed">{description}</p>
          </div>
          <Link
            href={href}
            className="flex-shrink-0 flex items-center gap-2 text-sm font-medium text-[#77567A] hover:text-white transition-colors group"
          >
            View all locations
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {preview.map((r) => (
            <Link
              key={r.slug}
              href={`/${r.citySlug}/${r.stateSlug}/${r.slug}`}
              className="group flex flex-col bg-[#2F323A] rounded-xl border border-white/5 hover:border-[#77567A]/50 transition-all duration-200 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative w-full h-32 bg-[#1E2026] overflow-hidden">
                {r.photo ? (
                  <Image
                    src={r.photo}
                    alt={r.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Utensils className="w-8 h-8 text-[#77567A]/30" />
                  </div>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col gap-1">
                <p className="font-semibold text-white text-sm leading-snug group-hover:text-[#77567A] transition-colors line-clamp-2">
                  {r.name}
                </p>
                <div className="flex items-center gap-1 text-[#B0B3BB] text-xs">
                  <MapPin className="w-3 h-3 shrink-0 text-[#77567A]" />
                  <span className="truncate">{r.city}, {r.stateCode}</span>
                </div>
                {r.rating && (
                  <div className="flex items-center gap-1 mt-auto pt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-white text-xs font-medium">{r.rating.toFixed(1)}</span>
                    <span className="text-[#B0B3BB]/60 text-xs">({r.reviewCount.toLocaleString()})</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#77567A]/40 text-[#77567A] text-sm font-medium hover:bg-[#77567A]/10 transition-colors"
          >
            See all {restaurants.length} locations →
          </Link>
        </div>
      </div>
    </section>
  )
}
