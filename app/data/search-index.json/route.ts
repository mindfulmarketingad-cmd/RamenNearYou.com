import { buildSearchCorpus } from '@/lib/site-search-corpus'

// The /search index, written once at build time (/data/search-index.json).
export const dynamic = 'force-static'

export function GET() {
  return Response.json(buildSearchCorpus())
}
