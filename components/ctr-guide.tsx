import Link from 'next/link'
import { CTR_UPDATED_ISO, CTR_UPDATED_LABEL, type CtrLink, type CtrPageCopy } from '@/lib/ctr-pages'

function faqSchema(copy: CtrPageCopy) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: copy.faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

function webPageSchema(copy: CtrPageCopy) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: copy.title,
    description: copy.description,
    url: copy.url,
    dateModified: CTR_UPDATED_ISO,
  }
}

export function CtrGuide({ copy }: { copy: CtrPageCopy }) {
  return (
    <section className="mb-10" aria-labelledby="ctr-guide-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(copy)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema(copy)) }} />
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink mb-2">{CTR_UPDATED_LABEL}</p>
      <h2 id="ctr-guide-heading" className="font-serif text-xl sm:text-2xl font-bold text-ink mb-3">
        {copy.sectionTitle}
      </h2>
      {copy.paragraphs.map((p) => (
        <p key={p} className="text-ink-soft text-sm leading-relaxed mb-4">{p}</p>
      ))}
      <ul className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
        {copy.links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-brand-ink hover:underline">{l.label}</Link>
          </li>
        ))}
      </ul>
      <h2 className="font-serif text-xl font-bold text-ink mb-5">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {copy.faqs.map(({ q, a }) => (
          <details key={q} className="group border border-line/8 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between gap-3 px-4 py-3.5 cursor-pointer font-semibold text-sm text-ink list-none">
              {q}
              <span className="text-brand-ink shrink-0 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="px-4 pb-4 text-sm text-ink-soft leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function CtrLinkBox({ intro, links }: { intro: string; links: CtrLink[] }) {
  return (
    <aside className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
      <div className="rounded-xl border border-line/8 bg-sunken px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink mb-1">{CTR_UPDATED_LABEL}</p>
        <p className="text-sm text-ink-soft leading-relaxed mb-3">{intro}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm font-medium text-brand-ink hover:underline">{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
