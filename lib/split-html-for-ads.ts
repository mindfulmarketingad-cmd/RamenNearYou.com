// Splits an HTML string into `adCount + 1` chunks along block-level tag
// boundaries (paragraphs, headings, lists, etc.) so ad units can be
// interspersed at roughly even points without ever landing mid-tag.
// Falls back to returning the whole string unsplit if there aren't enough
// boundaries to split meaningfully (very short posts).
export function splitHtmlForAds(html: string, adCount: number): string[] {
  const boundaryRegex = /<\/(p|h2|h3|h4|ul|ol|blockquote|table|figure)>/gi
  const boundaries: number[] = []
  let match: RegExpExecArray | null
  while ((match = boundaryRegex.exec(html))) {
    boundaries.push(match.index + match[0].length)
  }

  const totalParts = adCount + 1
  if (boundaries.length < totalParts) return [html]

  const chunks: string[] = []
  let lastCut = 0
  for (let i = 1; i < totalParts; i++) {
    const targetIdx = Math.floor((boundaries.length * i) / totalParts)
    const cut = boundaries[Math.min(targetIdx, boundaries.length - 1)]
    chunks.push(html.slice(lastCut, cut))
    lastCut = cut
  }
  chunks.push(html.slice(lastCut))
  return chunks
}
