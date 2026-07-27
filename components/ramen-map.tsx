'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { MatchedChip } from '@/lib/ramen-taxonomy'

// Structural subset of a restaurant the map needs — satisfied by both the full
// Restaurant type (/searchmap) and the slim MapPoint type (homepage hero).
export type MapRestaurant = {
  name: string
  slug: string
  citySlug: string
  stateSlug: string
  city: string
  stateCode: string
  latitude: number | null
  longitude: number | null
  rating: number | null
  reviewCount: number
  website?: string        // restaurant's own website (DB entries only)
  featured?: boolean      // promoted listing — gold pin, shown above the rest
  claimed?: boolean       // approved ownership claim — blue pin (unless also featured)
  matchedChips?: MatchedChip[] // active filters this result satisfied — shown as colored badges in the popup
}

// Fix Leaflet default marker icons in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const BOUNCE_CSS = `
@keyframes ramenFeaturedGlow {
  0%, 100% { box-shadow: 0 3px 14px rgba(212,136,11,0.75), 0 0 0 0 rgba(245,179,1,0.55); }
  50%       { box-shadow: 0 3px 18px rgba(212,136,11,0.9), 0 0 0 8px rgba(245,179,1,0); }
}
.ramen-featured-pin { animation: ramenFeaturedGlow 1.8s ease-in-out infinite; }
/* Zoom control lives bottom-left (see zoomControl: false + L.control.zoom
   below) so it never sits under the filter bar on mobile — pushed up just
   above the Satellite toggle button instead of Leaflet's default corner. */
.leaflet-control-zoom { margin-bottom: 64px !important; }
`

function makeRatingIcon(rating: number | null, state: 'default' | 'active' | 'hover', accent = '#B57F50', visited = false, featured = false, claimed = false) {
  const label = rating ? rating.toFixed(1) : '?'
  // Featured listings get a gold gradient pin that stands out from the rest;
  // claimed/verified listings (that aren't also featured) get blue instead
  // of the default brand color, so a verified business stands out on the map.
  // 'active' (selected) and 'hover' (card/pin hovered) both render "raised" —
  // darker fill, thicker border, deeper shadow, and scaled up — so the pin
  // clearly stands out from the rest.
  const isActive = state === 'active'
  const isHover = state === 'hover'
  const raised = isActive || isHover
  const bg = featured
    ? 'linear-gradient(135deg,#f5b301,#d4880b)'
    : claimed
      ? (raised ? shade('#2563eb', -18) : '#2563eb')
      : raised ? shade(accent, -18) : accent
  const border = featured ? '2.5px solid #fff7e0' : raised ? '2.5px solid white' : '2px solid white'
  const shadow = featured
    ? '0 3px 14px rgba(212,136,11,0.75)'
    : isHover
      ? `0 6px 18px rgba(0,0,0,0.45), 0 0 0 3px ${hexToRgba(claimed ? '#2563eb' : accent, 0.35)}`
      : claimed
        ? '0 2px 8px rgba(37,99,235,0.5)'
        : isActive
          ? `0 3px 12px ${hexToRgba(accent, 0.75)}`
          : '0 2px 6px rgba(0,0,0,0.35)'
  // Hover pops a touch larger than the selected state so it reads instantly.
  const scale = featured ? 1.4 : isHover ? 1.3 : isActive ? 1.15 : 1
  const check = visited
    ? `<span style="position:absolute;top:-6px;right:-6px;width:14px;height:14px;border-radius:50%;background:#16a34a;border:1.5px solid white;display:flex;align-items:center;justify-content:center;font-size:9px;line-height:1;color:white">✓</span>`
    : ''
  // Crown badge marks the featured pin.
  const crown = featured
    ? `<span style="position:absolute;top:-9px;left:50%;transform:translateX(-50%);font-size:11px;line-height:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,0.3))">👑</span>`
    : ''
  return L.divIcon({
    className: '',
    html: `<div class="${featured ? 'ramen-featured-pin' : ''}" style="position:relative;
      display:inline-flex;align-items:center;gap:3px;
      background:${bg};border:${border};border-radius:20px;
      box-shadow:${shadow};
      padding:3px 7px 3px 5px;
      font-family:system-ui,sans-serif;font-size:11px;font-weight:700;color:white;
      white-space:nowrap;
      transform:scale(${scale});transform-origin:bottom center;
      transition:transform 0.15s;
      z-index:${featured ? 1000 : raised ? 900 : claimed ? 500 : 'auto'};
    ">${crown}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="flex-shrink:0" xmlns="http://www.w3.org/2000/svg"><path d="M9 3.5c.6.6 1 1.4 1 2M12 3c.6.6 1 1.4 1 2M15 3.5c.6.6 1 1.4 1 2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M3 11h18a1 1 0 011 1c0 5.5-4.9 9-10 9s-10-3.5-10-9a1 1 0 011-1z" fill="currentColor"/></svg>${label}${check}</div>`,
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

