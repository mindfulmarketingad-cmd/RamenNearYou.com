import Link from 'next/link'

export interface ServiceCityLinkItem {
  href: string
  city: string
  stateCode: string
  count: number
}

// Renders the dedicated /{broth}/{city}/{state} pages that exist for a given
// service — so every one of those pre-rendered pages has a real inbound link
// from its parent /find/{broth}-ramen hub instead of being reachable only
// through the sitemap.
export default function ServiceCityLinks({ links }: { links: ServiceCityLinkItem[] }) {
  if (links.length === 0) return null
  return (
    <ul className="columns-2 sm:columns-3 gap-x-6 space-y-1 list-none p-0 m-0">
      {links.map((l) => (
        <li key={l.href} className="break-inside-avoid">
          <Link href={l.href} className="text-sm text-[#96602F] hover:underline">
            {l.city}, {l.stateCode}
          </Link>
        </li>
      ))}
    </ul>
  )
}
