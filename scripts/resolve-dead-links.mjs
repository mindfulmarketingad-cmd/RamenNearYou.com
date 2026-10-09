// Post-build step for the static export (runs after `next build`, see
// package.json). The directory builds only ~5,000 pages; every other page
// is retired (lib/retired-pages.json) and answers 404 once deployed. Pages
// across the site still link to some of them (city breadcrumbs, "nearby"
// lists, broth-city tables…), and on a static host there is no server to
// redirect those links. So this resolves every internal link in the exported
// HTML and RSC payloads to its final live destination — the same chain the
// old server followed: vercel.json redirects, then the retired-page map, then
// the city → state fallbacks — and drops dead entries from the sitemaps.
import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { pathToRegexp, compile } = require('next/dist/compiled/path-to-regexp')

const OUT = 'out'
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'))
const retired = JSON.parse(fs.readFileSync('lib/retired-pages.json', 'utf8'))
const { FIND_MODIFIER_PREFIXES, STATE_CODE_TO_SLUG } = JSON.parse(fs.readFileSync(path.join(OUT, 'data', 'link-rules.json'), 'utf8'))

// Every built page, as the clean URL Vercel serves it.
const files = []
const built = new Set(['/'])
;(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name)
    if (e.isDirectory()) { if (e.name !== '_next') walk(fp) }
    else {
      if (/\.(html|txt)$/.test(e.name) || /sitemap.*\.xml$/.test(e.name)) files.push(fp)
      if (e.name.endsWith('.html')) {
        const p = '/' + path.relative(OUT, fp).replace(/\.html$/, '').replace(/(^|\/)index$/, '')
        built.add(p === '/' ? '/' : p.replace(/\/$/, ''))
      }
    }
  }
})(OUT)