// Tiny blue dot marking the visitor's exact (GPS-resolved) position — distinct
// from the brown userIcon above, which marks the search's center point and
// may just be a city estimate. Mirrors the pulsing blue dot already used for
// "detected area" in the location picker, for a consistent visual language.
const exactLocationIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative;width:16px;height:16px;">
    <span class="animate-ping" style="position:absolute;inset:0;border-radius:50%;background:#3b82f6;opacity:0.6;"></span>
    <span style="position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></span>
  </div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
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
  initialZoom?: number
  selectedSlug: string | null
  hoveredSlug?: string | null
  onSelect: (slug: string) => void
  // Fired when the pointer enters/leaves an actual map pin (null on leave) —
  // lets the page sync its own hoveredSlug state (e.g. to also highlight a
  // matching list row) with hover that originates on the map itself.
  onMarkerHover?: (slug: string | null) => void
  onUserMove?: (bounds: MapBounds) => void
  onMapCenter?: (center: { lat: number; lng: number }) => void
  centerLatLng?: { lat: number; lng: number } | null
  userLocation?: { lat: number; lng: number } | null
  // Called by the "your location" button when we don't yet have the visitor's
  // position — lets the page kick off the geolocation request.
  onLocateRequest?: () => void
  accentColor?: string
  heatmap?: boolean
  visitedSlugs?: Set<string>
  boundary?: unknown | null   // GeoJSON Polygon/MultiPolygon — city outline (Zillow-style)
  // Suppress the built-in Leaflet popup on marker click — used in mapOnly
  // layouts where a richer detail card renders outside the map instead.
  disablePopups?: boolean
}

