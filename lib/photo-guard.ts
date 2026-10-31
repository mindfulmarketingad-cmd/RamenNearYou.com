// Google's Place Photo endpoints are billed per fetch, so we never serve them.
// These guards null out any such URL so image components fall back to a local
// placeholder instead of hitting (and getting billed by) Google.
export function isGoogleBilledPhoto(src?: string | null): boolean {
  if (!src) return false
  return (
    src.includes('maps.googleapis.com/maps/api/place/photo') ||
    src.includes('places.googleapis.com') // Places API (New) photo media endpoint
  )
}

export function safePhotoSrc(src?: string | null): string | null {
  return src && !isGoogleBilledPhoto(src) ? src : null
}
