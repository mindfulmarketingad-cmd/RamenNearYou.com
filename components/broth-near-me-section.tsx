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
  accentColor = '#B57F50',
}: BrothNearMeSectionProps) {
  const preview = restaurants.slice(0, 4)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">{title}</h2>
            <p className="text-[#6B6862] text-sm sm:text-base max-w-xl leading-relaxed">{description}</p>
          </div>
          <Link
            href={href}
            className="flex-shrink-0 flex items-center gap-2 text-sm font-medium text-[#B57F50] hover:text-[#1E2026] transition-colors group"
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
              className="group flex flex-col bg-[#ffffff] rounded-xl border border-black/5 hover:border-[#B57F50]/50 transition-all duration-200 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative w-full h-32 bg-[#F5F4F0] overflow-hidden">
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
                    <Utensils className="w-8 h-8 text-[#B57F50]/30" />
                  </div>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col gap-1">
                <p className="font-semibold text-[#1E2026] text-sm leading-snug group-hover:text-[#B57F50] transition-colors line-clamp-2">
                  {r.name}
                </p>
                <div className="flex items-center gap-1 text-[#6B6862] text-xs">
                  <MapPin className="w-3 h-3 shrink-0 text-[#B57F50]" />
                  <span className="truncate">{r.city}, {r.stateCode}</span>
                </div>
                {r.rating && (
                  <div className="flex items-center gap-1 mt-auto pt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[#1E2026] text-xs font-medium">{r.rating.toFixed(1)}</span>
                    <span className="text-[#6B6862]/60 text-xs">({(r.reviewCount ?? 0).toLocaleString()})</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#B57F50]/40 text-[#B57F50] text-sm font-medium hover:bg-[#B57F50]/10 transition-colors"
          >
            See all locations →
          </Link>
        </div>
      </div>
    </section>
  )
}