const rules = vercel.redirects.map((r) => {
  const keys = []
  return { re: pathToRegexp(r.source, keys), keys, to: compile(r.destination, { validate: false }) }
})
function viaVercel(p) {
  for (const { re, keys, to } of rules) {
    const m = re.exec(p)
    if (m) { const params = {}; keys.forEach((k, i) => { params[k.name] = m[i + 1] }); return to(params) }
  }
  return null
}
const stateOfCs = (cs) => STATE_CODE_TO_SLUG[cs.slice(cs.lastIndexOf('-') + 1)]
// Mirrors components/retired-page-redirect.tsx.
function fallback(p) {
  if (retired.redirects[p]) return retired.redirects[p]
  const seg = p.split('/').filter(Boolean)
  if (seg[0] === 'find' && seg.length === 2) {
    const prefix = FIND_MODIFIER_PREFIXES.find((x) => seg[1].startsWith(`${x}-`))
    if (prefix) return `/find/${seg[1].slice(prefix.length + 1)}`
    const st = stateOfCs(seg[1])
    return st ? `/${st}` : '/find'
  }
  if (seg[0] === 'reviews' && seg.length === 2) return '/reviews'
  if (seg[0] === 'partners' && seg.length === 2) return '/partners'
  if (seg[0] === 'blog' && seg.length === 2) {
    const m = seg[1].match(/^best-(?:ramen|pho)-restaurants-(.+)$/)
    return m ? `/find/${m[1]}` : '/blog'
  }
  if (['tonkotsu', 'miso', 'spicy', 'vegan'].includes(seg[0]) && seg.length === 3) return `/${seg[2]}`
  if (seg.length === 3 && Object.values(STATE_CODE_TO_SLUG).includes(seg[1])) return `/${seg[1]}`
  return null
}
const memo = new Map()
function resolve(p) {
  if (memo.has(p)) return memo.get(p)
  let cur = p
  for (let i = 0; i < 8 && cur; i++) {
    const bare = cur.split(/[?#]/)[0]
    let dec = bare
    try { dec = decodeURIComponent(bare) } catch { /* keep */ }
    if (built.has(dec) || built.has(bare)) break
    cur = viaVercel(bare) ?? fallback(dec)
  }
  const out = cur && cur !== p ? cur : null
  memo.set(p, out)
  return out
}

// Internal links only: quoted root-relative paths or absolute site URLs
// (attribute values, JSON-LD, and the escaped strings inside inline RSC
// payloads), skipping assets and data.
const LINK = /(\\?["'])((?:https:\/\/www\.ramennearyou\.com)?\/(?!\/|_next\/|data\/|api\/)[A-Za-z0-9\-._~%!$&'()*+,;=:@/]*?)(\\?["'])/g
const ORIGIN = 'https://www.ramennearyou.com'
const isPage = (p) => !/\.[a-z0-9]{2,5}$/i.test(p.split(/[?#]/)[0]) || p.endsWith('.html')
let changedFiles = 0, changedLinks = 0, droppedUrls = 0

function rewriteText(text) {
  return text.replace(LINK, (m, q1, url, q2) => {
    const abs = url.startsWith(ORIGIN)
    const p = abs ? url.slice(ORIGIN.length) || '/' : url
    if (!isPage(p)) return m
    const to = resolve(p)
    if (!to) return m
    changedLinks++
    return q1 + (abs ? ORIGIN + to : to) + q2
  })
}

// An RSC payload is a sequence of rows: `{id}:{data}\n`, except text rows,
// `{id}:T{hex byte length},{raw text}`, whose length prefix has to be
// recomputed when a link inside them changes length.
const ROW = /^([0-9a-f]*):/
function rewritePayload(buf) {
  const out = []
  let i = 0
  while (i < buf.length) {
    const head = buf.subarray(i, Math.min(i + 24, buf.length)).toString('latin1').match(ROW)
    if (!head) { out.push(Buffer.from(rewriteText(buf.subarray(i).toString('utf8')))); break }
    const j = i + head[0].length
    if (buf[j] === 0x54 /* T */) {
      const comma = buf.indexOf(0x2c, j)
      const len = parseInt(buf.subarray(j + 1, comma).toString('latin1'), 16)
      const text = Buffer.from(rewriteText(buf.subarray(comma + 1, comma + 1 + len).toString('utf8')))
      out.push(Buffer.from(`${head[0]}T${text.length.toString(16)},`), text)
      i = comma + 1 + len
    } else {
      const nl = buf.indexOf(0x0a, j)
      const end = nl < 0 ? buf.length : nl + 1
      out.push(Buffer.from(rewriteText(buf.subarray(i, end).toString('utf8'))))
      i = end
    }
  }
  return Buffer.concat(out)
}

// Inline payload in a page: the same rows, split across
// `self.__next_f.push([1,"…"])` scripts. Rejoined, rewritten as a whole, and
// written back into the first chunk (later chunks emptied) — the client
// concatenates them before parsing, so where the boundaries fall is free.
const PUSH = /self\.__next_f\.push\(\[1,("(?:[^"\\]|\\.)*")\]\)/g
const SCRIPT = /<script\b[^>]*>[\s\S]*?<\/script>/g
const jsString = (str) => JSON.stringify(str)
  .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
function rewriteHtml(html) {
  const chunks = [...html.matchAll(PUSH)].map((m) => JSON.parse(m[1]))
  let first = true
  const payload = chunks.length ? rewritePayload(Buffer.from(chunks.join(''), 'utf8')).toString('utf8') : ''
  // Outside scripts (attributes, text) and inside non-payload scripts
  // (JSON-LD), plain rewriting is safe.
  let res = ''
  let last = 0
  for (const m of html.matchAll(SCRIPT)) {
    res += rewriteText(html.slice(last, m.index))
    let tag = m[0]
    if (PUSH.test(tag)) {
      PUSH.lastIndex = 0
      tag = tag.replace(PUSH, () => {
        const body = first ? payload : ''
        first = false
        return `self.__next_f.push([1,${jsString(body)}])`
      })
    } else if (/application\/ld\+json/.test(tag)) {
      tag = rewriteText(tag)
    }
    PUSH.lastIndex = 0
    res += tag
    last = m.index + m[0].length
  }
  return res + rewriteText(html.slice(last))
}

for (const fp of files) {
  const before = fs.readFileSync(fp, 'utf8')
  let s = before
  if (fp.endsWith('.xml')) {
    s = s.replace(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>\s*/g, (block, loc) => {
      const p = loc.replace(/^https?:\/\/(www\.)?ramennearyou\.com/, '') || '/'
      if (p.endsWith('.xml') || built.has(p.replace(/\/$/, '') || '/')) return block
      droppedUrls++
      return ''
    })
  } else if (fp.endsWith('.txt')) {
    if (!/^[0-9a-f]*:/.test(s)) continue // ads.txt, robots.txt, llms.txt
    s = rewritePayload(Buffer.from(s, 'utf8')).toString('utf8')
  } else {
    s = rewriteHtml(s)
  }
  if (s !== before) { fs.writeFileSync(fp, s); changedFiles++ }
}
console.log(`resolve-dead-links: ${built.size} pages; rewrote ${changedLinks} links in ${changedFiles} files; dropped ${droppedUrls} sitemap URLs`)
