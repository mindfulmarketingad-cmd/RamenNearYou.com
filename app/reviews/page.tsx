import type { Metadata } from 'next'
import Link from 'next/link'
import { QrCode, Star, Printer, TrendingUp } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getReviewSlug, getReviewRestaurants } from '@/lib/reviews'
import ReviewsHubSearch, { type LetterGroup } from './reviews-hub-search'

const FAQS = [
  {
    q: 'How are these ramen restaurant reviews put together?',
    a: 'Each restaurant page pulls in its real Google rating and review count, then breaks the experience down by the things that actually matter for a bowl of ramen — taste, noodle size, bowl size, broth, and value — so you can scan what a place is actually good at instead of just a single star average.',
  },
  {
    q: 'Why should I check reviews before picking a ramen spot?',
    a: 'A star rating alone hides a lot. A 4.6 built on rich broth and huge portions is a very different restaurant than a 4.6 known for fast service but small bowls. Reading the aspect breakdown before you go means you order somewhere that matches what you actually want that night.',
  },
  {
    q: 'I own a ramen restaurant. How do I get more Google reviews?',
    a: 'The single biggest lever is making it effortless to leave one. Our Google Review Card kit gives every table a QR code that opens your restaurant\'s "Write a review" popup on Google in one scan — no searching, no typing your name. Restaurants that hand a card to every table after a good meal see far more reviews land than ones that just hope people remember to leave one later.',
  },
  {
    q: 'Does a higher review count actually help my restaurant?',
    a: 'Yes — on two fronts. More reviews build trust with diners comparing you to the restaurant next door, and Google itself favors listings with a steady stream of recent, genuine reviews in local search and Maps rankings. A restaurant stuck at 40 reviews for two years reads very differently than one racking up new ones every week.',
  },
  {
    q: 'What is the easiest way to ask happy customers for a review?',
    a: 'Ask at the moment they are happiest — right as they are finishing the bowl, not days later in a text they will forget. A QR review card at the table or register removes every bit of friction: they scan, tap a star rating, and they are already on Google\'s review page. That single-scan simplicity is why review cards convert so much better than a verbal ask alone.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export const metadata: Metadata = {
  title: 'Ramen Restaurant Reviews | Taste, Noodle Size, Bowl Size & More',
  description:
    'Browse honest ramen restaurant reviews from across the country — rated on taste, noodle size, bowl size, broth, and value. Find the best ramen near you.',
  alternates: { canonical: 'https://www.ramennearyou.com/reviews' },
}

export default function ReviewsIndexPage() {
  const reviewRestaurants = getReviewRestaurants()

  // Every review page as a plain link, alphabetical by restaurant name and
  // grouped by first letter — same simple hyperlink-list format as /find.
  const links = reviewRestaurants
    .map((r) => ({
      href: `/reviews/${getReviewSlug(r)}`,
      label: `${r.name} — ${r.city}, ${r.stateCode}`,
      sortKey: r.name.toLowerCase(),
    }))
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))

  const groupMap = new Map<string, { href: string; label: string }[]>()
  for (const l of links) {
    const first = l.sortKey.charAt(0)
    const letter = first >= 'a' && first <= 'z' ? first.toUpperCase() : '#'
    if (!groupMap.has(letter)) groupMap.set(letter, [])
    groupMap.get(letter)!.push({ href: l.href, label: l.label })
  }
  const groups: LetterGroup[] = Array.from(groupMap.entries())
    .map(([letter, ls]) => ({ letter, links: ls }))
    .sort((a, b) => (a.letter === '#' ? -1 : b.letter === '#' ? 1 : a.letter.localeCompare(b.letter)))

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-[#F5F4F0] pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">Ramen Restaurant Reviews</h1>
          <p className="text-[#6B6862] text-sm mb-6">
            Reviews for all {reviewRestaurants.length.toLocaleString()} ramen restaurants in our directory — rated on
            taste, noodle size, bowl size, broth, and value. Pick a restaurant to read what diners are saying.
          </p>

          <ReviewsHubSearch groups={groups} total={reviewRestaurants.length} />

          {/* SEO content + owner CTA */}
          <div className="mt-16 pt-12 border-t border-black/8">
            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              How to Read Ramen Reviews the Right Way
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              A single star average hides a lot of useful information. Two restaurants can both sit at 4.6 stars
              and still be completely different experiences — one built on a rich, hours-simmered broth and huge
              portions, the other known for speed and a smaller bowl. That is why every restaurant page here
              breaks the rating down by taste, noodle size, bowl size, broth, and value instead of stopping at a
              single number. Skim the aspect breakdown before you go, not just the star count, and you will end
              up ordering somewhere that actually matches what you are craving that night.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-10">
              I also always check the most recent reviews first rather than the top-voted ones. A kitchen can
              slip or improve over time, and the last few weeks of feedback tell you far more about what to
              expect tonight than a glowing review from two years ago.
            </p>

            <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-4">
              Own a Ramen Restaurant? Your Reviews Are Costing You Customers
            </h2>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-4">
              Every one of the {reviewRestaurants.length.toLocaleString()} restaurants listed on this page is
              being judged, right now, by diners scrolling past on a rating and a review count before they ever
              walk through the door. A restaurant stuck at 40 reviews from three years ago reads as an unknown —
              or worse, forgotten — next to a competitor racking up new five-star reviews every week. Review
              count and recency are themselves a signal, both to diners comparing you to the restaurant next
              door and to Google's own local search and Maps rankings.
            </p>
            <p className="text-[#6B6862] text-sm leading-relaxed mb-6">
              The problem is rarely food quality — it is that almost nobody thinks to leave a review by the time
              they get to their car. Asking verbally works occasionally, but it depends on staff remembering to
              ask and customers remembering to follow through later. The fix is removing every bit of friction
              between "that was a great bowl" and an actual five-star review landing on your listing.
            </p>

            <div className="bg-white rounded-2xl border border-[#B57F50]/20 p-6 sm:p-8 mb-10">
              <div className="grid sm:grid-cols-3 gap-5 mb-6">
                <div className="flex items-start gap-2.5">
                  <QrCode className="w-5 h-5 text-[#B57F50] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#1E2026]"><strong>One scan.</strong> Opens your Google review popup directly — no searching, no typing your name.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Printer className="w-5 h-5 text-[#B57F50] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#1E2026]"><strong>Print-ready kit.</strong> Table tents, counter cards, and stickers — ready for every table and the register.</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <TrendingUp className="w-5 h-5 text-[#B57F50] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#1E2026]"><strong>Scan tracking.</strong> We track every scan, so you can see the QR working without reprinting a thing.</p>
                </div>
              </div>
              <Link
                href="/review-cards"
                className="flex w-full sm:w-auto sm:inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-none bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-bold transition-colors"
              >
                <Star className="w-4 h-4" /> Get Your Google Review Cards
              </Link>
            </div>

            <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <details key={q} className="group border border-black/8 rounded-xl overflow-hidden bg-white">
                  <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                    {q}
                    <span className="text-[#B57F50] shrink-0 group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
