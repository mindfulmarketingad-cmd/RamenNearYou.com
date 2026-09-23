import { NextResponse } from 'next/server'

// Lightweight in-process rate limiter (fixed window per key). This is a
// best-effort baseline: on serverless each instance keeps its own counters, so
// it caps abuse from a single client hitting a warm instance and blunts naive
// floods, but it is NOT a hard distributed guarantee. For that, back it with a
// shared store (e.g. Upstash Redis / Vercel KV) — the call sites wouldn't
// change, only the store below.
type Bucket = { count: number; resetAt: number }
const store = new Map<string, Bucket>()

// Bound memory: occasionally drop expired buckets so the map can't grow without
// limit under a spray of unique keys.
let lastSweep = 0
function sweep(now: number) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [k, b] of store) {
    if (b.resetAt <= now) store.delete(k)
  }
}

function hit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  sweep(now)
  const b = store.get(key)
  if (!b || b.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }
  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) }
  }
  b.count++
  return { ok: true, retryAfter: 0 }
}

// Best-effort client IP from the proxy headers Vercel/most hosts set.
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

// Returns a 429 response when the caller is over the limit, or null to proceed.
// `name` namespaces the limit so different endpoints don't share a counter.
export function checkRateLimit(
  req: Request,
  name: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const { ok, retryAfter } = hit(`${name}:${getClientIp(req)}`, limit, windowMs)
  if (ok) return null
  return NextResponse.json(
    { error: 'Too many requests. Please slow down and try again shortly.' },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } },
  )
}
