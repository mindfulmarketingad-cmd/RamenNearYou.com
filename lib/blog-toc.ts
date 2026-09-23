export type TocHeading = { id: string; text: string }

// Blog content is authored as raw HTML strings, and only about half the <h2>
// headings carry an explicit id. This walks the content once to build the
// table of contents AND stamp a stable id onto any heading missing one, so
// every TOC entry has something to anchor to.
//
// Returns the (possibly rewritten) html alongside the headings — always render
// the returned html, not the original, or the generated anchors won't exist.
// Older posts hand-rolled their own "Quick Navigation" pill-link block inline.
// Every post now gets the same numbered table of contents below, so this strips
// the old hand-rolled block out rather than rendering both.
const QUICK_NAV_RE = /<div[^>]*>\s*<p[^>]*>Quick Navigation<\/p>\s*<div[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi

export function extractToc(html: string): { headings: TocHeading[]; html: string } {
  const headings: TocHeading[] = []
  const used = new Set<string>()

  const cleaned = html.replace(QUICK_NAV_RE, '')

  const out = cleaned.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs: string, inner: string) => {
    // Heading text with any nested markup (links, <em>, …) stripped out.
    const text = inner.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
    if (!text) return match

    const existing = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs)
    let id = existing?.[1]

    if (!id) {
      const base =
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .slice(0, 60) || 'section'
      id = base
      let n = 2
      while (used.has(id)) id = `${base}-${n++}`
    }

    if (used.has(id)) return match // duplicate explicit id — leave the markup alone
    used.add(id)
    headings.push({ id, text })

    // Add the generated id; headings that already had one are left untouched.
    return existing ? match : `<h2${attrs} id="${id}">${inner}</h2>`
  })

  return { headings, html: out }
}
