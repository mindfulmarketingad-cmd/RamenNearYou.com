// Breaks long <p> blocks in stored HTML into shorter ones at sentence
// boundaries, so long-form copy reads as 3-4 line paragraphs instead of walls
// of text (and gives ad placement more natural break points between them).
//
// This only re-flows what is already written: it never adds, drops or reorders
// a word. It runs at render time on the stored HTML, so the ~1,100 blog
// paragraphs stay as authored in the source.

/** ~4 lines at the 18px prose size in the article column. */
const MAX_CHARS = 300

const INLINE = new Set(['a', 'strong', 'b', 'em', 'i', 'span', 'u', 'mark', 'code', 'sub', 'sup', 'small'])

// A "." after these is not a sentence end.
const ABBREV = new Set([
  'mr', 'mrs', 'ms', 'dr', 'st', 'vs', 'etc', 'inc', 'ltd', 'co', 'no', 'jr', 'sr',
  'e.g', 'i.e', 'u.s', 'a.m', 'p.m', 'approx', 'est', 'oz', 'lb', 'lbs',
])

type Token = { kind: 'tag'; raw: string } | { kind: 'text'; raw: string }

function tokenize(html: string): Token[] {
  const out: Token[] = []
  const re = /<[^>]+>/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    if (m.index > last) out.push({ kind: 'text', raw: html.slice(last, m.index) })
    out.push({ kind: 'tag', raw: m[0] })
    last = m.index + m[0].length
  }
  if (last < html.length) out.push({ kind: 'text', raw: html.slice(last) })
  return out
}

/** Splits one paragraph's inner HTML into sentences, never inside an inline tag. */
function sentences(inner: string): string[] {
  const tokens = tokenize(inner)
  const parts: string[] = []
  let buf = ''
  let depth = 0
  // Last visible character seen, across tags, for the end-of-sentence test.
  let lastChar = ''
  let lastWord = ''

  for (let t = 0; t < tokens.length; t++) {
    const tok = tokens[t]

    if (tok.kind === 'tag') {
      const name = /^<\/?\s*([a-z0-9]+)/i.exec(tok.raw)?.[1]?.toLowerCase() ?? ''
      if (INLINE.has(name)) {
        if (tok.raw.startsWith('</')) depth = Math.max(0, depth - 1)
        else if (!tok.raw.endsWith('/>')) depth++
      } else if (name === 'br') {
        // A hard line break is the author's own break — don't merge across it.
        buf += tok.raw
        lastChar = ''
        continue
      }
      buf += tok.raw
      continue
    }

    // Text: walk it, looking for whitespace that follows a sentence end.
    const text = tok.raw
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      buf += ch

      if (!/\s/.test(ch)) {
        lastChar = ch
        lastWord = /[\s]/.test(text[i - 1] ?? ' ') || i === 0 ? ch : lastWord + ch
        continue
      }

      if (depth !== 0) { lastWord = ''; continue }
      if (!/[.!?]["'”’)\]]*$/.test(buf.trimEnd().replace(/<[^>]+>/g, ''))) { lastWord = ''; continue }

      // What follows the whitespace, skipping tags.
      let next = ''
      let rest = text.slice(i + 1)
      let k = t
      while (!next.trim() && k < tokens.length) {
        next = rest.replace(/^\s+/, '')
        if (next) break
        k++
        while (k < tokens.length && tokens[k].kind === 'tag') k++
        rest = k < tokens.length ? tokens[k].raw : ''
      }
      const startsSentence = /^["'“‘(\[]*[A-Z0-9]/.test(next)
      const word = lastWord.replace(/[.!?"'”’)\]]+$/, '').toLowerCase()
      const isAbbrev = lastChar === '.' && (ABBREV.has(word) || /^[a-z]$/.test(word))

      if (startsSentence && !isAbbrev) {
        parts.push(buf.trim())
        buf = ''
      }
      lastWord = ''
    }
  }

  if (buf.trim()) parts.push(buf.trim())
  return parts
}

/** Visible length, ignoring markup. */
const visible = (s: string) => s.replace(/<[^>]+>/g, '').length

/** Packs sentences into chunks up to MAX_CHARS. A single long sentence is left whole. */
function pack(sents: string[]): string[] {
  const chunks: string[] = []
  let cur = ''
  for (const s of sents) {
    if (!cur) { cur = s; continue }
    if (visible(cur) + 1 + visible(s) <= MAX_CHARS) cur += ` ${s}`
    else { chunks.push(cur); cur = s }
  }
  if (cur) chunks.push(cur)
  return chunks
}

/**
 * Re-flows every attribute-less <p> longer than MAX_CHARS. Paragraphs with
 * attributes (styled callouts, captions, affiliate blocks) are left exactly as
 * authored, and so is anything that isn't a plain paragraph.
 */
export function splitLongParagraphs(html: string): string {
  if (!html) return html
  return html.replace(/<p>([\s\S]*?)<\/p>/g, (whole, inner: string) => {
    if (visible(inner) <= MAX_CHARS) return whole
    const chunks = pack(sentences(inner))
    if (chunks.length < 2) return whole
    return chunks.map((c) => `<p>${c}</p>`).join('\n')
  })
}

/** Same re-flow for content stored as an array of plain-text-ish paragraphs. */
export function splitLongParagraphList(paras: string[]): string[] {
  return paras.flatMap((p) => {
    if (visible(p) <= MAX_CHARS) return [p]
    const chunks = pack(sentences(p))
    return chunks.length < 2 ? [p] : chunks
  })
}
