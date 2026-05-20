import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { blogPosts } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Ramen Blog — Recipes, Tips & Guides',
  description: 'Learn how to make ramen at home, discover broth types, and explore the culture behind the bowl. Recipes, guides, and more.',
  alternates: { canonical: 'https://www.ramennearyou.com/blog' },
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">The Ramen Blog</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">Recipes, Tips & Ramen Culture</h1>
            <p className="text-[#6B6862] text-lg">Everything you need to know about making, eating, and finding great ramen.</p>
          </div>

          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-[#ffffff] rounded-xl p-6 sm:p-8 border border-black/5 hover:border-[#B57F50]/40 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#B57F50]/20 text-[#B57F50]">
                    {post.category}
                  </span>
                  <span className="text-xs text-[#6B6862]/60">{post.date}</span>
                  <span className="text-xs text-[#6B6862]/60">·</span>
                  <span className="text-xs text-[#6B6862]/60">{post.readTime}</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E2026] mb-2 group-hover:text-[#B57F50] transition-colors">
                  {post.title}
                </h2>
                <p className="text-[#6B6862] text-sm leading-relaxed">{post.description}</p>
                <div className="mt-4 text-[#B57F50] text-sm font-medium group-hover:underline">
                  Read article →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
