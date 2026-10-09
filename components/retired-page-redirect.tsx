'use client'

import { useEffect } from 'react'

// Mounted on the 404 page. The site is static, so a page that was retired
// (lib/retired-pages.ts) or a URL shape that used to be served by a server
// route can't 308 from the server: Vercel answers 404, which is what tells
// search engines the page is gone. People who follow an old link are sent on
// to the nearest live page from here instead.
type Data = { redirects: Record<string, string>; modifierPrefixes: string[]; stateCodeToSlug: Record<string, string> }

function targetFor(path: string, d: Data): string | null {
  if (d.redirects[path]) return d.redirects[path]
  const seg = path.split('/').filter(Boolean)
  const stateOf = (cs: string) => d.stateCodeToSlug[cs.slice(cs.lastIndexOf('-') + 1)]
  if (seg[0] === 'find' && seg.length === 2) {
    const prefix = d.modifierPrefixes.find((p) => seg[1].startsWith(`${p}-`))
    if (prefix) return `/find/${seg[1].slice(prefix.length + 1)}`
    const st = stateOf(seg[1])
    return st ? `/${st}` : '/find'
  }
  if (seg[0] === 'reviews' && seg.length === 2) return '/reviews'
  if (seg[0] === 'partners' && seg.length === 2) return '/partners'
  if (seg[0] === 'blog' && seg.length === 2) {
    const m = seg[1].match(/^best-(?:ramen|pho)-restaurants-(.+)$/)
    return m ? `/find/${m[1]}` : '/blog'
  }
  if (['tonkotsu', 'miso', 'spicy', 'vegan'].includes(seg[0]) && seg.length === 3) return `/${seg[2]}`
  if (seg.length === 3 && Object.values(d.stateCodeToSlug).includes(seg[1])) return `/${seg[1]}`
  return null
}

export default function RetiredPageRedirect() {
  useEffect(() => {
    let path = window.location.pathname.replace(/\/+$/, '') || '/'
    try { path = decodeURIComponent(path) } catch { /* use as-is */ }

    // Printed Google Review Card QR codes: /r/{slug} → that restaurant's
    // Google review form.
    const qr = path.match(/^\/r\/([^/]+)$/)
    if (qr) {
      fetch('/data/review-links.json')
        .then((r) => r.json())
        .then((links: Record<string, string>) => window.location.replace(links[qr[1]] ?? '/'))
        .catch(() => {})
      return
    }

    fetch('/data/retired-redirects.json')
      .then((r) => r.json())
      .then((d: Data) => {
        const to = targetFor(path, d)
        if (to && to !== path) window.location.replace(to)
      })
      .catch(() => {})
  }, [])
  return null
}
