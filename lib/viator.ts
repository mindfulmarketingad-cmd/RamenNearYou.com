// Viator Partner API v2 client.
//
// Only used by scripts/sync-viator.mjs at build/sync time — never at request
// time. The site renders from the committed snapshot in
// lib/viator-experiences.json, which means:
//   - no API key is needed on Vercel,
//   - every /experiences page can be statically generated,
//   - a Viator outage or rate limit can't take the section down.
//
// Docs: https://docs.viator.com/partner-api/affiliate/technical/

export const VIATOR_BASE = 'https://api.viator.com/partner'

/** Sent on every product link so Viator attributes the click to this account. */
export const AFFILIATE_PARAMS = {
  pid: 'P00320180',
  mcid: '42383',
  medium: 'link',
} as const

// ---------------------------------------------------------------------------
// Response shapes (only the fields we actually consume)
// ---------------------------------------------------------------------------

export interface ViatorImageVariant {
  height: number
  width: number
  url: string
}

export interface ViatorImage {
  imageSource?: string
  caption?: string
  isCover?: boolean
  variants?: ViatorImageVariant[]
}

export interface ViatorProduct {
  productCode: string
  title: string
  description?: string
  images?: ViatorImage[]
  reviews?: { totalReviews?: number; combinedAverageRating?: number }
  duration?: { fixedDurationInMinutes?: number; variableDurationFromMinutes?: number; variableDurationToMinutes?: number }
  pricing?: { summary?: { fromPrice?: number; fromPriceBeforeDiscount?: number }; currency?: string }
  productUrl?: string
  destinations?: { ref: string; primary?: boolean }[]
  flags?: string[]
  tags?: number[]
}

export interface ViatorDestination {
  destinationId: number
  name: string
  type: string
  parentDestinationId?: number
  /** Dot-separated ancestry, e.g. "8.77.602" — root first. */
  lookupId?: string
  center?: { latitude: number; longitude: number }
}

// ---------------------------------------------------------------------------
// Image selection
// ---------------------------------------------------------------------------

/**
 * Largest variant of the cover image (or the first image), capped so we don't
 * ship a 2000px original into a card. Returns null when a product has no
 * usable photo — callers fall back rather than rendering a broken <img>.
 */
export function pickImage(images: ViatorImage[] | undefined, maxWidth = 900): string | null {
  if (!images?.length) return null
  const img = images.find((i) => i.isCover) ?? images[0]
  const variants = (img.variants ?? []).filter((v) => v.url)
  if (variants.length === 0) return img.imageSource ?? null

  // Prefer the widest variant that still fits under maxWidth; if every variant
  // is larger than that, take the smallest of them.
  const under = variants.filter((v) => v.width <= maxWidth).sort((a, b) => b.width - a.width)
  if (under.length > 0) return under[0].url
  return [...variants].sort((a, b) => a.width - b.width)[0].url
}

/** Every usable photo, largest-first, for the detail page gallery. */
export function galleryImages(images: ViatorImage[] | undefined, limit = 6): string[] {
  if (!images?.length) return []
  const out: string[] = []
  for (const img of images) {
    const url = pickImage([img], 1200)
    if (url && !out.includes(url)) out.push(url)
    if (out.length >= limit) break
  }
  return out
}

// ---------------------------------------------------------------------------
// Links
// ---------------------------------------------------------------------------

/** Appends the affiliate params to a Viator productUrl, preserving any it has. */
export function affiliateUrl(productUrl: string): string {
  try {
    const u = new URL(productUrl)
    for (const [k, v] of Object.entries(AFFILIATE_PARAMS)) u.searchParams.set(k, v)
    return u.toString()
  } catch {
    return productUrl
  }
}

// ---------------------------------------------------------------------------
// Slugs
// ---------------------------------------------------------------------------

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')
}

/**
 * Product slug. The productCode suffix is deliberate: Viator titles collide
 * ("Ramen Making Class") and can be edited by the supplier at any time, so a
 * title-only slug would break links the moment a title changes. The code is
 * stable for the life of the product.
 */
export function productSlug(p: { title: string; productCode: string }): string {
  return `${slugify(p.title)}-${p.productCode.toLowerCase()}`
}

// ---------------------------------------------------------------------------
// Fetch (sync-time only)
// ---------------------------------------------------------------------------

export class ViatorError extends Error {
  constructor(message: string, readonly status?: number, readonly body?: string) {
    super(message)
    this.name = 'ViatorError'
  }
}

interface RequestOpts {
  apiKey: string
  path: string
  method?: 'GET' | 'POST'
  body?: unknown
  /** Retries on 429 and 5xx with exponential backoff. */
  retries?: number
  timeoutMs?: number
}

export async function viatorFetch<T>({
  apiKey,
  path,
  method = 'GET',
  body,
  retries = 4,
  timeoutMs = 30_000,
}: RequestOpts): Promise<T> {
  let lastErr: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), timeoutMs)
    try {
      const res = await fetch(`${VIATOR_BASE}${path}`, {
        method,
        headers: {
          'exp-api-key': apiKey,
          // The version header is required; without it the API 400s.
          Accept: 'application/json;version=2.0',
          'Accept-Language': 'en-US',
          ...(body ? { 'Content-Type': 'application/json;version=2.0' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: ctrl.signal,
      })

      if (res.ok) return (await res.json()) as T

      const text = await res.text().catch(() => '')

      // 429 and 5xx are worth retrying; 4xx otherwise means the request is
      // wrong and retrying just burns quota.
      if (res.status !== 429 && res.status < 500) {
        throw new ViatorError(`Viator ${method} ${path} → ${res.status}`, res.status, text.slice(0, 500))
      }
      lastErr = new ViatorError(`Viator ${method} ${path} → ${res.status}`, res.status, text.slice(0, 500))
    } catch (err) {
      if (err instanceof ViatorError && err.status && err.status < 500 && err.status !== 429) throw err
      lastErr = err
    } finally {
      clearTimeout(timer)
    }

    if (attempt < retries) {
      const wait = Math.min(2 ** attempt * 1000, 16_000)
      await new Promise((r) => setTimeout(r, wait))
    }
  }

  throw lastErr instanceof Error ? lastErr : new ViatorError(`Viator ${method} ${path} failed`)
}
