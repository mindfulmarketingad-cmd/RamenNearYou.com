import Link from 'next/link'

const BOWL_CHIPS = [
  { label: 'Tonkotsu', emoji: '🍜', hex: '#d97706' },
  { label: 'Spicy Miso', emoji: '🌶️', hex: '#dc2626' },
  { label: 'Miso', emoji: '🥣', hex: '#ea580c' },
  { label: 'Shoyu', emoji: '🍶', hex: '#78716c' },
  { label: 'Shio', emoji: '🧂', hex: '#0ea5e9' },
  { label: 'Tsukemen', emoji: '🥢', hex: '#7c3aed' },
  { label: 'Mazemen', emoji: '🍝', hex: '#ca8a04' },
  { label: 'Chicken Paitan', emoji: '🐔', hex: '#f59e0b' },
  { label: 'Black Garlic', emoji: '🧄', hex: '#374151' },
  { label: 'Tantanmen', emoji: '🥜', hex: '#b91c1c' },
  { label: 'Vegan', emoji: '🌱', hex: '#059669' },
]

const MOOD_CHIPS = [
  { label: 'Rich & Creamy', emoji: '🥛', hex: '#d97706' },
  { label: 'Light & Clean', emoji: '🍃', hex: '#0ea5e9' },
  { label: 'Extra Spicy', emoji: '🔥', hex: '#dc2626' },
  { label: 'Late-Night Comfort', emoji: '🌙', hex: '#6366f1' },
  { label: 'Hangover Cure', emoji: '🍲', hex: '#ef4444' },
  { label: 'Quick Lunch', emoji: '⏱️', hex: '#16a34a' },
  { label: 'Date Night', emoji: '🍷', hex: '#9333ea' },
]

const HOURS_CHIPS = [
  { label: 'Open Now', emoji: '🟢', hex: '#16a34a' },
  { label: 'Open Late (10pm+)', emoji: '🌙', hex: '#6366f1' },
  { label: 'Past Midnight', emoji: '🌃', hex: '#374151' },
  { label: 'Open Early', emoji: '☕', hex: '#d97706' },
  { label: 'Open Weekends', emoji: '📆', hex: '#0ea5e9' },
  { label: 'Top Rated', emoji: '⭐', hex: '#f59e0b' },
  { label: 'Hidden Gems', emoji: '💎', hex: '#9333ea' },
]

const FEATURE_CHIPS = [
  { label: 'Delivers', emoji: '🛵', hex: '#16a34a' },
  { label: 'Outdoor Seating', emoji: '☀️', hex: '#0ea5e9' },
  { label: 'Takes Reservations', emoji: '📅', hex: '#9333ea' },
  { label: 'Full Bar', emoji: '🍺', hex: '#d97706' },
  { label: 'Family-Friendly', emoji: '👨‍👩‍👧', hex: '#f59e0b' },
  { label: 'Vegetarian Options', emoji: '🥗', hex: '#059669' },
  { label: 'Wheelchair Accessible', emoji: '♿', hex: '#0284c7' },
  { label: 'Free Parking', emoji: '🅿️', hex: '#64748b' },
]

function StaticChip({ label, emoji, hex }: { label: string; emoji: string; hex: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-black/10 bg-white text-[#1E2026] whitespace-nowrap select-none"
    >
      <span className="text-sm leading-none">{emoji}</span>
      {label}
    </span>
  )
}

function SectionLabel({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      <span className="text-sm">{icon}</span>
      <span className="text-[11px] font-bold uppercase tracking-wide text-[#6B6862]">{label}</span>
    </div>
  )
}

export default function FilterShowcase() {
  return (
    <section className="bg-[#F5F4F0] border-t border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-1">Powerful Filters</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-2">
            Find exactly the bowl you want
          </h2>
          <p className="text-[#6B6862] text-sm max-w-xl">
            Filter by broth, mood, hours, amenities, and more. Every filter works together so you find your perfect ramen right now.
          </p>
        </div>

        {/* Filter preview card */}
        <div className="bg-white rounded-2xl border border-black/8 shadow-sm p-5 sm:p-6 space-y-5 mb-8">
          <div>
            <SectionLabel icon="🍜" label="Instant Bowl Finder" />
            <div className="flex flex-wrap gap-1.5">
              {BOWL_CHIPS.map(c => <StaticChip key={c.label} {...c} />)}
            </div>
          </div>

          <div>
            <SectionLabel icon="✨" label="Mood" />
            <div className="flex flex-wrap gap-1.5">
              {MOOD_CHIPS.map(c => <StaticChip key={c.label} {...c} />)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1">
              <SectionLabel icon="⏰" label="Hours & Quality" />
              <div className="flex flex-wrap gap-1.5">
                {HOURS_CHIPS.map(c => <StaticChip key={c.label} {...c} />)}
              </div>
            </div>
            <div className="sm:w-48">
              <SectionLabel icon="$" label="Price" />
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Under ~$15', emoji: '💰', hex: '#16a34a' },
                  { label: 'Premium', emoji: '🏆', hex: '#d97706' },
                  { label: 'Best Value', emoji: '⚡', hex: '#0284c7' },
                ].map(c => <StaticChip key={c.label} {...c} />)}
              </div>
            </div>
          </div>

          <div>
            <SectionLabel icon="🎯" label="Features & Amenities" />
            <div className="flex flex-wrap gap-1.5">
              {FEATURE_CHIPS.map(c => <StaticChip key={c.label} {...c} />)}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link
            href="/#map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
          >
            Search the Map →
          </Link>
          <Link
            href="/find"
            className="text-sm text-[#6B6862] hover:text-[#96602F] transition-colors"
          >
            Browse all ramen pages →
          </Link>
        </div>
      </div>
    </section>
  )
}
