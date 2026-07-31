import Link from 'next/link'
import { Search, MapPin, SlidersHorizontal, Bookmark, Navigation, Heart, Plus, Minus, Layers } from 'lucide-react'

// A faithful static recreation of the live search map UI — used as a homepage
// showcase under the filters section. Mirrors the real /#map experience:
// a results sidebar (search, count, listing cards) beside a map with rating pins.
//
// Names/cities/ratings below are illustrative placeholders, not real
// businesses — this is a static mockup that can't reflect a restaurant's
// actual current rating, hours, or featured status, so it must never use a
// real restaurant's name or it will end up silently misrepresenting them
// (e.g. showing "Featured" long after a real listing's promotion ended).
const LISTINGS = [
  { name: 'Sakura Ramen House', city: 'Riverdale, NY', rating: '4.7', price: '$$', open: true, dist: '1.2 mi', featured: true },
  { name: 'Noodle & Broth Co.', city: 'Maple Heights, FL', rating: '3.8', price: '$$', open: false, dist: '', featured: false },
  { name: 'Umami Ramen Bar', city: 'Lakeview, FL', rating: '3.8', price: '$$', open: false, dist: '', featured: false },
]

// Rating pins scattered across the faux map (percent positions).
const PINS = [
  { r: '4.9', top: '11%', left: '54%' }, { r: '4.7', top: '11%', left: '85%' },
  { r: '5.0', top: '36%', left: '49%' }, { r: '4.7', top: '35%', left: '74%' },
  { r: '4.8', top: '46%', left: '50%' }, { r: '4.8', top: '45%', left: '61%' },
  { r: '4.4', top: '47%', left: '70%' }, { r: '4.9', top: '53%', left: '66%' },
  { r: '4.6', top: '53%', left: '83%' }, { r: '4.9', top: '60%', left: '47%' },
  { r: '4.8', top: '59%', left: '54%' }, { r: '4.8', top: '61%', left: '72%' },
  { r: '4.9', top: '65%', left: '49%' }, { r: '4.5', top: '66%', left: '64%' },
  { r: '4.4', top: '70%', left: '54%' }, { r: '4.2', top: '76%', left: '61%' },
  { r: '4.9', top: '82%', left: '58%' }, { r: '4.5', top: '87%', left: '43%' },
  { r: '4.7', top: '87%', left: '50%' }, { r: '4.7', top: '88%', left: '57%' },
  { r: '4.9', top: '92%', left: '49%' },
]

function Pin({ r, top, left }: { r: string; top: string; left: string }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-0.5 px-2 py-1 rounded-full bg-[#B57F50] text-white text-[11px] font-bold shadow-md ring-2 ring-white whitespace-nowrap"
      style={{ top, left }}
    >
      <span className="text-[9px] leading-none">★</span>{r}
    </span>
  )
}

function ListingCard({ l }: { l: typeof LISTINGS[number] }) {
  return (
    <div className={`p-3 ${l.featured ? 'bg-[#FCF7EF] border-b border-[#B57F50]/20' : 'border-b border-black/5'}`}>
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#2a2722] to-[#0f0d0b] flex-shrink-0 flex items-center justify-center text-lg">🍜</div>
        <div className="flex-1 min-w-0">
          {l.featured && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F4C430]/25 text-[#9a6b00] text-[9px] font-bold uppercase tracking-wide mb-1">
              👑 Featured
            </span>
          )}
          <div className="font-bold text-sm text-[#1E2026] truncate">{l.name}</div>
          <div className="text-[11px] text-[#6B6862]">{l.city}</div>
          <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
            <span className="text-[#F4C430]">★</span>
            <span className="font-semibold text-[#1E2026]">{l.rating}</span>
            <span className="text-[#6B6862]">{l.price}</span>
            {l.open && <span className="text-green-600 font-semibold">Open</span>}
            {l.dist && <span className="text-[#6B6862]">{l.dist}</span>}
          </div>
        </div>
        <Heart className="w-4 h-4 text-[#C9C4BD] flex-shrink-0" />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2 pl-[60px]">
        <span className="text-[10px] text-[#6B6862] border border-black/10 rounded-full px-2 py-0.5">View Menu</span>
        <span className="text-[10px] text-[#6B6862] border border-black/10 rounded-full px-2 py-0.5">Get Directions</span>
        <span className="text-[10px] text-white bg-[#B57F50] rounded-full px-2 py-0.5">Order Now</span>
        <span className="text-[10px] text-[#6B6862] border border-black/10 rounded-full px-2 py-0.5">Claim Listing</span>
      </div>
    </div>
  )
}

