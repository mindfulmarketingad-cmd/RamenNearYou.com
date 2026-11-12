import data from '@/lib/retired-pages.json'
import { FIND_MODIFIERS } from '@/lib/find-modifiers'
import { STATE_SLUG_TO_CODE } from '@/lib/state-lookups'

// Read by the 404 page (components/retired-page-redirect.tsx) to send a
// visitor who lands on a retired page to its nearest live parent. Retired
// pages answer 404 — removed, as far as search engines are concerned — and
// only people get forwarded.
export const dynamic = 'force-static'

export function GET() {
  return Response.json({
    redirects: data.redirects,
    modifierPrefixes: FIND_MODIFIERS.map((m) => m.prefix),
    stateCodeToSlug: Object.fromEntries(Object.entries(STATE_SLUG_TO_CODE).map(([slug, code]) => [code.toLowerCase(), slug])),
  })
}
