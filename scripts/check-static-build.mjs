// Zero-ISR / zero-functions guard. The site must stay a plain static export
// (see CLAUDE.md): ISR writes on Vercel are what forced listings to be cut in
// the first place, so anything that would make Vercel run a function, cache
// an ISR page or revalidate on demand fails the build instead of shipping.
//
//   node scripts/check-static-build.mjs --source   (before `next build`)
//   node scripts/check-static-build.mjs --output   (after the export, on out/)
//
// Both run from `npm run build`. Each failure names the file and the rule.
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const mode = process.argv[2]
const errors = []
const fail = (msg) => errors.push(msg)
const rel = (p) => path.relative(ROOT, p)
const read = (p) => fs.readFileSync(p, 'utf8')
const exists = (p) => fs.existsSync(path.join(ROOT, p))

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const fp = path.join(dir, e.name)
    if (e.isDirectory()) walk(fp, out)
    else out.push(fp)
  }
  return out
}
// Strip comments so prose like "no revalidate window" doesn't trip a rule.
const code = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1')

function checkSource() {
  // 1. next.config must export statically.
  const cfgFile = ['next.config.mjs', 'next.config.js', 'next.config.ts'].find(exists)
  if (!cfgFile) fail('next.config.* not found')
  else {
    const cfg = code(read(path.join(ROOT, cfgFile)))
    if (!/output\s*:\s*['"]export['"]/.test(cfg)) fail(`${cfgFile}: must set output: 'export'`)
    for (const k of ['rewrites', 'headers', 'redirects', 'middleware', 'serverActions', 'isrMemoryCacheSize', 'cacheHandler', 'expireTime', 'ppr', 'cacheComponents', 'dynamicIO'])
      if (new RegExp(`\\b${k}\\b`).test(cfg)) fail(`${cfgFile}: "${k}" needs a server; not allowed in a static export`)
  }

  // 2. No middleware/proxy, no Vercel functions directories, no pages router API.
  for (const f of ['middleware.ts', 'middleware.js', 'proxy.ts', 'proxy.js', 'src/middleware.ts', 'src/proxy.ts'])
    if (exists(f)) fail(`${f}: middleware/proxy runs as a function on Vercel`)
  for (const d of ['api', 'pages/api', 'src/pages/api', 'app/api', 'src/app/api'])
    if (exists(d)) fail(`${d}/: files here become serverless functions on Vercel`)
  if (exists('.vercel/output')) fail('.vercel/output: a prebuilt Build Output directory could ship functions; delete it')

  // 3. vercel.json: static output, nothing that creates functions.
  const vj = JSON.parse(read(path.join(ROOT, 'vercel.json')))
  if (vj.framework !== null) fail('vercel.json: framework must be null (static output), not Next.js')
  if (vj.outputDirectory !== 'out') fail('vercel.json: outputDirectory must be "out"')
  for (const k of ['functions', 'crons', 'builds', 'routes', 'rewrites', 'middleware'])
    if (k in vj) fail(`vercel.json: "${k}" is not allowed (functions/dynamic routing)`)

  // 4. Route segment config and server-only APIs in app/, lib/, components/.
  const files = ['app', 'lib', 'components', 'hooks', 'src'].flatMap((d) => walk(path.join(ROOT, d)))
    .filter((f) => /\.(m?[jt]sx?)$/.test(f))
  for (const f of files) {
    const s = code(read(f))
    const r = rel(f)
    const isApp = r.startsWith('app/') || r.startsWith('src/app/')
    if (/^\s*['"]use server['"]/m.test(s)) fail(`${r}: "use server" (server actions need a function)`)
    if (/\b(revalidatePath|revalidateTag|unstable_cache|unstable_expirePath|unstable_expireTag|updateTag|refresh)\s*\(/.test(s) && /from\s+['"]next\/cache['"]/.test(s))
      fail(`${r}: next/cache revalidation/caching API (ISR)`)
    if (/['"]use cache(?::[^'"]*)?['"]/.test(s)) fail(`${r}: "use cache" directive`)
    if (/\b(cookies|headers|draftMode|connection)\s*\(/.test(s) && /from\s+['"]next\/headers['"]|from\s+['"]next\/server['"]/.test(s))
      fail(`${r}: request-time API (cookies/headers/draftMode/connection) makes a route dynamic`)
    if (/\bafter\s*\(/.test(s) && /import\s*\{[^}]*\bafter\b[^}]*\}\s*from\s+['"]next\/server['"]/.test(s)) fail(`${r}: next/server after()`)
    if (!isApp) continue
    const m = s.match(/export\s+const\s+revalidate\s*=\s*([^\n;]+)/)
    if (m && m[1].trim() !== 'false') fail(`${r}: export const revalidate = ${m[1].trim()} (ISR)`)
    const dyn = s.match(/export\s+const\s+dynamic\s*=\s*['"]([^'"]+)['"]/)
    if (dyn && !['force-static', 'error'].includes(dyn[1])) fail(`${r}: export const dynamic = '${dyn[1]}' (only 'force-static' or 'error' allowed)`)
    const dp = s.match(/export\s+const\s+dynamicParams\s*=\s*(\w+)/)
    if (dp && dp[1] !== 'false') fail(`${r}: dynamicParams = ${dp[1]} renders unknown params on demand`)
    if (/export\s+const\s+runtime\s*=/.test(s)) fail(`${r}: export const runtime (function runtime config)`)
    if (/export\s+const\s+(maxDuration|preferredRegion|experimental_ppr)\s*=/.test(s)) fail(`${r}: function/PPR segment config`)

    const base = path.basename(f)
    const dynamicSegment = /\/\[[^\]]+\]\//.test('/' + r)
    if (/^(page|route)\.(m?[jt]sx?)$/.test(base) && dynamicSegment) {
      if (!/generateStaticParams/.test(s)) fail(`${r}: dynamic route without generateStaticParams`)
      if (!dp) fail(`${r}: dynamic route must export const dynamicParams = false`)
    }
    if (/^route\.(m?[jt]sx?)$/.test(base)) {
      // Route handlers are allowed only as build-time static files (sitemaps,
      // /data/*.json): GET only, force-static.
      if (!dyn || dyn[1] !== 'force-static') fail(`${r}: route handler must export const dynamic = 'force-static'`)
      for (const verb of ['POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])
        if (new RegExp(`export\\s+(async\\s+)?(function|const)\\s+${verb}\\b`).test(s)) fail(`${r}: ${verb} handler needs a function`)
    }
  }
}

function checkOutput() {
  // 5. Next's own build manifests: nothing revalidates, nothing falls back.
  const pm = path.join(ROOT, '.next', 'prerender-manifest.json')
  if (!fs.existsSync(pm)) fail('.next/prerender-manifest.json missing (did next build run?)')
  else {
    const m = JSON.parse(read(pm))
    for (const [route, r] of Object.entries(m.routes))
      if (r.initialRevalidateSeconds !== false && r.initialRevalidateSeconds !== undefined) fail(`prerender: ${route} revalidates every ${r.initialRevalidateSeconds}s (ISR)`)
    for (const [route, r] of Object.entries(m.dynamicRoutes))
      if (r.fallback !== false) fail(`prerender: ${route} has fallback ${JSON.stringify(r.fallback)} (on-demand render)`)
  }
  const fm = path.join(ROOT, '.next', 'server', 'functions-config-manifest.json')
  if (fs.existsSync(fm)) {
    const f = JSON.parse(read(fm)).functions ?? {}
    if (Object.keys(f).length) fail(`functions-config-manifest lists functions: ${Object.keys(f).join(', ')}`)
  }
  const mm = path.join(ROOT, '.next', 'server', 'middleware-manifest.json')
  if (fs.existsSync(mm)) {
    const j = JSON.parse(read(mm))
    if (Object.keys(j.middleware ?? {}).length || Object.keys(j.functions ?? {}).length) fail('middleware-manifest: middleware/edge functions present')
  }

  // 6. The deployed artifact: plain files in out/, nothing executable.
  const OUT = path.join(ROOT, 'out')
  if (!fs.existsSync(OUT)) { fail('out/ missing'); return }
  const all = walk(OUT)
  const built = new Set(['/'])
  let pages = 0
  for (const f of all) {
    const r = path.relative(OUT, f)
    if (/^api\//.test(r)) fail(`out/${r}: an api/ directory would become functions`)
    if (/\.(func|prerender-config\.json)$/.test(r) || r.includes('.func/')) fail(`out/${r}: function artifact`)
    if (r.endsWith('.html')) {
      pages++
      const p = '/' + r.replace(/\.html$/, '').replace(/(^|\/)index$/, '')
      built.add(p === '/' ? '/' : p.replace(/\/$/, ''))
    }
  }

  // 7. Redirects never shadow a built page, and retired targets are live.
  const vj = JSON.parse(read(path.join(ROOT, 'vercel.json')))
  const retired = JSON.parse(read(path.join(ROOT, 'lib', 'retired-pages.json'))).redirects
  let shadow = 0, dead = 0
  for (const [from, to] of Object.entries(retired)) {
    if (built.has(from)) { if (shadow++ < 10) fail(`retired page is built (its redirect would hide it): ${from}`) }
    if (!built.has(to)) { if (dead++ < 10) fail(`retired ${from} redirects to ${to}, which isn't built`) }
  }
  if (shadow > 10) fail(`...${shadow - 10} more built pages in the retired list`)
  if (dead > 10) fail(`...${dead - 10} more retired redirects to unbuilt pages`)
  const retiredRules = vj.redirects.filter((r) => r.source.startsWith('/:retired(')).length
  console.log(`check-static-build: ${pages} static pages, ${all.length} files, 0 functions, 0 ISR routes; vercel.json ${vj.redirects.length} redirects (${retiredRules} retired-page rules, ${Object.keys(retired).length} paths)`)
}

if (mode === '--source') checkSource()
else if (mode === '--output') checkOutput()
else { console.error('usage: check-static-build.mjs --source | --output'); process.exit(2) }

if (errors.length) {
  console.error(`\ncheck-static-build ${mode}: FAILED — the site must stay a fully static export (no ISR, no functions).`)
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
if (mode === '--source') console.log('check-static-build --source: ok (output: export, no ISR/functions config)')
