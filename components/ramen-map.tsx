'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Structural subset of a restaurant the map needs — satisfied by both the full
// Restaurant type (/searchmap) and the slim MapPoint type (homepage hero).
export type MapRestaurant = {
  name: string
  slug: string
  city: string
  stateCode: string
  latitude: number | null
  longitude: number | null
  rating: number | null
  reviewCount: number
}

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

function makeRatingIcon(rating: number | null, state: 'default' | 'active' | 'hover', accent = '#B57F50', visited = false) {
  const label = rating ? rating.toFixed(1) : '?'
  const bg = state === 'active' ? shade(accent, -18) : accent
  const border = state === 'active' ? '2.5px solid white' : '2px solid white'
  const shadow = state === 'active'
    ? `0 3px 12px ${hexToRgba(accent, 0.75)}`
    : '0 2px 6px rgba(0,0,0,0.35)'
  const scale = state === 'active' ? 1.15 : 1
  const bounce = state === 'hover' ? 'marker-bounce' : ''
  const check = visited
    ? `<span style="position:absolute;top:-6px;right:-6px;width:14px;height:14px;border-radius:50%;background:#16a34a;border:1.5px solid white;display:flex;align-items:center;justify-content:center;font-size:9px;line-height:1;color:white">✓</span>`
    : ''
  return L.divIcon({
    className: bounce,
    html: `<div style="position:relative;
      display:inline-flex;align-items:center;gap:3px;
      background:${bg};border:${border};border-radius:20px;
      box-shadow:${shadow};
      padding:3px 7px 3px 5px;
      font-family:system-ui,sans-serif;font-size:11px;font-weight:700;color:white;
      white-space:nowrap;
      transform:scale(${scale});transform-origin:bottom center;
      transition:transform 0.15s;
    "><span style="font-size:10px;line-height:1">★</span>${label}${check}</div>`,
    iconSize: [44, 24],
    iconAnchor: [22, 24],
    popupAnchor: [0, -28],
  })
}

// Small color utilities so pins can match the active filter color.
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
function hexToRgba(hex: string, a: number): string {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${a})`
}
function shade(hex: string, percent: number): string {
  const [r, g, b] = hexToRgb(hex)
  const t = percent < 0 ? 0 : 255
  const p = Math.abs(percent) / 100
  const c = (x: number) => Math.round((t - x) * p + x)
  return `#${[c(r), c(g), c(b)].map(x => x.toString(16).padStart(2, '0')).join('')}`
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
  restaurants: MapRestaurant[]
  userLat: number
  userLng: number
  selectedSlug: string | null
  hoveredSlug?: string | null
  onSelect: (slug: string) => void
  onUserMove?: (bounds: MapBounds) => void
  onMapCenter?: (center: { lat: number; lng: number }) => void
  centerLatLng?: { lat: number; lng: number } | null
  accentColor?: string
  heatmap?: boolean
  visitedSlugs?: Set<string>
}

export default function RamenMap({ restaurants, userLat, userLng, selectedSlug, hoveredSlug, onSelect, onUserMove, onMapCenter, centerLatLng, accentColor = '#B57F50', heatmap = false, visitedSlugs }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const ratingsRef = useRef<Record<string, number | null>>({})
  const heatLayerRef = useRef<L.LayerGroup | null>(null)
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

  // Add restaurant markers (hidden while heatmap mode is active)
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}
    ratingsRef.current = {}

    if (heatmap) return // heatmap layer handles visualization instead

    restaurants.forEach((r) => {
      if (!r.latitude || !r.longitude) return
      const state = r.slug === selectedSlug ? 'active' : 'default'
      const icon = makeRatingIcon(r.rating, state, accentColor, visitedSlugs?.has(r.slug))
      ratingsRef.current[r.slug] = r.rating
      const marker = L.marker([r.latitude, r.longitude], { icon, title: r.name })
        .addTo(map)
        .bindPopup(`
          <div style="min-width:160px">
            <strong style="font-size:13px">${r.name}</strong><br/>
            <span style="font-size:11px;color:#888">${r.city}, ${r.stateCode}</span>
            ${r.rating ? `<br/><span style="font-size:11px;color:${accentColor}">${r.rating.toFixed(1)}${r.reviewCount ? ` (${r.reviewCount.toLocaleString()})` : ''}</span>` : ''}
          </div>
        `)
        .on('click', () => onSelect(r.slug))
      markersRef.current[r.slug] = marker
    })
  }, [ready, restaurants, selectedSlug, onSelect, accentColor, heatmap, visitedSlugs])

  // Heatmap layer — density-based warm blobs that make the map feel alive.
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    if (heatLayerRef.current) { heatLayerRef.current.remove(); heatLayerRef.current = null }
    if (!heatmap) return

    const pts = restaurants.filter(r => r.latitude && r.longitude)
    // Local density: neighbors within ~0.05° (~5km). Hotter = more spots nearby.
    const group = L.layerGroup()
    pts.forEach((r) => {
      let density = 0
      for (const o of pts) {
        if (Math.abs(o.latitude! - r.latitude!) < 0.05 && Math.abs(o.longitude! - r.longitude!) < 0.05) density++
      }
      const t = Math.min(density / 12, 1) // 0..1 heat
      const color = t > 0.66 ? '#dc2626' : t > 0.33 ? '#f97316' : '#fcd34d'
      L.circleMarker([r.latitude!, r.longitude!], {
        radius: 16 + t * 14,
        stroke: false,
        fillColor: color,
        fillOpacity: 0.28,
      })
        .on('click', () => onSelect(r.slug))
        .addTo(group)
    })
    group.addTo(map)
    heatLayerRef.current = group
  }, [ready, heatmap, restaurants, onSelect])

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
      marker.setIcon(makeRatingIcon(ratingsRef.current[slug] ?? null, slug === selectedSlug ? 'active' : 'default', accentColor, visitedSlugs?.has(slug)))
    })
    const active = markersRef.current[selectedSlug]
    if (active) {
      mapRef.current.panTo(active.getLatLng(), { animate: true, duration: 0.5 })
      active.openPopup()
    }
  }, [selectedSlug, ready, accentColor, visitedSlugs])

  // Bounce hovered marker
  useEffect(() => {
    if (!ready) return
    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      if (slug === selectedSlug) return // active marker takes priority
      marker.setIcon(makeRatingIcon(ratingsRef.current[slug] ?? null, slug === hoveredSlug ? 'hover' : 'default', accentColor, visitedSlugs?.has(slug)))
    })
  }, [hoveredSlug, selectedSlug, ready, accentColor, visitedSlugs])

  return <div ref={containerRef} className="w-full h-full" />
}
