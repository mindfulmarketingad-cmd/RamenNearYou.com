import { FIND_MODIFIERS } from '@/lib/find-modifiers'
import { STATE_SLUG_TO_CODE } from '@/lib/state-lookups'

// Lookup tables for scripts/resolve-dead-links.mjs (runs after the build and
// needs them as plain JSON).
export const dynamic = 'force-static'

export function GET() {
  return Response.json({
    FIND_MODIFIER_PREFIXES: FIND_MODIFIERS.map((m) => m.prefix),
    STATE_CODE_TO_SLUG: Object.fromEntries(Object.entries(STATE_SLUG_TO_CODE).map(([slug, code]) => [code.toLowerCase(), slug])),
  })
}
