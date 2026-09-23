'use client'

import Link from 'next/link'
import { MapPin, Phone, Globe, Navigation } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'
import { trackEvent } from '@/lib/analytics-client'

// The single row used by every ranked feed on the site — the /find listicles
// and the homepage "near you" feed.
//
// Uniformity is the whole point of this component: every row is the same
// height with the same slots in the same places, whether or not a given
// listing has a phone number, hours, tags or a distance. Optional fields
// collapse to empty space inside a fixed slot rather than resizing the row,
// so a long scroll reads as one clean column instead of a ragged stack.
// If you add a field here, give it a reserved slot — don't let it push the
// row taller.

export type ListicleCardTag = { label: string; href?: string }

export interface ListicleCardData {
  key: string
  href: string
  photo?: string | null
  name: string
  rating?: number | null
  reviewCount?: number
  reviewHref?: string | null
  locationLabel?: string | null
  cityHref?: string | null
  stateHref?: string | null
  address?: string | null
  directionsUrl?: string | null
  phone?: string | null
  website?: string | null
  hoursLabel?: string | null
  hoursOpen?: boolean | null
  description: string
  tags?: ListicleCardTag[]
  claimHref?: string | null
  isClaimed?: boolean
}

export function StarRating({ rating }: { rating: number | null | undefined }) {
  if (rating == null) return null
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100))
  return (
    <span
      className="relative inline-block leading-none text-[13px] tracking-[0.05em] select-none"
      aria-hidden="true"
    >
      <span className="text-ink/15">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden text-amber-400 whitespace-nowrap"
        style={{ width: `${pct}%` }}
      >
        ★★★★★
      </span>
    </span>
  )
}

function LocationLabel({ label, cityHref, stateHref }: { label: string; cityHref?: string | null; stateHref?: string | null }) {
  const commaIdx = label.lastIndexOf(', ')
  if (commaIdx === -1) return <>{label}</>
  const city = label.slice(0, commaIdx)
  const state = label.slice(commaIdx + 2)
  return (
    <span className="truncate">
      {cityHref ? <Link href={cityHref} className="hover:text-brand-ink hover:underline">{city}</Link> : city}
      {', '}
      {stateHref ? <Link href={stateHref} className="hover:text-brand-ink hover:underline">{state}</Link> : state}
    </span>
  )
}

interface Props {
  item: ListicleCardData
  /** 1-based position shown in the rank badge. */
  rank: number
  /** e.g. "2.4 mi" — rendered in the fixed right rail. */
  distanceLabel?: string | null
  /** Singular noun for the claim prompt ("restaurant", "spot"). */
  noun?: string
}

