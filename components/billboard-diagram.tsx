import { MapPin, ArrowUpRight, Megaphone } from 'lucide-react'

// A labelled mock of the homepage billboard, so an owner can see exactly what
// they are buying before they pay. Deliberately a diagram and not a real
// screenshot: it stays correct when the homepage art changes, and the callouts
// can name each slot.

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-1.5 py-0.5 rounded bg-amber-400 text-[9px] font-bold uppercase tracking-wider text-neutral-900 align-middle">
      {children}
    </span>
  )
}

export default function BillboardDiagram({
  price,
  period,
  totalSlots,
}: {
  price: string
  period: string
  totalSlots: number
}) {
  return (
    <figure className="m-0">
      <div className="rounded-2xl border border-line/10 overflow-hidden bg-sunken">
        {/* Browser chrome, so the mock reads as "this is the homepage". */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-page border-b border-line/8">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-2 text-[10px] text-ink-soft font-mono truncate">
            ramennearyou.com
          </span>
        </div>

        {/* The billboard itself */}
        <div className="relative bg-neutral-800 bg-[radial-gradient(circle_at_30%_20%,#4b4540,#1c1917)] px-4 py-10 sm:py-14 text-center">
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/10 border border-white/15 text-[9px] font-semibold uppercase tracking-widest text-white/70">
            Your photo, full bleed
          </span>

          <p className="text-white/80 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.25em] mb-2.5">
            Featured Business
          </p>

          <p className="font-serif text-xl sm:text-3xl font-bold text-white leading-tight mb-1">
            Your Restaurant Name
          </p>

          <p className="flex items-center justify-center gap-1 text-white/70 text-[10px] sm:text-xs mb-5">
            <MapPin className="w-3 h-3" /> Your City, ST
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md bg-white/15 border border-white/25 text-white text-[10px] sm:text-xs font-bold">
              <MapPin className="w-3 h-3" /> Get Directions
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md bg-emerald-700 text-white text-[10px] sm:text-xs font-bold">
              Order Now <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          <p className="mt-4 text-[9px] sm:text-[10px] text-white/45">
            Both buttons are yours — directions open Google Maps, Order Now goes
            straight to your site.
          </p>
        </div>

        {/* The "Use This Space" bar, shown greyed because it is what your slot
            replaces. */}
        <div className="bg-[#111827] px-4 py-2.5 text-center">
          <span className="inline-flex items-center gap-1.5 text-white/35 text-[10px] sm:text-xs font-semibold line-through">
            <Megaphone className="w-3 h-3" /> Use This Space
          </span>
          <span className="ml-2 text-[10px] sm:text-xs text-white/35">
            — the sales bar visitors see on an empty slot
          </span>
        </div>

        {/* Hint of the page continuing, so the billboard reads as "above
            everything else" rather than as a floating box. */}
        <div className="bg-page px-4 py-3 border-t border-line/8">
          <div className="h-2 w-1/3 rounded bg-line/15 mb-1.5" />
          <div className="h-2 w-1/2 rounded bg-line/10" />
          <p className="text-[10px] text-ink-soft mt-2">
            ↓ the ramen map and everything else on the site starts here
          </p>
        </div>
      </div>

      <figcaption className="mt-3 text-xs text-ink-soft leading-relaxed">
        <Callout>What you get</Callout>{' '}
        The full-width slot at the very top of the homepage — above the map,
        above every listing. {price}/{period}, and the billboard rotates between
        at most {totalSlots} businesses, so your slot is never buried in a feed.
      </figcaption>
    </figure>
  )
}
