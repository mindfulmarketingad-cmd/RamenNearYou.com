import Link from 'next/link'
import { Utensils, MapPin, Landmark } from 'lucide-react'
import { getSiteStats } from '@/lib/restaurants'

const STATS_ICONS = [
  { Icon: Utensils, key: 'restaurants', label: 'restaurants tracked' },
  { Icon: MapPin, key: 'cities', label: 'cities covered' },
  { Icon: Landmark, key: 'states', label: 'states' },
] as const

// Editorial SEO section explaining what RamenNearYou is, who it's for, and
// how it helps — targets "ramen near me" and its close variants with
// substantive, first-person content rather than thin keyword stuffing.
export default function HomepageAbout() {
  const stats = getSiteStats()

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="text-[#96602F] text-xs font-semibold uppercase tracking-widest mb-2">About RamenNearYou</p>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-4">
          The Fastest Way to Find Ramen Near Me
        </h2>

        {/* Real-data credibility row — same counts used in the nav/footer,
            placed here so the "About" pitch opens with proof, not just claims. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 pb-6 border-b border-black/5">
          {STATS_ICONS.map(({ Icon, key, label }) => (
            <span key={key} className="flex items-center gap-1.5 text-sm text-[#1E2026]">
              <Icon className="w-4 h-4 text-[#96602F]" />
              <strong className="font-semibold">{stats[key].toLocaleString()}</strong>
              <span className="text-[#6B6862]">{label}</span>
            </span>
          ))}
        </div>

        <p className="text-[#4B4845] text-[15px] leading-relaxed mb-4 pl-4 border-l-2 border-[#B57F50]/30">
          RamenNearYou exists to answer one question as fast and as accurately as possible: where is the best
          bowl of ramen near me, right now? We built a live search map covering thousands of ramen
          restaurants across the United States — from tiny counter-seat shops to full ramen bars — so that
          typing &ldquo;ramen near me&rdquo; into a search engine isn&apos;t the end of your search, it&apos;s
          the beginning of a much better one. Drop in your ZIP code or tap &ldquo;Use my location,&rdquo; and
          the map instantly sorts every nearby restaurant by distance, rating, and review count, so the
          closest great bowl is always right at the top.
        </p>
        <p className="text-[#4B4845] text-[15px] leading-relaxed mb-4">
          What makes RamenNearYou different from a generic maps search is depth. Every listing carries real
          ratings and review counts, current hours so you know if a kitchen is actually open before you
          drive over, and broth-style tags — tonkotsu, miso, shoyu, shio, tantanmen, and more — so you can
          filter down to exactly the kind of bowl you&apos;re craving instead of scrolling through results
          that don&apos;t match what you want tonight. Craving something rich and creamy? Filter to tonkotsu.
          Want something light and clean after a big lunch? Filter to shio. Need a bowl that&apos;s still
          serving at 11pm? The Open Late filter handles that in one tap.
        </p>

        <h3 className="font-serif text-xl font-bold text-[#1E2026] mt-8 mb-3 flex items-center gap-2.5">
          <span className="w-1.5 h-5 rounded-full bg-[#B57F50]" />
          Who RamenNearYou Is For
        </h3>
        <p className="text-[#4B4845] text-[15px] leading-relaxed mb-4">
          If you&apos;re new to a city and searching &ldquo;ramen near me&rdquo; on your phone, standing
          outside a restaurant deciding whether it&apos;s worth the wait, or a longtime ramen regular hunting
          for the next great bowl in your own neighborhood, this site is built for exactly that moment. We
          also built dedicated pages for specific cravings — <Link href="/find/ramen-open-now" className="link-underline text-[#96602F] font-medium">ramen open now</Link>,{' '}
          <Link href="/find/vegan-ramen" className="link-underline text-[#96602F] font-medium">vegan ramen</Link>,{' '}
          <Link href="/find/tonkotsu-ramen" className="link-underline text-[#96602F] font-medium">tonkotsu ramen</Link>, and{' '}
          <Link href="/find/ramen-delivery" className="link-underline text-[#96602F] font-medium">ramen delivery</Link> — so
          you never have to wade through irrelevant results to get to the bowl you actually want.
        </p>

        <h3 className="font-serif text-xl font-bold text-[#1E2026] mt-8 mb-3 flex items-center gap-2.5">
          <span className="w-1.5 h-5 rounded-full bg-[#B57F50]" />
          How RamenNearYou Helps You Decide
        </h3>
        <p className="text-[#4B4845] text-[15px] leading-relaxed mb-4">
          A star rating alone doesn&apos;t tell you much — a 4.6 built on a rich, hours-simmered broth is a
          completely different restaurant than a 4.6 known for fast service and a thin soup. That&apos;s why
          every restaurant on RamenNearYou links out to a full <Link href="/reviews" className="link-underline text-[#96602F] font-medium">review breakdown</Link> covering
          taste, noodle size, bowl size, broth, and value, plus recent diner comments, so you can judge a
          place on what actually matters to you before you get in the car. Combine that with real-time hours,
          distance sorting, and broth filters, and finding ramen near you stops being a guessing game.
        </p>
        <p className="text-[#4B4845] text-[15px] leading-relaxed">
          Ready to find your next bowl? <Link href="/find" className="link-underline text-[#96602F] font-semibold">Search ramen near you</Link> or{' '}
          <Link href="/cities" className="link-underline text-[#96602F] font-semibold">browse every city and state</Link> in
          our directory.
        </p>
      </div>
    </section>
  )
}
