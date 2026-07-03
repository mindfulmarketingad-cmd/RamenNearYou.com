'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const PIN_HTML = `
  <div style="position:relative;width:40px;height:48px;display:flex;align-items:flex-start;justify-content:center;">
    <div style="width:40px;height:40px;background:#B57F50;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
      <div style="width:11px;height:11px;border-radius:50%;background:white;transform:rotate(45deg)"></div>
    </div>
  </div>
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

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: true,
      dragging: true,
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
    return () => { map.remove(); mapRef.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className="w-full h-full" />
}
