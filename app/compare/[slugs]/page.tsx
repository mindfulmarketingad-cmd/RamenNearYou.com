import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Star, MapPin, Check, X, ExternalLink, ArrowLeftRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { restaurants, type Restaurant } from '@/lib/restaurants'

/* ─── helpers ─────────────────────────────────────────────────── */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function todayHours(r: Restaurant): string {
  const day = DAYS[new Date().getDay()]
  return r.hours?.[day]?.join(', ') ?? 'Closed'
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-[#9B9490]">N/A</span>
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <span className="inline-flex items-center gap-0.5 flex-wrap">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 shrink-0 ${
            i <= full
              ? 'text-amber-400 fill-amber-400'
              : i === full + 1 && half
              ? 'text-amber-300 fill-amber-200'
              : 'text-black/15'
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-bold text-[#1E2026]">{rating.toFixed(1)}</span>
    </span>
  )
}

function BoolCell({ val }: { val: boolean | undefined | null }) {
  if (val == null) return <span className="text-[#9B9490] text-sm">N/A</span>
  return val ? (
    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-sm">
      <Check className="w-4 h-4 shrink-0" />Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[#9B9490] text-sm">
      <X className="w-4 h-4 shrink-0" />No
    </span>
  )
}

/* ─── row definitions ─────────────────────────────────────────── */
type Row = {
  section: string
  label: string
  render: (r: Restaurant) => React.ReactNode
  raw: (r: Restaurant) => string
}

function buildRows(): Row[] {
  return [
    /* Overview */
    {
      section: 'Overview',
      label: 'Rating',
      render: r => <StarRating rating={r.rating} />,
      raw: r => r.rating?.toFixed(1) ?? '',
    },
    {
      section: 'Overview',
      label: 'Total Reviews',
      render: r =>
        r.reviewCount
          ? <span className="text-sm text-[#1E2026]">{r.reviewCount.toLocaleString()}</span>
          : <span className="text-[#9B9490] text-sm">N/A</span>,
      raw: r => String(r.reviewCount ?? ''),
    },
    {
      section: 'Overview',
      label: 'Price Range',
      render: r =>
        r.priceRange
          ? <span className="text-sm text-[#1E2026] font-medium">{r.priceRange}</span>
          : <span className="text-[#9B9490] text-sm">N/A</span>,
      raw: r => r.priceRange ?? '',
    },
    {
      section: 'Overview',
      label: 'Business Status',
      render: r => (
        <span
          className={`text-sm font-semibold ${
            r.businessStatus === 'OPERATIONAL' ? 'text-emerald-600' : 'text-red-500'
          }`}
        >
          {r.businessStatus === 'OPERATIONAL' ? 'Operational' : r.businessStatus ?? 'Unknown'}
        </span>
      ),
      raw: r => r.businessStatus ?? '',
    },
    {
      section: 'Overview',
      label: 'Cuisine Types',
      render: r =>
        r.subtypes
          ? <span className="text-sm text-[#1E2026]">{r.subtypes}</span>
          : <span className="text-[#9B9490] text-sm">N/A</span>,
      raw: r => r.subtypes ?? '',
    },
    /* Location */
    {
      section: 'Location',
      label: 'Address',
      render: r =>
        r.address
          ? <span className="text-sm text-[#1E2026] leading-snug">{r.address}</span>
          : <span className="text-[#9B9490] text-sm">N/A</span>,
      raw: r => r.address ?? '',
    },
    {
      section: 'Location',
      label: 'City',
      render: r => <span className="text-sm text-[#1E2026]">{r.city}</span>,
      raw: r => r.city ?? '',
    },
    {
      section: 'Location',
      label: 'State',
      render: r => <span className="text-sm text-[#1E2026]">{r.state}</span>,
      raw: r => r.state ?? '',
    },
    {
      section: 'Location',
      label: 'ZIP Code',
      render: r =>
        r.postalCode
          ? <span className="text-sm text-[#1E2026]">{r.postalCode}</span>
          : <span className="text-[#9B9490] text-sm">N/A</span>,
      raw: r => r.postalCode ?? '',
    },
    /* Contact */
    {
      section: 'Contact',
      label: 'Phone',
      render: r =>
        r.phone ? (
          <a href={`tel:${r.phone}`} className="text-[#B57F50] hover:underline text-sm">
            {r.phone}
          </a>
        ) : (
          <span className="text-[#9B9490] text-sm">N/A</span>
        ),
      raw: r => r.phone ?? '',
    },
    {
      section: 'Contact',
      label: 'Website',
      render: r =>
        r.website ? (
          <a
            href={r.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#B57F50] hover:underline text-sm"
          >
            Visit site <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[#9B9490] text-sm">N/A</span>
        ),
      raw: r => r.website ?? '',
    },
    {
      section: 'Contact',
      label: 'Google Maps',
      render: r =>
        r.googleMapsLink ? (
          <a
            href={r.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[#B57F50] hover:underline text-sm"
          >
            View map <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-[#9B9490] text-sm">N/A</span>
        ),
      raw: r => (r.googleMapsLink ? 'yes' : ''),
    },
    /* Hours */
    {
      section: 'Hours',
      label: "Today's Hours",
      render: r => <span className="text-sm text-[#1E2026]">{todayHours(r)}</span>,
      raw: r => todayHours(r),
    },
    ...(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const).map(
      day => ({
        section: 'Hours',
        label: day,
        render: (r: Restaurant) => {
          const h = r.hours?.[day]?.join(', ')
          return h ? (
            <span className="text-sm text-[#1E2026]">{h}</span>
          ) : (
            <span className="text-[#9B9490] text-sm">Closed</span>
          )
        },
        raw: (r: Restaurant) => r.hours?.[day]?.join(', ') ?? '',
      })
    ),
    /* Amenities */
    {
      section: 'Amenities',
      label: 'Dine-in',
      render: r => <BoolCell val={r.amenities?.dineIn} />,
      raw: r => String(r.amenities?.dineIn ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Takeout',
      render: r => <BoolCell val={r.amenities?.takeout} />,
      raw: r => String(r.amenities?.takeout ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Delivery',
      render: r => <BoolCell val={r.amenities?.delivery} />,
      raw: r => String(r.amenities?.delivery ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Outdoor Seating',
      render: r => <BoolCell val={r.amenities?.outdoorSeating} />,
      raw: r => String(r.amenities?.outdoorSeating ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Reservations',
      render: r => <BoolCell val={r.amenities?.acceptsReservations} />,
      raw: r => String(r.amenities?.acceptsReservations ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Alcohol Served',
      render: r => <BoolCell val={r.amenities?.alcohol} />,
      raw: r => String(r.amenities?.alcohol ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Vegan Options',
      render: r => <BoolCell val={r.amenities?.veganOptions} />,
      raw: r => String(r.amenities?.veganOptions ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Vegetarian Options',
      render: r => <BoolCell val={r.amenities?.vegetarianOptions} />,
      raw: r => String(r.amenities?.vegetarianOptions ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Wheelchair Accessible',
      render: r => <BoolCell val={r.amenities?.wheelchairAccessible} />,
      raw: r => String(r.amenities?.wheelchairAccessible ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Parking',
      render: r => <BoolCell val={r.amenities?.parking} />,
      raw: r => String(r.amenities?.parking ?? ''),
    },
    {
      section: 'Amenities',
      label: 'Credit Cards',
      render: r => <BoolCell val={r.amenities?.creditCards} />,
      raw: r => String(r.amenities?.creditCards ?? ''),
    },
    /* Vibe */
    {
      section: 'Vibe',
      label: 'Casual',
      render: r => <BoolCell val={r.amenities?.casual} />,
      raw: r => String(r.amenities?.casual ?? ''),
    },
    {
      section: 'Vibe',
      label: 'Cozy',
      render: r => <BoolCell val={r.amenities?.cozy} />,
      raw: r => String(r.amenities?.cozy ?? ''),
    },
    {
      section: 'Vibe',
      label: 'Trendy',
      render: r => <BoolCell val={r.amenities?.trendy} />,
      raw: r => String(r.amenities?.trendy ?? ''),
    },
    {
      section: 'Vibe',
      label: 'Family-Friendly',
      render: r => <BoolCell val={r.amenities?.familyFriendly} />,
      raw: r => String(r.amenities?.familyFriendly ?? ''),
    },
  ]
}

/* ─── metadata ────────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string }>
}): Promise<Metadata> {
  const { slugs } = await params
  const idx = slugs.indexOf('-vs-')
  if (idx === -1) return { title: 'Compare Restaurants | RamenNearYou' }
  const [slugA, slugB] = [slugs.slice(0, idx), slugs.slice(idx + 4)]
  const a = restaurants.find(r => r.slug === slugA)
  const b = restaurants.find(r => r.slug === slugB)
  if (!a || !b) return { title: 'Compare Restaurants | RamenNearYou' }
  return {
    title: `${a.name} vs ${b.name} | RamenNearYou`,
    description: `Compare ${a.name} in ${a.city} vs ${b.name} in ${b.city}. Side-by-side ratings, hours, amenities, and more.`,
  }
}

/* ─── page ────────────────────────────────────────────────────── */
export default async function CompareSlugPage({
  params,
}: {
  params: Promise<{ slugs: string }>
}) {
  const { slugs } = await params

  // Parse "slug-a-vs-slug-b" — split on first occurrence of "-vs-"
  const idx = slugs.indexOf('-vs-')
  if (idx === -1) notFound()
  const slugA = slugs.slice(0, idx)
  const slugB = slugs.slice(idx + 4)

  const a = restaurants.find(r => r.slug === slugA)
  const b = restaurants.find(r => r.slug === slugB)
  if (!a || !b) notFound()

  const rows = buildRows()
  const sections = [...new Set(rows.map(r => r.section))]

  return (
    <main className="min-h-screen bg-[#F5F4F0]">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#9B9490] mb-5 flex-wrap">
            <Link href="/" className="hover:text-[#B57F50] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-[#B57F50] transition-colors">Compare</Link>
            <span>/</span>
            <span className="text-[#6B6862] truncate">{a.name} vs {b.name}</span>
          </nav>

          {/* H1 */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-8 leading-tight">
            {a.name} vs {b.name}
          </h1>

          {/* Hero cards */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_72px_1fr] gap-4 sm:gap-3 items-stretch mb-6">
            {/* Card A */}
            <div className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm flex flex-col">
              {a.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <div className="h-44 overflow-hidden">
                  <img src={a.photo} alt={a.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex flex-col gap-1.5">
                <Link
                  href={`/${a.citySlug}/${a.stateSlug}/${a.slug}`}
                  className="font-serif text-lg font-bold text-[#1E2026] hover:text-[#B57F50] transition-colors leading-snug"
                >
                  {a.name}
                </Link>
                <p className="flex items-center gap-1 text-xs text-[#6B6862]">
                  <MapPin className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
                  {a.address || `${a.city}, ${a.stateCode}`}
                </p>
                {a.rating && (
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={a.rating} />
                    <span className="text-xs text-[#9B9490]">
                      ({a.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                )}
                {a.priceRange && (
                  <span className="text-xs text-[#6B6862] font-medium">{a.priceRange}</span>
                )}
              </div>
            </div>

            {/* VS */}
            <div className="flex items-center justify-center py-4 sm:py-0">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#1E2026] text-white shadow-lg shrink-0">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
            </div>

            {/* Card B */}
            <div className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm flex flex-col">
              {b.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <div className="h-44 overflow-hidden">
                  <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex flex-col gap-1.5">
                <Link
                  href={`/${b.citySlug}/${b.stateSlug}/${b.slug}`}
                  className="font-serif text-lg font-bold text-[#1E2026] hover:text-[#B57F50] transition-colors leading-snug"
                >
                  {b.name}
                </Link>
                <p className="flex items-center gap-1 text-xs text-[#6B6862]">
                  <MapPin className="w-3.5 h-3.5 text-[#B57F50] shrink-0" />
                  {b.address || `${b.city}, ${b.stateCode}`}
                </p>
                {b.rating && (
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={b.rating} />
                    <span className="text-xs text-[#9B9490]">
                      ({b.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                )}
                {b.priceRange && (
                  <span className="text-xs text-[#6B6862] font-medium">{b.priceRange}</span>
                )}
              </div>
            </div>
          </div>

          {/* About sections */}
          {(a.description || b.description) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[a, b].map(r => (
                r.description ? (
                  <div key={r.slug} className="bg-white rounded-xl border border-black/5 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-[#B57F50] uppercase tracking-widest mb-2">
                      About {r.name}
                    </p>
                    <p className="text-sm text-[#6B6862] leading-relaxed">
                      {r.description}
                    </p>
                  </div>
                ) : <div key={r.slug} />
              ))}
            </div>
          )}

          {/* Swap / change links */}
          <div className="flex items-center justify-center gap-3 mb-8 text-xs flex-wrap">
            <Link href={`/compare/${b.slug}-vs-${a.slug}`} className="text-[#9B9490] hover:text-[#B57F50] transition-colors">
              ⇄ Swap order
            </Link>
            <span className="text-[#9B9490]">·</span>
            <Link href={`/compare?a=${a.slug}`} className="text-[#9B9490] hover:text-[#B57F50] transition-colors">
              Change Restaurant B
            </Link>
            <span className="text-[#9B9490]">·</span>
            <Link href={`/compare?a=${b.slug}`} className="text-[#9B9490] hover:text-[#B57F50] transition-colors">
              Change Restaurant A
            </Link>
            <span className="text-[#9B9490]">·</span>
            <Link href="/compare" className="text-[#9B9490] hover:text-[#B57F50] transition-colors">
              Start over
            </Link>
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">

            {/* Sticky column header */}
            <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] border-b-2 border-black/8 bg-white sticky top-0 z-10 shadow-sm">
              <div className="px-4 sm:px-5 py-3.5 bg-[#F5F4F0] border-r border-black/5">
                <span className="text-[10px] font-semibold text-[#9B9490] uppercase tracking-widest">
                  Feature
                </span>
              </div>
              <div className="px-4 sm:px-5 py-3.5 border-r border-black/5">
                <p className="text-sm font-bold text-[#1E2026] truncate">{a.name}</p>
                <p className="text-[10px] text-[#9B9490] truncate mt-0.5">
                  {a.city}, {a.stateCode}
                </p>
              </div>
              <div className="px-4 sm:px-5 py-3.5">
                <p className="text-sm font-bold text-[#1E2026] truncate">{b.name}</p>
                <p className="text-[10px] text-[#9B9490] truncate mt-0.5">
                  {b.city}, {b.stateCode}
                </p>
              </div>
            </div>

            {/* Sections */}
            {sections.map(section => {
              const sectionRows = rows.filter(r => r.section === section)
              return (
                <div key={section}>
                  {/* Section label */}
                  <div className="grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr]">
                    <div className="col-span-3 px-4 sm:px-5 py-2 bg-[#F5F4F0] border-y border-black/5">
                      <span className="text-[10px] font-bold text-[#B57F50] uppercase tracking-widest">
                        {section}
                      </span>
                    </div>
                  </div>

                  {/* Rows */}
                  {sectionRows.map((row, i) => {
                    const rawA = row.raw(a)
                    const rawB = row.raw(b)
                    const isDiff = rawA !== rawB
                    return (
                      <div
                        key={row.label}
                        className={`grid grid-cols-[140px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] border-b border-black/5 last:border-0 ${
                          isDiff ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF9]'
                        }`}
                      >
                        {/* Label */}
                        <div
                          className={`px-4 sm:px-5 py-3 border-r border-black/5 flex items-center ${
                            isDiff ? 'border-l-[3px] border-l-amber-400' : ''
                          }`}
                        >
                          <span className="text-xs font-medium text-[#6B6862] leading-snug">
                            {row.label}
                          </span>
                        </div>

                        {/* Value A */}
                        <div className="px-4 sm:px-5 py-3 border-r border-black/5 flex items-center min-w-0">
                          <span className="min-w-0">{row.render(a)}</span>
                        </div>

                        {/* Value B */}
                        <div className="px-4 sm:px-5 py-3 flex items-center min-w-0">
                          <span className="min-w-0">{row.render(b)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 flex items-center gap-2 text-xs text-[#9B9490]">
            <span className="w-3 h-3 rounded-sm bg-amber-50 border-l-2 border-amber-400 inline-block shrink-0" />
            Highlighted rows indicate a difference between the two restaurants
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-[#6B6862] text-sm mb-4">
              Want to compare different restaurants?
            </p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold transition-colors shadow-md"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Start a new comparison
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  )
}
