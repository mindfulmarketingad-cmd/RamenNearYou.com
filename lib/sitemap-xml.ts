export const SITEMAP_BASE_URL = 'https://www.ramennearyou.com'

// Static dates prevent Google from seeing unstable lastModified on every deploy.
export const SITE_LAUNCH = new Date('2025-01-01')
export const LAST_CONTENT = new Date('2026-05-22')

export type SitemapEntry = {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// Google's sitemap protocol caps a single <urlset> at 50,000 <url> entries —
// each category sitemap here stays well under that on its own.
export function buildUrlsetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <lastmod>${e.lastModified.toISOString()}</lastmod>
    <changefreq>${e.changeFrequency}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
}

export function buildSitemapIndexXml(sitemapUrls: string[]): string {
  const entries = sitemapUrls
    .map(
      (url) => `  <sitemap>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${LAST_CONTENT.toISOString()}</lastmod>
  </sitemap>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
