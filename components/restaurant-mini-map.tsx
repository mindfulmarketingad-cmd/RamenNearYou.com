'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const PIN_HTML = `
  <div style="
    position:relative;
    width:36px;height:44px;
    display:flex;align-items:flex-start;justify-content:center;
  ">
    <div style="
      width:36px;height:36px;
      background:#B57F50;
      border:3px solid white;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 3px 10px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
    ">
      <div style="width:9px;height:9px;border-radius:50%;background:white;transform:rotate(45deg)"></div>
    </div>
  </div>
`

const pinIcon = () =>
  L.divIcon({
    className: '',
    html: PIN_HTML,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -46],
  })

interface Props {
  lat: number
  lng: number
  name: string
  address: string
  directionsUrl: string
}

export default function RestaurantMiniMap({ lat, lng, name, address, directionsUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      scrollWheelZoom: false,
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
        `<div style="min-width:140px;font-family:sans-serif">
          <strong style="font-size:13px;color:#1E2026">${name}</strong>
          <p style="font-size:11px;color:#666;margin:4px 0 0">${address}</p>
        </div>`,
        { offset: [0, -10] }
      )
      .openPopup()

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded-xl overflow-hidden border border-white/5">
      {/* Map */}
      <div ref={containerRef} style={{ height: 200 }} className="w-full" />

      {/* Directions bar */}
      <div className="bg-[#1E2026] px-4 py-3 flex items-center justify-between gap-3 border-t border-white/5">
        <div className="min-w-0">
          <p className="text-white text-xs font-semibold truncate">{name}</p>
          <p className="text-[#B0B3BB] text-xs truncate">{address}</p>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B57F50] text-white text-xs font-semibold hover:bg-[#c8934f] transition-colors whitespace-nowrap"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden>
            <path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/>
          </svg>
          Get Directions
        </a>
      </div>
    </div>
  )
}
