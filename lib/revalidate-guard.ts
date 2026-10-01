// Deliberately has no imports, so it can be tested without Next.

/**
 * True only for a concrete page URL like "/atlanta/georgia/momonoki" or
 * "/api/ramen-map" — something that names exactly one cache entry.
 *
 * Everything this refuses would purge more than one page:
 *  - a route pattern ("/[city]/[state]/[restaurant]"): revalidatePath treats
 *    it as "every page matching this", which is ~12,000 listing pages
 *  - the site root: easy to mistake for "just the homepage"
 *  - wildcards, queries, fragments, traversal and protocol-relative forms,
 *    which are never what a caller meant by "this page"
 *
 * Note this is only half of staying narrow: revalidatePath's second argument
 * ('page' | 'layout') must also stay unset, because 'layout' on a concrete path
 * purges everything beneath that layout. lib/revalidate.ts never passes it.
 */
export function isExactPath(path: unknown): path is string {
  if (typeof path !== 'string') return false
  if (!path.startsWith('/') || path === '/') return false
  if (path.includes('//') || path.includes('..')) return false
  if (/[\[\]*?#\\\s]/.test(path)) return false
  return true
}