export default function RamenMap({ restaurants, userLat, userLng, initialZoom = 11, selectedSlug, hoveredSlug, onSelect, onMarkerHover, onUserMove, onMapCenter, centerLatLng, userLocation, onLocateRequest, accentColor = '#B57F50', heatmap = false, visitedSlugs, boundary, disablePopups = false }: Props) {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<Record<string, L.Marker>>({})
  const ratingsRef = useRef<Record<string, number | null>>({})
  const featuredRef = useRef<Record<string, boolean>>({})
  const claimedRef = useRef<Record<string, boolean>>({})
  const heatLayerRef = useRef<L.LayerGroup | null>(null)
  const boundaryRef = useRef<L.GeoJSON | null>(null)
  const userCircleRef = useRef<L.Circle | null>(null)
  const exactLocationMarkerRef = useRef<L.Marker | null>(null)
  // Mirrors the userLocation prop for use inside marker event handlers set up
  // by the (rarely-rerun) marker-creation effect, which would otherwise close
  // over a stale value.
  const userLocationRef = useRef<{ lat: number; lng: number } | null>(null)
  const baseLayerRef = useRef<L.TileLayer | null>(null)
  const overlayLayersRef = useRef<L.TileLayer[]>([])
  const [ready, setReady] = useState(false)
  const [view, setView] = useState<'standard' | 'satellite'>('standard')

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
      zoom: initialZoom,
      // Default top-left zoom control sits under the floating filter bar on
      // mobile — moved to bottom-left (see CSS above), right above the
      // Satellite toggle, instead.
      zoomControl: false,
      // Zoom ONLY via the +/- buttons — scroll-wheel, pinch, and double-tap
      // zoom all hijack normal page scrolling (especially on mobile).
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      // One-finger drag pans the map (Google-Maps-app style) on touch too —
      // the mobile map is a bounded box stacked above the list, so panning it
      // no longer traps page scrolling (scroll starts from the list below).
      // Pinch-to-zoom stays on so the gesture feels natural; the page still
      // scrolls with a normal one-finger swipe outside the map.
      dragging: true,
      touchZoom: true,
    })
    L.control.zoom({ position: 'bottomleft' }).addTo(map)
    // Base tile layer (standard vs. satellite) is managed by a separate effect.

    L.marker([userLat, userLng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<b>Your location</b>')

    userCircleRef.current = L.circle([userLat, userLng], {
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

  // Base map style — standard (OpenStreetMap) or satellite (Esri World Imagery
  // with a street/place-name label overlay so the hybrid view stays readable).
  // All sources are free and need no API key.
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    if (baseLayerRef.current) { baseLayerRef.current.remove(); baseLayerRef.current = null }
    overlayLayersRef.current.forEach(l => l.remove())
    overlayLayersRef.current = []

    if (view === 'satellite') {
      baseLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' },
      ).addTo(map)
      // Hybrid labels: place names + roads, designed to overlay imagery.
      overlayLayersRef.current = [
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(map),
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(map),
      ]
    } else {
      baseLayerRef.current = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)
    }
    // Keep the base/overlays beneath markers and the boundary.
    baseLayerRef.current.setZIndex(0)
    overlayLayersRef.current.forEach(l => l.setZIndex(1))
  }, [ready, view])

  // Fly to geocoded location when centerLatLng changes
  useEffect(() => {
    if (!ready || !mapRef.current || !centerLatLng) return
    mapRef.current.flyTo([centerLatLng.lat, centerLatLng.lng], 13, { duration: 1.2 })
  }, [ready, centerLatLng])

  // Fly to user's GPS location when geolocation is granted
  useEffect(() => {
    if (!ready || !mapRef.current || !userLocation) return
    mapRef.current.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 1.2 })
  }, [ready, userLocation])

  // Tiny blue "you are here" dot at the visitor's exact GPS position, and
  // keep a ref mirror for the marker hover handlers below.
  useEffect(() => {
    userLocationRef.current = userLocation ?? null
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    if (!userLocation) {
      exactLocationMarkerRef.current?.remove()
      exactLocationMarkerRef.current = null
      return
    }

    if (exactLocationMarkerRef.current) {
      exactLocationMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng])
    } else {
      exactLocationMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
        icon: exactLocationIcon,
        zIndexOffset: 20000, // always above every restaurant pin
        interactive: false,
      }).addTo(map)
    }
  }, [ready, userLocation])

  // Add restaurant markers (hidden while heatmap mode is active). No
  // clustering — every pin renders individually at every zoom level.
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    Object.values(markersRef.current).forEach(m => m.remove())
    markersRef.current = {}
    ratingsRef.current = {}
    featuredRef.current = {}
    claimedRef.current = {}

    if (heatmap) return // heatmap layer handles visualization instead

    restaurants.forEach((r) => {
      if (!r.latitude || !r.longitude) return
      const state = r.slug === selectedSlug ? 'active' : 'default'
      const icon = makeRatingIcon(r.rating, state, accentColor, visitedSlugs?.has(r.slug), r.featured, r.claimed)
      ratingsRef.current[r.slug] = r.rating
      featuredRef.current[r.slug] = !!r.featured
      claimedRef.current[r.slug] = !!r.claimed

      // Every restaurant — DB or Google Places supplement — has its own
      // internal detail page, so the popup always links there.
      const siteUrl = `/${r.citySlug}/${r.stateSlug}/${r.slug}`
      const linkTarget = '_self'

      const chipsHtml = (r.matchedChips ?? []).length > 0
        ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:4px">${(r.matchedChips ?? []).map(c =>
            `<span style="display:inline-flex;align-items:center;gap:2px;padding:1px 6px;border-radius:999px;font-size:9px;font-weight:600;background:${c.hex}1a;color:${c.hex};border:1px solid ${c.hex}40">${c.emoji} ${c.label}</span>`
          ).join('')}</div>`
        : ''

      // Leaflet auto-stacks markers by screen Y-position (lower pins paint on
      // top), which can bury a featured/claimed pin behind ordinary ones
      // regardless of the z-index in its own icon HTML. zIndexOffset
      // overrides that so featured pins paint above everything, and claimed
      // (verified) pins paint above ordinary ones but still behind featured.
      const zIndexOffset = r.featured ? 10000 : r.claimed ? 5000 : 0
      const marker = L.marker([r.latitude, r.longitude], { icon, title: r.name, zIndexOffset }).addTo(map)
      if (!disablePopups) {
        marker
          .bindPopup(`
            <div style="min-width:160px">
              ${r.featured ? `<span style="display:inline-block;font-size:9px;font-weight:700;color:#d4880b;background:#fff7e0;border:1px solid #f5b301;border-radius:4px;padding:1px 5px;margin-bottom:3px">👑 FEATURED</span><br/>` : ''}
              <a href="${siteUrl}" target="${linkTarget}" rel="noopener noreferrer" data-ramen-slug="${r.slug}" style="font-size:13px;font-weight:600;color:#1E2026;text-decoration:none;cursor:pointer" onmouseover="this.style.color='#B57F50'" onmouseout="this.style.color='#1E2026'">${r.name}</a><br/>
              <span style="font-size:11px;color:#888">${r.city}, ${r.stateCode}</span>
              ${r.rating ? `<br/><span style="font-size:11px;color:${accentColor}">${r.rating.toFixed(1)}${r.reviewCount ? ` (${r.reviewCount.toLocaleString()})` : ''}</span>` : ''}
              ${chipsHtml}
            </div>
          `)
          .on('popupopen', () => {
            const el = marker.getPopup()?.getElement()?.querySelector<HTMLAnchorElement>('[data-ramen-slug]')
            if (el) {
              el.addEventListener('click', () => onSelect(r.slug), { once: true })
            }
          })
      }
      marker.on('click', () => onSelect(r.slug))

      marker.on('mouseover', () => onMarkerHover?.(r.slug))
      marker.on('mouseout', () => onMarkerHover?.(null))

      markersRef.current[r.slug] = marker
    })
  }, [ready, restaurants, selectedSlug, onSelect, accentColor, heatmap, visitedSlugs, onMarkerHover])

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

  // City boundary outline (Zillow-style). Draws a blue polygon and fits the map
  // to it; hides the default radius circle so the view stays clean.
  useEffect(() => {
    if (!ready || !mapRef.current) return
    const map = mapRef.current

    if (boundaryRef.current) { boundaryRef.current.remove(); boundaryRef.current = null }
    if (!boundary) {
      // No boundary → restore the radius circle if it was hidden.
      if (userCircleRef.current && !map.hasLayer(userCircleRef.current)) userCircleRef.current.addTo(map)
      return
    }

    try {
      const layer = L.geoJSON(boundary as Parameters<typeof L.geoJSON>[0], {
        style: {
          color: '#B57F50',
          weight: 2.5,
          opacity: 0.9,
          fillColor: '#B57F50',
          fillOpacity: 0.05,
        },
        interactive: false,
      })
      layer.addTo(map)
      boundaryRef.current = layer
      // The city outline replaces the generic radius circle.
      if (userCircleRef.current) userCircleRef.current.remove()
      const b = layer.getBounds()
      if (b.isValid()) map.fitBounds(b, { padding: [24, 24] })
    } catch {
      // Malformed geometry — fail silently and keep the default view.
    }
  }, [ready, boundary])

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
    // Report the initial viewport so bounds-based features (e.g. "update
    // results as I move the map") have data before the first pan/zoom.
    emitBounds()
    return () => { map.off('dragend', emitCenter); map.off('zoomend', emitBounds) }
  }, [ready, onUserMove, onMapCenter])

  // Update active marker icon + pan
  useEffect(() => {
    if (!ready || !mapRef.current || !selectedSlug) return
    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      marker.setIcon(makeRatingIcon(ratingsRef.current[slug] ?? null, slug === selectedSlug ? 'active' : 'default', accentColor, visitedSlugs?.has(slug), featuredRef.current[slug], claimedRef.current[slug]))
    })
    const active = markersRef.current[selectedSlug]
    if (active) {
      mapRef.current.panTo(active.getLatLng(), { animate: true, duration: 0.5 })
      active.openPopup()
    }
  }, [selectedSlug, ready, accentColor, visitedSlugs])

  // Highlight the hovered marker (from a card or the pin itself) and lift it
  // above its neighbours so it's never buried behind other pins.
  useEffect(() => {
    if (!ready) return
    Object.entries(markersRef.current).forEach(([slug, marker]) => {
      if (slug === selectedSlug) return // active marker takes priority
      const isHover = slug === hoveredSlug
      marker.setIcon(makeRatingIcon(ratingsRef.current[slug] ?? null, isHover ? 'hover' : 'default', accentColor, visitedSlugs?.has(slug), featuredRef.current[slug], claimedRef.current[slug]))
      const base = featuredRef.current[slug] ? 10000 : claimedRef.current[slug] ? 5000 : 0
      marker.setZIndexOffset(isHover ? 20000 : base)
    })
  }, [hoveredSlug, selectedSlug, ready, accentColor, visitedSlugs])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {ready && (
        <button
          type="button"
          onClick={() => setView(v => (v === 'standard' ? 'satellite' : 'standard'))}
          aria-pressed={view === 'satellite'}
          className="absolute bottom-5 left-3 z-[1000] flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/95 hover:bg-white text-[#1E2026] text-xs font-semibold shadow-md border border-black/10 transition-colors"
        >
          {view === 'standard' ? '🛰️ Satellite' : '🗺️ Standard'}
        </button>
      )}

      {/* Recenter to the visitor's exact location — flies there if we already
          have it, otherwise asks the page to request geolocation. */}
      {ready && (
        <button
          type="button"
          onClick={() => {
            const loc = userLocationRef.current
            if (loc && mapRef.current) {
              mapRef.current.flyTo([loc.lat, loc.lng], 15, { duration: 1 })
            } else {
              onLocateRequest?.()
            }
          }}
          aria-label="Center map on my location"
          className="absolute bottom-5 right-3 z-[1000] flex items-center justify-center w-11 h-11 rounded-full bg-white/95 hover:bg-white text-[#1E2026] shadow-md border border-black/10 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>
        </button>
      )}
    </div>
  )
}
