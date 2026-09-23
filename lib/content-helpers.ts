// Shared helpers for building long-form editorial HTML strings server-side
// (pho listing pages, pho city pages, and similar generated content). Kept
// tiny and dependency-free so it's safe to import from any content builder.

export function esc(v: string | number): string {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const LINK_STYLE = 'style="color:#B57F50;text-decoration:underline;font-weight:600;"'

export function link(href: string, text: string): string {
  return `<a href="${href}" ${LINK_STYLE}>${text}</a>`
}

export function list(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

export function pct(n: number, total: number): number {
  return total > 0 ? Math.round((n / total) * 100) : 0
}
