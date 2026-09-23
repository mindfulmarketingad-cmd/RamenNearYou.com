'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, ArrowUpRight, Megaphone } from 'lucide-react'
import type { BillboardSlot } from '@/lib/homepage-billboard'

// The paid hero at the top of the homepage. One business at a time, full
// bleed, with the "Use This Space" bar underneath selling the empty slots.

const ROTATE_MS = 7000

interface Props {
  slots: BillboardSlot[]
  spotsLeft: number
  totalSlots: number
  price: string
  period: string
}

export default function HomepageBillboard({
  slots,
  spotsLeft,
  totalSlots,
  price,
  period,
}: Props) {
  const [index, setIndex] = useState(0)

  // Rotate only when there is something to rotate between, and never for a
  // visitor who asked for reduced motion — a crossfading full-screen image is
  // exactly the kind of thing that setting is for.
  useEffect(() => {
    if (slots.length < 2) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slots.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [slots.length])

  if (slots.length === 0) return null

  const active = slots[Math.min(index, slots.length - 1)]
  const orderHref = active.orderUrl ?? active.listingUrl
  const orderIsExternal = active.orderUrl !== null
  const orderLabel = orderIsExternal ? 'Order Now' : 'View Menu & Hours'

  return (
    <section aria-label="Featured business" className="pt-16 bg-sunken">
      <div className="relative w-full h-[72vh] min-h-[440px] max-h-[760px] overflow-hidden">
        {/* Stacked so a rotation crossfades instead of flashing the page
            background between two images. */}
        {slots.map((s, i) => (
          <div
            key={s.slug}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={s.photo}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
              // Unoptimized on purpose: these are already-sized Google photo
              // CDN URLs, and running a full-bleed hero through Vercel's image
              // optimizer on every homepage view is a bill for no gain.
              unoptimized
            />
          </div>
        ))}

        {/* Scrim. The text sits dead centre over a photo we don't control, so
            this has to be heavy enough to hold contrast on a bright image. */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
          <p className="text-white/85 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            Featured Business
          </p>

          {/* Deliberately a <p>, not a heading. The homepage's real <h1> is the
              map hero's title below; a second one here — on an ad slot whose
              text changes with whoever is paying — would compete with it. */}
          <p className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] max-w-4xl drop-shadow-sm">
            {active.name}
          </p>

          <p className="flex items-center gap-1.5 text-white/80 text-sm mt-4">
            <MapPin className="w-4 h-4 shrink-0" />
            {active.city}, {active.stateCode}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href={active.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-white/15 hover:bg-white/25 backdrop-blur border border-white/25 text-white text-sm sm:text-base font-bold transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Get Directions
            </a>

            {orderIsExternal ? (
              <a
                href={orderHref}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-sm sm:text-base font-bold transition-colors"
              >
                {orderLabel}
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <Link
                href={orderHref}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white text-sm sm:text-base font-bold transition-colors"
              >
                {orderLabel}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {slots.length > 1 && (
            <div className="flex items-center gap-2 mt-10">
              {slots.map((s, i) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show ${s.name}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* "Use This Space" — the sales bar for the slots nobody has bought. */}
      {spotsLeft > 0 && (
        <Link
          href="/featured-listing"
          className="group block bg-[#111827] hover:bg-[#1b2537] transition-colors"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
            <span className="inline-flex items-center gap-1.5 text-white text-sm font-bold">
              <Megaphone className="w-4 h-4 text-amber-400" />
              Use This Space
            </span>
            <span className="text-white/70 text-sm">
              — <span className="text-amber-400 font-semibold">{spotsLeft} of {totalSlots} spots left</span>
              {' '}on this billboard · {price}/{period}.
            </span>
            <span className="inline-flex items-center gap-1 text-white text-sm font-semibold underline underline-offset-4 decoration-white/40 group-hover:decoration-white">
              Claim yours
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      )}
    </section>
  )
}
