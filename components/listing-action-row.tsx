'use client'

import { Navigation2, Globe, Phone, BookOpen, Store, ShoppingBag, Bike, Image as ImageIcon } from 'lucide-react'
import InquireButton from '@/components/inquire-button'
import { trackEvent } from '@/lib/analytics-client'
import { claimMailto } from '@/lib/mailto'

const iconBtn = 'flex flex-col items-center gap-1 text-brand-ink text-[11px] font-medium shrink-0'
const iconCircle = 'w-11 h-11 rounded-full bg-brand/10 flex items-center justify-center hover:bg-brand/20 transition-colors'

// Order Pickup/Delivery point to Uber Eats' general search rather than a
// restaurant-specific page — the site doesn't have per-listing Uber Eats IDs,
// and Uber Eats' own search surfaces the right restaurant from its name.
const UBER_EATS_URL = 'https://www.ubereats.com'

interface Props {
  slug: string
  restaurantName: string
  city: string
  state: string
  displayCity?: string
  stateCode?: string
  directionsUrl: string
  website: string
  phone: string
  menuUrl: string
  isVerified: boolean
}

// Google-Maps-style action row on the individual restaurant listing page.
// The site is static (no accounts), so every action is an outbound link;
// clicks that count as a lead land in the dashboard's analytics table.
export default function ListingActionRow({
  slug, restaurantName, displayCity, stateCode, directionsUrl, website, phone, menuUrl, isVerified,
}: Props) {
  // Google Images results for this specific restaurant (name + city/state so
  // same-named shops in other cities don't dominate the results).
  const imagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
    [restaurantName, displayCity, stateCode].filter(Boolean).join(' ')
  )}`

  const DASHBOARD_EVENT: Record<string, string> = {
    directions: 'directions_click',
    call: 'call_click',
    reviews: 'review_click',
  }

  function trackClick(destination: string) {
    const event = DASHBOARD_EVENT[destination]
    if (event) {
      trackEvent(event, {
        listingSlug: slug,
        listingName: restaurantName,
        city: displayCity && stateCode ? `${displayCity}, ${stateCode}` : undefined,
      })
    }
  }

  return (
    <>
      <div className="flex items-center gap-5 mt-5 pb-5 border-b border-line/8 overflow-x-auto scrollbar-hide">
        {!isVerified && (
          <a href={claimMailto(restaurantName, displayCity, stateCode)} className={iconBtn}>
            <span className="relative">
              <span className="absolute inset-0 rounded-full bg-brand animate-ping opacity-60" />
              <span className={`relative ${iconCircle}`}><Store className="w-5 h-5" /></span>
            </span>
            Claim
          </a>
        )}
        <a
          href={imagesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={iconBtn}
          onClick={() => trackClick('images')}
        >
          <span className={iconCircle}><ImageIcon className="w-5 h-5" /></span>
          Images
        </a>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={() => trackClick('directions')}>
          <span className={iconCircle}><Navigation2 className="w-5 h-5" /></span>
          Directions
        </a>
        <a href={UBER_EATS_URL} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={() => trackClick('order')}>
          <span className={iconCircle}><ShoppingBag className="w-5 h-5" /></span>
          Order Pickup
        </a>
        <a href={UBER_EATS_URL} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={() => trackClick('order')}>
          <span className={iconCircle}><Bike className="w-5 h-5" /></span>
          Order Delivery
        </a>
        <InquireButton
          variant="iconColumn"
          className={iconBtn}
          restaurant={{ name: restaurantName, slug, city: displayCity, stateCode }}
          source="listing"
        />
        {website && (
          <a href={website} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={() => trackClick('website')}>
            <span className={iconCircle}><Globe className="w-5 h-5" /></span>
            Website
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className={iconBtn} onClick={() => trackClick('call')}>
            <span className={iconCircle}><Phone className="w-5 h-5" /></span>
            Call
          </a>
        )}
        {menuUrl && (
          <a href={menuUrl} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={() => trackClick('menu')}>
            <span className={iconCircle}><BookOpen className="w-5 h-5" /></span>
            Menu
          </a>
        )}
      </div>
    </>
  )
}
