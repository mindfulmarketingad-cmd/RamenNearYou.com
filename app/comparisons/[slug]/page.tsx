import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getAllComparisons, getComparison } from '@/lib/broth-comparisons'
import { slugifyAuthor } from '@/lib/perfect-for'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) return {}
  const url = `https://www.ramennearyou.com/comparisons/${cmp.slug}`
  return {
    title: cmp.title,
    description: cmp.description,
    alternates: { canonical: url },
    openGraph: {
      title: cmp.h1,
      description: cmp.description,
      type: 'article',
      url,
    },
  }
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) notFound()

  const url = `https://www.ramennearyou.com/comparisons/${cmp.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cmp.h1,
    description: cmp.description,
    author: { '@type': 'Person', name: cmp.author.name },
    publisher: {
      '@type': 'Organization',
      name: 'RamenNearYou',
      url: 'https://www.ramennearyou.com',
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.ramennearyou.com' },
      { '@type': 'ListItem', position: 2, name: 'Comparisons', item: 'https://www.ramennearyou.com/comparisons' },
      { '@type': 'ListItem', position: 3, name: cmp.h1, item: url },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cmp.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap pt-2">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/comparisons" className="hover:text-[#1E2026] transition-colors">Comparisons</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{cmp.h1}</span>
          </nav>

          <article className="mt-4">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#B57F50]/20 text-[#96602F]">
                  Broth Comparison
                </span>
                <span className="text-xs text-[#6B6862]/60">8 min read</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1E2026] leading-tight mb-4">
                {cmp.h1}
              </h1>
              <p className="text-[#6B6862] text-lg leading-relaxed mb-5">{cmp.description}</p>

              <Link
                href={`/authors/${slugifyAuthor(cmp.author.name)}`}
                className="inline-flex items-center gap-2.5 group mb-8"
              >
                <Image
                  src={cmp.author.avatar}
                  alt={cmp.author.name}
                  width={36}
                  height={36}
                  className="rounded-full border border-black/8"
                  unoptimized
                />
                <div>
                  <p className="text-sm font-medium text-[#1E2026] group-hover:text-[#96602F] transition-colors">{cmp.author.name}</p>
                  <p className="text-xs text-[#6B6862]/60">Contributor profile →</p>
                </div>
              </Link>

              {/* Featured image */}
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-[#D6D4CE]">
                <Image
                  src={cmp.featuredImage.src}
                  alt={cmp.featuredImage.alt}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </header>

            <div
              className="prose-ramen"
              dangerouslySetInnerHTML={{ __html: cmp.content }}
            />
          </article>

          <div className="mt-16 pt-8 border-t border-black/8">
            <p className="text-[#6B6862] text-sm mb-4">Hungry yet? Find your next bowl near you.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={cmp.a.nearMePath}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-none bg-[#B57F50] text-white font-medium text-sm hover:bg-[#c8934f] transition-colors"
              >
                {cmp.a.name} Ramen Near Me →
              </Link>
              <Link
                href={cmp.b.nearMePath}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-none bg-[#1E2026] text-white font-medium text-sm hover:bg-black transition-colors"
              >
                {cmp.b.name} Ramen Near Me →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
