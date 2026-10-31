import { getNearbyCells } from '@/lib/nearby-data'

// Which grid cells have restaurants, so the browser only requests files that
// exist. See lib/nearby-data.ts.
export const dynamic = 'force-static'

export function GET() {
  return Response.json([...getNearbyCells().keys()].sort())
}
