import Link from 'next/link'

const BROTH_TABS = [
  { type: 'Tonkotsu', href: '/find/tonkotsu-ramen' },
  { type: 'Shoyu', href: '/find/shoyu-ramen' },
  { type: 'Miso', href: '/find/miso-ramen' },
  { type: 'Spicy', href: '/find/spicy-ramen' },
  { type: 'Vegan', href: '/find/vegan-ramen' },
] as const

// "All" is this page (/broth); each broth links to its own map page.
export default function BrothFilterTabs({ counts }: { counts: Record<string, number> }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="px-4 py-1.5 rounded-full text-sm font-medium border bg-brand border-brand text-white">
        All ({counts.All?.toLocaleString()})
      </span>
      {BROTH_TABS.map(({ type, href }) => (
        <Link
          key={type}
          href={href}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border border-line/8 text-ink-soft hover:text-ink"
        >
          {type} ({counts[type]?.toLocaleString() ?? 0})
        </Link>
      ))}
    </div>
  )
}