export default function ListicleCard({ item: it, rank, distanceLabel, noun = 'restaurant' }: Props) {
  const track = (event: string) =>
    trackEvent(event, { listingSlug: it.key, listingName: it.name, city: it.locationLabel ?? undefined })

  return (
    <article className="group relative bg-surface border border-line/8 rounded-xl hover:border-brand/45 hover:shadow-[0_2px_12px_rgba(30,32,38,0.06)] transition-all">
      <div className="flex items-stretch gap-3 p-3 sm:p-4">
        {/* Thumbnail with the rank badged onto it — one fixed block, so every
            title starts on the same vertical line and no row has dead space
            beside a short entry. */}
        <div className="relative shrink-0 w-[68px] h-[68px] sm:w-[84px] sm:h-[84px] rounded-lg overflow-hidden bg-sunken">
          <RestaurantImage src={it.photo} alt={it.name} fill className="object-cover" sizes="84px" />
          <span className="absolute top-1 left-1 flex items-center justify-center w-5 h-5 rounded-full bg-contrast/85 text-white text-[10px] font-bold tabular-nums">
            {rank}
          </span>
        </div>

        {/* Main column. Each block below is a fixed-height slot. */}
        <div className="min-w-0 flex-1 flex flex-col">
          <h3 className="font-bold text-sm text-ink leading-snug truncate">
            <Link href={it.href} className="hover:text-brand-ink transition-colors">
              {it.name}
            </Link>
          </h3>

          {/* Rating + location — one line, always present, never wraps. */}
          <div className="flex items-center gap-2 mt-1 h-[18px] overflow-hidden">
            {it.rating != null ? (
              it.reviewHref ? (
                <Link href={it.reviewHref} className="flex items-center gap-1.5 shrink-0 group/rating" onClick={() => track('review_click')}>
                  <StarRating rating={it.rating} />
                  <span className="text-xs font-semibold text-ink group-hover/rating:text-brand-ink transition-colors tabular-nums">{it.rating.toFixed(1)}</span>
                  {!!it.reviewCount && (
                    <span className="text-xs text-ink-soft group-hover/rating:text-brand-ink group-hover/rating:underline transition-colors tabular-nums">
                      ({it.reviewCount.toLocaleString()})
                    </span>
                  )}
                </Link>
              ) : (
                <span className="flex items-center gap-1.5 shrink-0">
                  <StarRating rating={it.rating} />
                  <span className="text-xs font-semibold text-ink tabular-nums">{it.rating.toFixed(1)}</span>
                  {!!it.reviewCount && <span className="text-xs text-ink-soft tabular-nums">({it.reviewCount.toLocaleString()})</span>}
                </span>
              )
            ) : (
              <span className="text-xs text-ink-faint">Not yet rated</span>
            )}
            {it.locationLabel && (
              <span className="flex items-center gap-1 text-xs text-ink-soft min-w-0">
                <span className="text-ink/20">·</span>
                <MapPin className="w-3 h-3 shrink-0" />
                <LocationLabel label={it.locationLabel} cityHref={it.cityHref} stateHref={it.stateHref} />
              </span>
            )}
          </div>

          {/* Description — hard-clamped to two lines so a chatty entry can't
              make its row twice as tall as its neighbours. */}
          <p className="text-xs text-ink-mid mt-1.5 leading-snug line-clamp-2 h-[33px] overflow-hidden">
            {it.description}
          </p>

          {/* Status + contact — one reserved line. Open/closed leads because
              it's the thing people scan for. */}
          <div className="flex items-center gap-3 mt-1.5 h-[18px] overflow-hidden">
            {it.hoursLabel && (
              <span className={`text-xs font-semibold shrink-0 ${it.hoursOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-faint'}`}>
                {it.hoursLabel}
              </span>
            )}
            {it.phone && (
              <a href={`tel:${it.phone}`} onClick={() => track('call_click')} className="hidden sm:flex items-center gap-1 text-xs text-brand-ink hover:underline shrink-0">
                <Phone className="w-3 h-3" />{it.phone}
              </a>
            )}
            {it.website && (
              <a href={it.website} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 text-xs text-brand-ink hover:underline shrink-0">
                <Globe className="w-3 h-3" />Website
              </a>
            )}
            {it.address && (
              it.directionsUrl ? (
                <a
                  href={it.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('directions_click')}
                  className="text-xs text-ink-soft hover:text-brand-ink hover:underline truncate min-w-0"
                >
                  {it.address}
                </a>
              ) : (
                <span className="text-xs text-ink-soft truncate min-w-0">{it.address}</span>
              )
            )}
          </div>

          {/* Tags — one row, clipped. A listing with nine tags takes the same
              space as one with two. The claim prompt rides along at the end of
              this row rather than on its own line, so an unclaimed listing is
              exactly as tall as a claimed one. */}
          <div className="flex gap-1.5 mt-2 h-[20px] overflow-hidden flex-nowrap">
            {it.claimHref && !it.isClaimed && (
              <Link
                href={it.claimHref}
                className="px-2 py-0.5 rounded-full border border-brand/40 bg-brand/8 text-[10px] font-semibold text-brand-ink whitespace-nowrap hover:bg-brand/15 transition-colors"
              >
                Own this {noun}? Claim it
              </Link>
            )}
            {(it.tags ?? []).map((t) =>
              t.href ? (
                <Link
                  key={t.label}
                  href={t.href}
                  className="px-2 py-0.5 rounded-full bg-sunken border border-line/8 text-[10px] font-medium text-ink-soft whitespace-nowrap hover:border-brand/50 hover:text-brand-ink transition-colors"
                >
                  {t.label}
                </Link>
              ) : (
                <span key={t.label} className="px-2 py-0.5 rounded-full bg-sunken border border-line/8 text-[10px] font-medium text-ink-soft whitespace-nowrap">
                  {t.label}
                </span>
              )
            )}
          </div>
        </div>

        {/* Right rail — distance and the primary action, pinned to a fixed
            column so the CTAs form a straight edge down the page. Hidden on
            the narrowest screens where there's no room for a third column. */}
        <div className="hidden sm:flex flex-col items-end justify-between shrink-0 w-[92px] pl-1">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums h-[18px]">
            {distanceLabel ?? ''}
          </span>
          <div className="flex flex-col items-end gap-1.5">
            {it.directionsUrl && (
              <a
                href={it.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('directions_click')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-line/10 text-[11px] font-semibold text-ink-soft hover:border-brand/50 hover:text-brand-ink transition-colors"
              >
                <Navigation className="w-3 h-3" />Directions
              </a>
            )}
            <Link
              href={it.href}
              className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand text-white text-[11px] font-bold hover:bg-brand-hi transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
