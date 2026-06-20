import Link from 'next/link'

export const FIND_PAGES = [
  { href: '/find/ramen-open-now', label: 'Ramen Open Now Near Me', emoji: '🟢' },
  { href: '/find/ramen-open-late', label: 'Ramen Open Late Near Me', emoji: '🌙' },
  { href: '/find/tonkotsu-ramen', label: 'Tonkotsu Ramen Near Me', emoji: '🍜' },
  { href: '/find/spicy-ramen', label: 'Spicy Ramen Near Me', emoji: '🌶️' },
  { href: '/find/extra-spicy-ramen', label: 'Extra Spicy Ramen Near Me', emoji: '🔥' },
  { href: '/find/miso-ramen', label: 'Miso Ramen Near Me', emoji: '🥣' },
  { href: '/find/shoyu-ramen', label: 'Shoyu Ramen Near Me', emoji: '🍶' },
  { href: '/find/shio-ramen', label: 'Shio Ramen Near Me', emoji: '🧂' },
  { href: '/find/tsukemen', label: 'Tsukemen Near Me', emoji: '🥢' },
  { href: '/find/mazemen', label: 'Mazemen Near Me', emoji: '🍝' },
  { href: '/find/chicken-ramen', label: 'Chicken Ramen Near Me', emoji: '🐔' },
  { href: '/find/black-garlic-ramen', label: 'Black Garlic Ramen Near Me', emoji: '🧄' },
  { href: '/find/tantanmen', label: 'Tantanmen Near Me', emoji: '🥜' },
  { href: '/find/rich-ramen', label: 'Rich & Creamy Ramen Near Me', emoji: '🥛' },
  { href: '/find/light-ramen', label: 'Light & Clean Ramen Near Me', emoji: '🍃' },
  { href: '/find/vegan-ramen', label: 'Vegan Ramen Near Me', emoji: '🌱' },
  { href: '/find/cheap-ramen', label: 'Ramen Under $15 Near Me', emoji: '💰' },
  { href: '/find/ramen-date-night', label: 'Date Night Ramen Near Me', emoji: '🍷' },
  { href: '/find/ramen-lunch', label: 'Ramen for Lunch Near Me', emoji: '⏱️' },
  { href: '/find/ramen-bars', label: 'Ramen Bars Near Me', emoji: '🍺' },
  { href: '/find/ramen-restaurants', label: 'Ramen Restaurants Near Me', emoji: '🗺️' },
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
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {FIND_PAGES.map(p => (
            <Link
              key={p.href}
              href={p.href}
              className={`text-sm py-0.5 transition-colors ${
                p.href === currentHref
                  ? 'text-[#B57F50] font-semibold'
                  : 'text-[#6B6862] hover:text-[#B57F50] hover:underline'
              }`}
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
