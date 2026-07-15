'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const PIN_HTML = `
  <div class="rny-pin-pulse" style="position:relative;width:40px;height:48px;display:flex;align-items:flex-start;justify-content:center;transform-origin:50% 100%;">
    <div style="width:40px;height:40px;background:#B57F50;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
      <div style="width:11px;height:11px;border-radius:50%;background:white;transform:rotate(45deg)"></div>
    </div>
  </div>
`

// Pin pulses briefly once every 5 seconds to draw the eye to the location.
const PULSE_CSS = `
@keyframes rny-pin-pulse {
  0%, 88%, 100% { transform: scale(1); }
  92% { transform: scale(1.25); }
  96% { transform: scale(0.95); }
}
.rny-pin-pulse { animation: rny-pin-pulse 5s ease-in-out infinite; }
`

const pinIcon = () =>
  L.divIcon({ className: '', html: PIN_HTML, iconSize: [40, 48], iconAnchor: [20, 48], popupAnchor: [0, -50] })

interface Props {
  lat: number
  lng: number
  name: string
  address: string
}

// Full-height single-pin map for the restaurant listing page's right pane —
// a Google-Maps-style view centered on just this one restaurant.
export default function RestaurantMapPane({ lat, lng, name, address }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    if (!document.getElementById('rny-pin-pulse-css')) {
      const style = document.createElement('style')
      style.id = 'rny-pin-pulse-css'
      style.textContent = PULSE_CSS
      document.head.appendChild(style)
    }

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      // Same policy as the searchmap: zoom only via the +/- buttons, and no
      // one-finger drag on touch devices so page scrolling isn't hijacked.
      scrollWheelZoom: false,
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      dragging: !L.Browser.mobile,
      attributionControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.marker([lat, lng], { icon: pinIcon() })
      .addTo(map)
      .bindPopup(
        `<div style="min-width:150px;font-family:sans-serif">
          <strong style="font-size:13px;color:#1E2026">${name}</strong>
          <p style="font-size:11px;color:#666;margin:4px 0 0">${address}</p>
        </div>`,
        { offset: [0, -12] }
      )
      .openPopup()

    mapRef.current = map

    // Leaflet measures the container once at init. In a flex/dynamically-
    // imported pane the container can still be 0-height at that moment, which
    // leaves the map blank (no tiles laid out). Recompute the size after the
    // browser has laid the pane out, and whenever it resizes, so the map
    // always fills its pane instead of collapsing to a blank white box.
    const recalc = () => map.invalidateSize()
    const raf = requestAnimationFrame(recalc)
    const t = setTimeout(recalc, 200)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(recalc) : null
    if (ro && containerRef.current) ro.observe(containerRef.current)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      ro?.disconnect()
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className="w-full h-full min-h-[288px]" />
}
