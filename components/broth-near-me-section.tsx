import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, ArrowRight, Utensils } from 'lucide-react'
import type { Restaurant } from '@/lib/restaurants'
import RestaurantImage from '@/components/restaurant-image'

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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-sunken">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-3">{title}</h2>
            <p className="text-ink-soft text-sm sm:text-base max-w-xl leading-relaxed">{description}</p>
          </div>
          <Link
            href={href}
            className="flex-shrink-0 flex items-center gap-2 text-sm font-medium text-brand-ink hover:text-ink transition-colors group"
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
              className="group flex flex-col bg-surface rounded-xl border border-line/5 hover:border-brand/50 transition-all duration-200 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative w-full h-32 bg-sunken overflow-hidden">
                <RestaurantImage
                  src={r.photo}
                  alt={r.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col gap-1">
                <p className="font-semibold text-ink text-sm leading-snug group-hover:text-brand-ink transition-colors line-clamp-2">
                  {r.name}
                </p>
                <div className="flex items-center gap-1 text-ink-soft text-xs">
                  <MapPin className="w-3 h-3 shrink-0 text-brand-ink" />
                  <span className="truncate">{r.city}, {r.stateCode}</span>
                </div>
                {r.rating && (
                  <div className="flex items-center gap-1 mt-auto pt-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-ink text-xs font-medium">{r.rating.toFixed(1)}</span>
                    <span className="text-ink-soft/60 text-xs">({(r.reviewCount ?? 0).toLocaleString()})</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-brand/40 text-brand-ink text-sm font-medium hover:bg-brand/10 transition-colors"
          >
            See all locations →
          </Link>
        </div>
      </div>
    </section>
  )
}
