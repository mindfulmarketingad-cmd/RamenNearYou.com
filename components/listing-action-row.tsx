'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Navigation2, Globe, Phone, Heart, BookOpen, Store, Edit3, ShoppingBag, Bike } from 'lucide-react'
import { useCurrentUser } from '@/lib/use-current-user'
import { useOwnerStatus } from '@/lib/use-owner-status'
import { getSavedSlugs, toggleSaved } from '@/lib/saves'
import LoginGateModal from '@/components/login-gate-modal'
import InquireButton from '@/components/inquire-button'

const iconBtn = 'flex flex-col items-center gap-1 text-[#96602F] text-[11px] font-medium shrink-0'
const iconCircle = 'w-11 h-11 rounded-full bg-[#B57F50]/10 flex items-center justify-center hover:bg-[#B57F50]/20 transition-colors'

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
// Directions/Website/Call/Save/Claim all require a logged-in account — a
// logged-out click opens LoginGateModal instead of following the link.
// Owner status is resolved client-side (useOwnerStatus) so the page itself
// can stay statically cached.
export default function ListingActionRow({
  slug, restaurantName, city, state, displayCity, stateCode, directionsUrl, website, phone, menuUrl, isVerified,
}: Props) {
  const router = useRouter()
  const { user, authChecked } = useCurrentUser()
  const { isOwner } = useOwnerStatus(slug)
  const [gateOpen, setGateOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const pathname = `/${city}/${state}/${slug}`

  useEffect(() => {
    getSavedSlugs().then((slugs) => setSaved(slugs.includes(slug)))
  }, [slug])

  function guard(e: React.MouseEvent, action: () => void) {
    if (!authChecked) { e.preventDefault(); return }
    if (!user) {
      e.preventDefault()
      setGateOpen(true)
      return
    }
    action()
  }

  function handleSave(e: React.MouseEvent) {
    guard(e, async () => {
      if (busy) return
      setBusy(true)
      const result = await toggleSaved(slug, saved)
      setBusy(false)
      if (result.unauthorized) { setGateOpen(true); return }
      setSaved(result.saved)
    })
  }

  return (
    <>
      <div className="flex items-center gap-5 mt-5 pb-5 border-b border-black/8 overflow-x-auto scrollbar-hide">
        {!isOwner && !isVerified && (
          <button type="button" className={iconBtn} onClick={(e) => guard(e, () => router.push(`/claim/${city}/${state}/${slug}`))}>
            <span className="relative">
              <span className="absolute inset-0 rounded-full bg-[#B57F50] animate-ping opacity-60" />
              <span className={`relative ${iconCircle}`}><Store className="w-5 h-5" /></span>
            </span>
            Claim
          </button>
        )}
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={(e) => guard(e, () => {})}>
          <span className={iconCircle}><Navigation2 className="w-5 h-5" /></span>
          Directions
        </a>
        <a href={UBER_EATS_URL} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={(e) => guard(e, () => {})}>
          <span className={iconCircle}><ShoppingBag className="w-5 h-5" /></span>
          Order Pickup
        </a>
        <a href={UBER_EATS_URL} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={(e) => guard(e, () => {})}>
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
          <a href={website} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={(e) => guard(e, () => {})}>
            <span className={iconCircle}><Globe className="w-5 h-5" /></span>
            Website
          </a>
        )}
        {phone && (
          <a href={`tel:${phone}`} className={iconBtn} onClick={(e) => guard(e, () => {})}>
            <span className={iconCircle}><Phone className="w-5 h-5" /></span>
            Call
          </a>
        )}
        <button onClick={handleSave} disabled={busy} className={`${iconBtn} disabled:opacity-60`}>
          <span className={iconCircle}><Heart className={`w-5 h-5 transition-all ${saved ? 'fill-[#B57F50]' : ''}`} /></span>
          {saved ? 'Saved' : 'Save'}
        </button>
        {menuUrl && (
          <a href={menuUrl} target="_blank" rel="noopener noreferrer" className={iconBtn} onClick={(e) => guard(e, () => {})}>
            <span className={iconCircle}><BookOpen className="w-5 h-5" /></span>
            Menu
          </a>
        )}
        {isOwner && (
          <Link href={`/owner/${slug}`} className={iconBtn}>
            <span className={iconCircle}><Edit3 className="w-5 h-5" /></span>
            Manage
          </Link>
        )}
      </div>
      <LoginGateModal open={gateOpen} onClose={() => setGateOpen(false)} redirectTo={pathname} />
    </>
  )
}
