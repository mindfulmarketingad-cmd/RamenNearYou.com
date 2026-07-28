import type { ReactNode } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import FindCrossLinks from '@/components/find-cross-links'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import UgcFeature from '@/components/ugc-feature'
import AdUnitInArticle from '@/components/ad-unit-in-article'
import { pickStockPhoto } from '@/lib/stock-photos'

export type FindFaq = { q: string; a: string }
export type FindSubPoint = { h3: string; text: string }
export type FindSection = { h2: string; body: ReactNode; points?: FindSubPoint[] }

interface Props {
  currentHref: string
  /** Main editorial H2 that opens the article (first-person, keyword-rich). */
  heading: string
  /** 2–3 intro paragraphs as plain strings. */
  intro: string[]
  /** Deep-dive H2 sections, each optionally with H3 sub-points. */
  sections: FindSection[]
  /** Optional "tips" list heading + items. */
  tipsHeading?: string
  tips?: string[]
  /** Expanded FAQ — also emitted as FAQPage JSON-LD so schema matches the page. */
  faqs: FindFaq[]
  /** Optional callout linking a related in-depth blog guide, rendered under
   *  the intro — internal linking from the map pages into the editorial. */
  guideLink?: { href: string; title: string; blurb: string }
}

// Shared rich content block for every /find map page. Renders a substantial,
// first-person article (intro + multiple H2/H3 sections + tips + FAQ) beneath
// the map, plus the FAQ structured data, internal links, and footer — so each
// page is genuinely useful for its search term instead of a thin stub.
export default function FindPageContent({
  currentHref,
  heading,
  intro,
  sections,
  tipsHeading,
  tips,
  faqs,
  guideLink,
}: Props) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="relative z-10 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Editorial photo — every /find guide article gets at least one image */}
        <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-8">
          <RestaurantImage src={pickStockPhoto(currentHref)} alt={heading} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
        </div>

        {/* Intro */}
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E2026] mb-4">{heading}</h2>

        <div className="mb-4">
          <AdUnitInArticle />
        </div>

        {intro.map((p, i) => (
          <p key={i} className="text-[#6B6862] text-[15px] leading-relaxed mb-4">{p}</p>
        ))}

        {/* Related in-depth guide — internal link from the map page into the blog */}
        {guideLink && (
          <Link
            href={guideLink.href}
            className="group flex items-start gap-3 mt-6 p-4 rounded-xl border border-[#B57F50]/25 bg-[#F5F4F0] hover:border-[#B57F50]/50 transition-colors"
          >
            <BookOpen className="w-5 h-5 text-[#96602F] shrink-0 mt-0.5" />
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-[#96602F] mb-1">
                Read the guide
              </span>
              <span className="block text-[#1E2026] font-semibold text-[15px] group-hover:text-[#96602F] transition-colors">
                {guideLink.title}
              </span>
              <span className="block text-[#6B6862] text-[13px] leading-snug mt-0.5">{guideLink.blurb}</span>
            </span>
          </Link>
        )}

        {/* Deep-dive sections */}
        {sections.map((s) => (
          <section key={s.h2} className="mt-10">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-3">{s.h2}</h2>
            <div className="text-[#6B6862] text-[15px] leading-relaxed space-y-4">{s.body}</div>
            {s.points && s.points.length > 0 && (
              <div className="mt-5 space-y-4">
                {s.points.map((pt) => (
                  <div key={pt.h3}>
                    <h3 className="text-[#1E2026] font-semibold text-base mb-1">{pt.h3}</h3>
                    <p className="text-[#6B6862] text-[15px] leading-relaxed">{pt.text}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}

        {/* Tips list */}
        {tips && tips.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-4">
              {tipsHeading ?? 'My quick tips'}
            </h2>
            <ul className="space-y-2.5">
              {tips.map((t, i) => (
                <li key={i} className="flex gap-2.5 text-[#6B6862] text-[15px] leading-relaxed">
                  <span className="text-[#96602F] shrink-0 mt-0.5">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-5">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <details key={q} className="group border border-black/8 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-[#1E2026] list-none">
                  {q}
                  <span className="text-[#96602F] shrink-0 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-[#6B6862] leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </article>

      <UgcFeature seed={currentHref} />
      <FindCrossLinks currentHref={currentHref} />
      <Footer />
    </div>
  )
}