export default function SearchMapShowcase() {
  return (
    <section className="bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-1">Live Interactive Map</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-2">
            Search ramen on the map
          </h2>
          <p className="text-[#6B6862] text-sm max-w-xl">
            Pan the map, filter by what you crave, and see top-rated bowls near you in real time — complete with ratings, hours, menus, and directions.
          </p>
        </div>

        {/* Search map preview card */}
        <div className="rounded-2xl border border-black/8 shadow-lg overflow-hidden bg-white">
          {/* Top toolbar */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-black/8 bg-white">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <div className="flex items-center gap-2 flex-1 rounded-full border border-black/10 px-3 py-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#96602F]" />
                <span className="text-xs text-[#6B6862]">ZIP code</span>
                <span className="ml-auto text-[10px] font-bold text-white bg-[#B57F50] rounded-full px-2 py-0.5">Go</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1E2026]" />
                <span className="text-xs font-semibold text-[#1E2026]">Filters</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-[#6B6862]">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-semibold text-[#1E2026]">21</span> members searching now
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[#1E2026] border border-black/10 rounded-full px-3 py-1.5">
                <Bookmark className="w-3.5 h-3.5" /> Save Search
              </span>
            </div>
          </div>

          <div className="flex h-[460px]">
            {/* Sidebar */}
            <div className="w-[300px] flex-shrink-0 border-r border-black/8 flex flex-col bg-white">
              <div className="p-3 border-b border-black/8">
                <div className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-[#6B6862]" />
                  <span className="text-xs text-[#6B6862]">Search restaurants…</span>
                </div>
                <p className="text-sm font-bold text-[#1E2026] mt-3">300 ramen spots</p>
              </div>
              <div className="flex-1 overflow-hidden">
                {LISTINGS.map((l, i) => <ListingCard key={i} l={l} />)}
              </div>
            </div>

            {/* Map */}
            <div className="relative flex-1 bg-[#e8edd9] overflow-hidden">
              {/* faux map texture */}
              <div
                className="absolute inset-0 opacity-90"
                style={{
                  backgroundImage:
                    'linear-gradient(0deg, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px), radial-gradient(circle at 80% 50%, #add0e6 0%, #add0e6 22%, transparent 23%)',
                  backgroundSize: '40px 40px, 40px 40px, 100% 100%',
                }}
              />
              {/* roads */}
              <div className="absolute inset-0">
                <div className="absolute top-[30%] left-0 right-0 h-[3px] bg-[#f3c98b]/70" />
                <div className="absolute top-[55%] left-0 right-[30%] h-[3px] bg-[#f3c98b]/70" />
                <div className="absolute left-[35%] top-0 bottom-0 w-[3px] bg-[#f0a8a8]/60" />
                <div className="absolute left-[62%] top-0 bottom-0 w-[2px] bg-[#f3c98b]/60" />
              </div>

              {/* zoom controls */}
              <div className="absolute top-3 left-3 flex flex-col rounded-lg overflow-hidden shadow border border-black/10 bg-white">
                <span className="p-1.5 border-b border-black/10"><Plus className="w-3.5 h-3.5 text-[#1E2026]" /></span>
                <span className="p-1.5"><Minus className="w-3.5 h-3.5 text-[#1E2026]" /></span>
              </div>

              {/* use my location */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-[#B57F50] text-white text-xs font-semibold px-3 py-1.5 shadow">
                <Navigation className="w-3.5 h-3.5" /> Use my location
              </div>

              {/* satellite toggle */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white text-xs font-semibold text-[#1E2026] px-3 py-1.5 shadow border border-black/10">
                <Layers className="w-3.5 h-3.5" /> Satellite
              </div>

              {/* rating pins */}
              {PINS.map((p, i) => <Pin key={i} {...p} />)}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8">
          <Link
            href="/#map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B57F50] text-white text-sm font-semibold hover:bg-[#c8934f] transition-colors"
          >
            Open the live map →
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
