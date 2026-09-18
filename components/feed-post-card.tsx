'use client'

import Link from 'next/link'
import { MapPin, Navigation, Globe, Phone } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'
import RestaurantVoteButtons from '@/components/restaurant-vote-buttons'
import CardSaveButton from '@/components/card-save-button'
import { StarRating } from '@/components/listicle-card'
import { trackEvent } from '@/lib/analytics-client'

// A single post in the personal /feed. Deliberately not the compact listicle
// row: this is the surface people scroll for a while, so it's photo-forward
// with one restaurant per screenful and the social actions (vote, save) on
// the card itself.

export interface FeedPost {
  slug: string
  citySlug: string
  stateSlug: string
  name: string
  city: string
  stateCode: string
  zip: string | null
  rating: number | null
  reviewCount: number
  photo: string
  description: string
  subtypes: string
  priceRange: string
  address: string
  phone: string
  website: string
  googleMapsLink: string
  openNow: boolean | null
  hoursLabel: string | null
}

export default function FeedPostCard({ post: p }: { post: FeedPost }) {
  const href = `/${p.citySlug}/${p.stateSlug}/${p.slug}`
  const directionsUrl =
    p.googleMapsLink ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name} ${p.city} ${p.stateCode}`)}`

  const tags = (p.subtypes ?? '')
    .split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3)

  return (
    <article className="bg-surface border border-line/8 rounded-2xl overflow-hidden hover:border-brand/40 transition-colors">
      <div className="relative aspect-[16/10] bg-sunken">
        <Link href={href} className="block absolute inset-0">
          <RestaurantImage
            src={p.photo}
            alt={p.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 560px"
          />
        </Link>
        <CardSaveButton slug={p.slug} restaurantName={p.name} />

        {p.openNow !== null && (
          <span
            className={`absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm ${
              p.openNow ? 'bg-emerald-600/90 text-white' : 'bg-black/60 text-white/90'
            }`}
          >
            {p.openNow ? 'Open now' : 'Closed'}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-serif text-lg font-bold text-ink leading-tight">
              <Link href={href} className="hover:text-brand-ink transition-colors">{p.name}</Link>
            </h2>
            <p className="flex items-center gap-1 text-xs text-ink-soft mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {p.city}, {p.stateCode}
              {p.zip && <span className="text-ink/25">·</span>}
              {p.zip && <span className="tabular-nums">{p.zip}</span>}
            </p>
          </div>
          {p.rating != null && (
            <span className="flex flex-col items-end shrink-0">
              <StarRating rating={p.rating} />
              <span className="text-xs text-ink-soft mt-0.5 tabular-nums">
                <strong className="text-ink">{p.rating.toFixed(1)}</strong>
                {!!p.reviewCount && ` (${p.reviewCount.toLocaleString()})`}
              </span>
            </span>
          )}
        </div>

        <p className="text-sm text-ink-mid leading-relaxed mt-2.5 line-clamp-3">
          {p.description || `Ramen in ${p.city}, ${p.stateCode}.`}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {p.priceRange && (
              <span className="px-2 py-0.5 rounded-full bg-sunken border border-line/8 text-[10px] font-medium text-ink-soft">
                {p.priceRange}
              </span>
            )}
            {tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full bg-sunken border border-line/8 text-[10px] font-medium text-ink-soft">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Action row — votes lead, because that's the part that makes the
            feed feel like other people are in it too. */}
        <div className="flex items-center justify-between gap-2 mt-3.5 pt-3.5 border-t border-line/8">
          <RestaurantVoteButtons slug={p.slug} restaurantName={p.name} size="sm" />

          <div className="flex items-center gap-1.5">
            {p.phone && (
              <a
                href={`tel:${p.phone}`}
                onClick={() => trackEvent('call_click', { listingSlug: p.slug, listingName: p.name, city: `${p.city}, ${p.stateCode}` })}
                aria-label={`Call ${p.name}`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-line/10 text-ink-soft hover:text-brand-ink hover:border-brand/50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}
            {p.website && (
              <a
                href={p.website}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name} website`}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-line/10 text-ink-soft hover:text-brand-ink hover:border-brand/50 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('directions_click', { listingSlug: p.slug, listingName: p.name, city: `${p.city}, ${p.stateCode}` })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand hover:bg-brand-hi text-white text-xs font-bold transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" /> Directions
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
