import Link from 'next/link'

export const FIND_PAGES = [
  { href: '/find/ramen-open-late', label: 'Ramen Open Late Near Me', emoji: '🌙' },
  { href: '/find/ramen-open-now', label: 'Ramen Open Now Near Me', emoji: '🟢' },
  { href: '/find/tonkotsu-ramen', label: 'Tonkotsu Ramen Near Me', emoji: '🍜' },
  { href: '/find/vegan-ramen', label: 'Vegan Ramen Near Me', emoji: '🌱' },
  { href: '/find/spicy-ramen', label: 'Spicy Ramen Near Me', emoji: '🌶️' },
]

interface Props {
  currentHref?: string
}

export default function FindCrossLinks({ currentHref }: Props) {
  return (
    <section className="border-t border-black/8 bg-[#F5F4F0]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[#9B9490] mb-4">
          More Ramen Searches Near Me
        </h2>
        <div className="flex flex-wrap gap-2">
          {FIND_PAGES.map(p => (
            <Link
              key={p.href}
              href={p.href}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm border transition-colors ${
                p.href === currentHref
                  ? 'bg-[#1E2026] text-white border-[#1E2026] font-semibold'
                  : 'bg-white text-[#1E2026] border-black/12 hover:border-[#B57F50]/50 hover:text-[#B57F50]'
              }`}
            >
              <span>{p.emoji}</span>
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
