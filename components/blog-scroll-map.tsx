'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, ChevronRight, Star, BadgeCheck, Map as MapIcon } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'
import { STATE_SLUG_TO_CODE } from '@/lib/state-lookups'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapCard {
  rank: number
  slug: string
  citySlug: string
  stateSlug: string
  name: string
  rating: number
  reviewCount: number
  address: string
  phone: string
  description: string
  photo: string
  tags: string[]
  lat: number | null
  lng: number | null
  perfectFor?: string[]
  featured?: boolean
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= full ? 'text-amber-400 fill-amber-400' : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-[#1E2026]/20'}`} />
      ))}
    </span>
  )
}

function makeNumberIcon(n: number, active: boolean, featured = false) {
  const size = active ? 38 : featured ? 32 : 28
  const bg = featured ? '#B57F50' : active ? '#B57F50' : '#1E2026'
  const border = featured ? (active ? '3px solid #fff' : '2.5px solid #fff') : (active ? '3px solid white' : '2px solid white')
  const shadow = featured
    ? `0 2px ${active ? 14 : 10}px rgba(181,127,80,${active ? 0.7 : 0.55})`
    : `0 2px ${active ? 10 : 6}px rgba(0,0,0,${active ? 0.4 : 0.3})`

  const starBadge = featured ? `
    <div style="
      position:absolute;top:-6px;right:-6px;
      width:16px;height:16px;border-radius:50%;
      background:#FFB800;border:1.5px solid white;
      display:flex;align-items:center;justify-content:center;
      font-size:9px;line-height:1;
      box-shadow:0 1px 4px rgba(0,0,0,0.3);
    ">★</div>` : ''

  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:${size}px;height:${size}px;">
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:${bg};color:white;
        display:flex;align-items:center;justify-content:center;
        font-size:${active ? 13 : featured ? 12 : 11}px;font-weight:700;font-family:serif;
        border:${border};
        box-shadow:${shadow};
        transition:all 0.2s;
      ">${n}</div>${starBadge}
    </div>`,
    iconSize: [size + (featured ? 6 : 0), size + (featured ? 6 : 0)],
    iconAnchor: [(size + (featured ? 6 : 0)) / 2, (size + (featured ? 6 : 0)) / 2],
    popupAnchor: [0, -((size + (featured ? 6 : 0)) / 2 + 4)],
  })
}

export default function BlogScrollMap({ cards, listHeading }: { cards: MapCard[]; listHeading?: string }) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Map<number, L.Marker>>(new Map())
  const cardRefs = useRef<Map<number, HTMLElement>>(new Map())
  const [activeRank, setActiveRank] = useState<number>(1)
  const [mapReady, setMapReady] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Detect desktop on mount — map only shown/initialized on lg+ screens
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Init map
  useEffect(() => {
    if (!isDesktop) return
    if (!mapContainerRef.current || mapRef.current) return

    // Fix leaflet icons
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    const withCoords = cards.filter(c => c.lat && c.lng)
    if (withCoords.length === 0) return

    const first = withCoords[0]
    const map = L.map(mapContainerRef.current, {
      center: [first.lat!, first.lng!],
      zoom: 13,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Add markers
    withCoords.forEach(card => {
      const marker = L.marker([card.lat!, card.lng!], {
        icon: makeNumberIcon(card.rank, card.rank === 1, card.featured),
        title: card.name,
      }).addTo(map)

      marker.bindPopup(`
        <div style="min-width:180px;font-family:sans-serif">
          ${card.photo ? `<img src="${card.photo}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />` : ''}
          <div style="font-weight:700;font-size:13px;color:#1E2026;margin-bottom:2px;">${card.name}</div>
          <div style="font-size:11px;color:#6B6862;">${card.address}</div>
        </div>
      `, { maxWidth: 220 })

      marker.on('click', () => {
        const el = cardRefs.current.get(card.rank)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })

      markersRef.current.set(card.rank, marker)
    })

    mapRef.current = map
    setMapReady(true)
    return () => { map.remove(); mapRef.current = null; markersRef.current.clear() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop])

  // Update active marker styles when activeRank changes
  useEffect(() => {
    if (!mapReady) return
    markersRef.current.forEach((marker, rank) => {
      const isFeatured = cards.find(c => c.rank === rank)?.featured
      marker.setIcon(makeNumberIcon(rank, rank === activeRank, isFeatured))
    })

    // Fly to active card's location
    const card = cards.find(c => c.rank === activeRank)
    if (card?.lat && card?.lng && mapRef.current) {
      mapRef.current.flyTo([card.lat, card.lng], 14, { duration: 0.8 })
      // Open popup briefly
      const marker = markersRef.current.get(activeRank)
      if (marker) marker.openPopup()
    }
  }, [activeRank, mapReady, cards])

  // IntersectionObserver: which card is most visible
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    cardRefs.current.forEach((el, rank) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            setActiveRank(rank)
          }
        },
        { threshold: 0.4, rootMargin: '-10% 0px -10% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const setCardRef = useCallback((rank: number) => (el: HTMLElement | null) => {
    if (el) cardRefs.current.set(rank, el)
    else cardRefs.current.delete(rank)
  }, [])

  const withCoords = cards.filter(c => c.lat && c.lng)
  const first = cards[0]
  const stateCode = first ? STATE_SLUG_TO_CODE[first.stateSlug] : undefined
  const findMapHref = first && stateCode ? `/find/${first.citySlug}-${stateCode.toLowerCase()}` : null

  return (
    <div className="lg:flex lg:gap-0 lg:-mx-8">
      {/* Left: scrollable list — full width on mobile, flex-1 on desktop */}
      <div className="lg:flex-1 lg:min-w-0 lg:px-8">
        {listHeading && (
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mt-10 mb-6">
            {listHeading}
          </h2>
        )}
        {/* Mobile has no inline map (avoids initializing Leaflet in a hidden
            container) — link out to the full interactive map instead so
            mobile users get the same map access desktop gets inline. */}
        {!isDesktop && findMapHref && withCoords.length > 0 && (
          <Link
            href={findMapHref}
            className="lg:hidden flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl bg-[#1E2026] hover:bg-black text-white text-sm font-semibold transition-colors"
          >
            <MapIcon className="w-4 h-4" /> View these spots on the interactive map
          </Link>
        )}
        <div className="flex flex-col gap-5">
          {cards.map((card) => (
            <article
              key={card.slug}
              ref={setCardRef(card.rank)}
              className={`flex flex-col bg-[#ffffff] rounded-xl border overflow-hidden transition-all duration-300 ${
                card.rank === activeRank
                  ? 'border-[#B57F50]/60 shadow-lg shadow-black/20'
                  : 'border-black/5 hover:border-[#B57F50]/30'
              }`}
            >
              {/* Photo + rank */}
              <div className="relative w-full h-48 sm:h-52 bg-[#F5F4F0] shrink-0">
                <RestaurantImage src={card.photo} alt={card.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 560px" />
                {/* Number badge */}
                <div className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold font-serif shadow-lg border-2 border-white transition-colors ${
                  card.rank === activeRank ? 'bg-[#B57F50]' : 'bg-[#1E2026]'
                }`}>
                  {card.rank}
                </div>
                {card.featured && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#B57F50] text-white text-[11px] font-bold shadow-md">
                    <BadgeCheck className="w-3 h-3" /> Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5 gap-2.5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-semibold text-[#1E2026] text-lg leading-snug">{card.name}</h2>
                    {card.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#B57F50]/15 border border-[#B57F50]/40 text-[#B57F50] text-xs font-semibold shrink-0">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StarRating rating={card.rating} />
                    <span className="text-[#1E2026]/70 text-xs">{card.rating.toFixed(1)} ({card.reviewCount.toLocaleString()}+ reviews)</span>
                    <span className="text-[#1E2026]/20 text-xs">·</span>
                    {card.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-[#B57F50]/15 text-[#B57F50] text-xs font-medium">{tag}</span>
                    ))}
                  </div>
                </div>

                <p className="text-[#6B6862] text-sm leading-relaxed">{card.description}</p>

                {card.perfectFor && card.perfectFor.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[#1E2026] text-xs font-semibold">Perfect for:</span>
                    {card.perfectFor.map((p) => (
                      <span key={p} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                        {p}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-1 text-xs text-[#6B6862]/70">
                  {card.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
                      {card.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
                    {card.address}
                  </span>
                </div>

                <div className="mt-auto pt-1">
                  <Link
                    href={`/${card.citySlug}/${card.stateSlug}/${card.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B57F50]/15 hover:bg-[#B57F50]/25 text-[#c8934f] text-xs font-semibold transition-colors border border-[#B57F50]/20"
                  >
                    View Listing <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Right: sticky map — only mounted on desktop to avoid Leaflet init on display:none */}
      {isDesktop && withCoords.length > 0 && (
        <div className="hidden lg:block w-[480px] xl:w-[560px] shrink-0 relative">
          <div className="sticky top-20 h-[calc(100vh-5rem)]">
            <div ref={mapContainerRef} className="w-full h-full rounded-xl overflow-hidden border border-black/8 shadow-md" />
          </div>
        </div>
      )}
    </div>
  )
}
