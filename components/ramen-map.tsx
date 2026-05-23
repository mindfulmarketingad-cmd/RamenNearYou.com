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

function makeIcon(size: number, bg: string, border: string, shadow: string, dotSize: number, extraClass = '') {
  return L.divIcon({
    className: extraClass,
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;
      background:${bg};border:${border};
      transform:rotate(-45deg);
      box-shadow:${shadow};
      display:flex;align-items:center;justify-content:center;
    "><div style="width:${dotSize}px;height:${dotSize}px;border-radius:50%;background:white;transform:rotate(45deg)"></div></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -(size + 2)],
  })
}

const restaurantIcon       = makeIcon(32, '#B57F50', '2px solid white', '0 2px 6px rgba(0,0,0,0.35)', 8)
const restaurantIconActive = makeIcon(36, '#c8934f', '3px solid white', '0 2px 10px rgba(181,127,80,0.7)', 9)
const restaurantIconHover  = makeIcon(32, '#B57F50', '2px solid white', '0 2px 6px rgba(0,0,0,0.35)', 8, 'marker-bounce')

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
}

export default function RamenMap({ restaurants, userLat, userLng, selectedSlug, hoveredSlug, onSelect, onUserMove }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
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

  // Add restaurant markers
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}

    restaurants.forEach((r) => {
      if (!r.latitude || !r.longitude) return
      const icon = r.slug === selectedSlug ? restaurantIconActive : restaurantIcon
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

  // Bounds emit
  useEffect(() => {
    if (!ready || !mapRef.current || !onUserMove) return
    const map = mapRef.current
    function emit() {
      if (!mapRef.current) return
      const b = mapRef.current.getBounds()
      onUserMove?.({ north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() })
    }
    map.on('dragend', emit)
    map.on('zoomend', emit)
    return () => { map.off('dragend', emit); map.off('zoomend', emit) }
  }, [ready, onUserMove])

  // Update active marker icon + pan
  useEffect(() => {
    if (!ready || !mapRef.current || !selectedSlug) return
    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      marker.setIcon(slug === selectedSlug ? restaurantIconActive : restaurantIcon)
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
      marker.setIcon(slug === hoveredSlug ? restaurantIconHover : restaurantIcon)
    })
  }, [hoveredSlug, selectedSlug, ready])

  return <div ref={containerRef} className="w-full h-full" />
}
