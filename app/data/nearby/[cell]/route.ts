import { getNearbyCells } from '@/lib/nearby-data'

// One static JSON file per grid cell, written at build time
// (/data/nearby/40_-75.json). See lib/nearby-data.ts.
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return [...getNearbyCells().keys()].map((key) => ({ cell: `${key}.json` }))
}

export async function GET(_req: Request, { params }: { params: Promise<{ cell: string }> }) {
  const { cell } = await params
  return Response.json(getNearbyCells().get(cell.replace(/\.json$/, '')) ?? [])
}
