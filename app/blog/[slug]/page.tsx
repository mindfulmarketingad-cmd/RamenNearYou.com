import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getBlogPost, blogPosts } from '@/lib/blog-posts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  const url = `https://www.ramennearyou.com/blog/${post.slug}`
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'RamenNearYou',
      url: 'https://www.ramennearyou.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RamenNearYou',
      url: 'https://www.ramennearyou.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.ramennearyou.com/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Navbar />
      <main className="min-h-screen bg-[#1a1c22] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-2">
            <Link href="/blog" className="text-sm text-[#77567A] hover:underline">
              ← Back to Blog
            </Link>
          </div>

          <article className="mt-8">
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#77567A]/20 text-[#77567A]">
                  {post.category}
                </span>
                <span className="text-xs text-[#B0B3BB]/60">{post.date}</span>
                <span className="text-xs text-[#B0B3BB]/60">·</span>
                <span className="text-xs text-[#B0B3BB]/60">{post.readTime}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {post.title}
              </h1>
              <p className="text-[#B0B3BB] text-lg leading-relaxed">{post.description}</p>
            </header>

            <div
              className="prose-ramen"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          <div className="mt-16 pt-8 border-t border-white/10">
            <p className="text-[#B0B3BB] text-sm mb-4">Looking for great ramen near you?</p>
            <Link
              href="/cities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#77567A] text-white font-medium text-sm hover:bg-[#8a6a8d] transition-colors"
            >
              Browse Ramen Restaurants →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
