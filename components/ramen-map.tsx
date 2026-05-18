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

const userIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:18px;height:18px;border-radius:50%;
    background:#77567A;border:3px solid white;
    box-shadow:0 2px 8px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const restaurantIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;border-radius:50% 50% 50% 0;
    background:#77567A;border:2px solid white;
    transform:rotate(-45deg);
    box-shadow:0 2px 6px rgba(0,0,0,0.35);
    display:flex;align-items:center;justify-content:center;
  "><span style="transform:rotate(45deg);font-size:14px;line-height:1">🍜</span></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -34],
})

const restaurantIconActive = L.divIcon({
  className: '',
  html: `<div style="
    width:36px;height:36px;border-radius:50% 50% 50% 0;
    background:#b07db5;border:3px solid white;
    transform:rotate(-45deg);
    box-shadow:0 2px 10px rgba(119,86,122,0.7);
    display:flex;align-items:center;justify-content:center;
  "><span style="transform:rotate(45deg);font-size:15px;line-height:1">🍜</span></div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
})

interface Props {
  restaurants: Restaurant[]
  userLat: number
  userLng: number
  selectedSlug: string | null
  onSelect: (slug: string) => void
}

export default function RamenMap({ restaurants, userLat, userLng, selectedSlug, onSelect }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const [ready, setReady] = useState(false)

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

    // User location marker
    L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>Your location</b>')

    // 20-mile radius circle (~32km)
    L.circle([userLat, userLng], {
      radius: 32187,
      color: '#77567A',
      fillColor: '#77567A',
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

    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}

    restaurants.forEach((r) => {
      if (!r.latitude || !r.longitude) return
      const marker = L.marker([r.latitude, r.longitude], {
        icon: r.slug === selectedSlug ? restaurantIconActive : restaurantIcon,
        title: r.name,
      })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:160px">
            <strong style="font-size:13px">${r.name}</strong><br/>
            <span style="font-size:11px;color:#888">${r.city}, ${r.stateCode}</span>
            ${r.rating ? `<br/><span style="font-size:11px">⭐ ${r.rating.toFixed(1)} (${r.reviewCount.toLocaleString()})</span>` : ''}
          </div>
        `)
        .on('click', () => onSelect(r.slug))
      markersRef.current[r.slug] = marker
    })
  }, [ready, restaurants, selectedSlug, onSelect])

  // Update active marker icon + pan to it
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

  return <div ref={containerRef} className="w-full h-full" />
}
