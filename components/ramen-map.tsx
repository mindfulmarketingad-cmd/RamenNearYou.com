'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Restaurant } from '@/lib/restaurants'

// Fix Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const BOUNCE_CSS = `
@keyframes ramenBounce {
  0%, 100% { margin-top: 0px; }
  50%       { margin-top: -8px; }
}
.marker-bounce { animation: ramenBounce 0.55s ease-in-out infinite; }
`

function makeRatingIcon(rating: number | null, state: 'default' | 'active' | 'hover') {
  const label = rating ? rating.toFixed(1) : '?'
  const bg = state === 'active' ? '#c8934f' : '#B57F50'
  const border = state === 'active' ? '2.5px solid white' : '2px solid white'
  const shadow = state === 'active'
    ? '0 3px 12px rgba(181,127,80,0.75)'
    : '0 2px 6px rgba(0,0,0,0.35)'
  const scale = state === 'active' ? 1.15 : 1
  const bounce = state === 'hover' ? 'marker-bounce' : ''
  return L.divIcon({
    className: bounce,
    html: `<div style="
      display:inline-flex;align-items:center;gap:3px;
      background:${bg};border:${border};border-radius:20px;
      box-shadow:${shadow};
      padding:3px 7px 3px 5px;
      font-family:system-ui,sans-serif;font-size:11px;font-weight:700;color:white;
      white-space:nowrap;
      transform:scale(${scale});transform-origin:bottom center;
      transition:transform 0.15s;
    "><span style="font-size:10px;line-height:1">★</span>${label}</div>`,
    iconSize: [44, 24],
    iconAnchor: [22, 24],
    popupAnchor: [0, -28],
  })
}

const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#B57F50;border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

interface Props {
  restaurants: Restaurant[]
  userLat: number
  userLng: number
  selectedSlug: string | null
  hoveredSlug?: string | null
  onSelect: (slug: string) => void
  onUserMove?: (bounds: MapBounds) => void
  onMapCenter?: (center: { lat: number; lng: number }) => void
  centerLatLng?: { lat: number; lng: number } | null
}

export default function RamenMap({ restaurants, userLat, userLng, selectedSlug, hoveredSlug, onSelect, onUserMove, onMapCenter, centerLatLng }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const ratingsRef = useRef<Record<string, number | null>>({})
  const [ready, setReady] = useState(false)

  // Inject bounce CSS once
  useEffect(() => {
    if (document.getElementById('ramen-bounce-css')) return
    const style = document.createElement('style')
    style.id = 'ramen-bounce-css'
    style.textContent = BOUNCE_CSS
    document.head.appendChild(style)
  }, [])

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      center: [userLat, userLng],
      zoom: 11,
      zoomControl: true,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>Your location</b>')

    L.circle([userLat, userLng], {
      radius: 32187,
      color: '#B57F50',
      fillColor: '#B57F50',
      fillOpacity: 0.05,
      weight: 1.5,
      dashArray: '6 4',
    }).addTo(map)

    mapRef.current = map
    setReady(true)
    return () => { map.remove(); mapRef.current = null }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fly to geocoded location when centerLatLng changes
  useEffect(() => {
    if (!ready || !mapRef.current || !centerLatLng) return
    mapRef.current.flyTo([centerLatLng.lat, centerLatLng.lng], 13, { duration: 1.2 })
  }, [ready, centerLatLng])

  // Add restaurant markers
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}
    ratingsRef.current = {}

    restaurants.forEach((r) => {
      if (!r.latitude || !r.longitude) return
      const state = r.slug === selectedSlug ? 'active' : 'default'
      const icon = makeRatingIcon(r.rating, state)
      ratingsRef.current[r.slug] = r.rating
      const marker = L.marker([r.latitude, r.longitude], { icon, title: r.name })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:160px">
            <strong style="font-size:13px">${r.name}</strong><br/>
            <span style="font-size:11px;color:#888">${r.city}, ${r.stateCode}</span>
            ${r.rating ? `<br/><span style="font-size:11px;color:#B57F50">${r.rating.toFixed(1)} (${r.reviewCount.toLocaleString()})</span>` : ''}
          </div>
        `)
        .on('click', () => onSelect(r.slug))
      markersRef.current[r.slug] = marker
    })
  }, [ready, restaurants, selectedSlug, onSelect])

  // Bounds emit + center callback on user drag
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current
    function emitBounds() {
      if (!mapRef.current) return
      const b = mapRef.current.getBounds()
      onUserMove?.({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() })
    }
    function emitCenter() {
      if (!mapRef.current) return
      const c = mapRef.current.getCenter()
      onMapCenter?.({ lat: c.lat, lng: c.lng })
      emitBounds()
    }
    map.on('dragend', emitCenter)
    map.on('zoomend', emitBounds)
    return () => { map.off('dragend', emitCenter); map.off('zoomend', emitBounds) }
  }, [ready, onUserMove, onMapCenter])

  // Update active marker icon + pan
  useEffect(() => {
    if (!ready || !mapRef.current || !selectedSlug) return
    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      marker.setIcon(makeRatingIcon(ratingsRef.current[slug] ?? null, slug === selectedSlug ? 'active' : 'default'))
    })
    const active = markersRef.current[selectedSlug]
    if (active) {
      mapRef.current.panTo(active.getLatLng(), { animate: true, duration: 0.5 })
      active.openPopup()
    }
  }, [selectedSlug, ready])

  // Bounce hovered marker
  useEffect(() => {
    if (!ready) return
    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      if (slug === selectedSlug) return // active marker takes priority
      marker.setIcon(makeRatingIcon(ratingsRef.current[slug] ?? null, slug === hoveredSlug ? 'hover' : 'default'))
    })
  }, [hoveredSlug, selectedSlug, ready])

  return <div ref={containerRef} className="w-full h-full" />
}
