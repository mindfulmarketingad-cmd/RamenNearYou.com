import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { blogPosts } from '@/lib/blog-posts'
import { slugifyAuthor } from '@/lib/perfect-for'

interface Props {
  params: Promise<{ slug: string }>
}

const AUTHOR_BIOS: Record<string, string> = {
  'jackson-hewitt': 'Jackson is a longtime ramen obsessive who travels the country in search of the perfect bowl. He covers regional ramen styles, new openings, and the chefs behind them.',
  'maya-chen': 'Maya is a food writer focused on Japanese cuisine and noodle culture. She digs into the techniques, ingredients, and stories that make each ramen shop unique.',
  'marcus-rivera': 'Marcus is a chef-turned-writer who breaks down what separates a great bowl from a forgettable one — from broth clarity to noodle texture to the perfect chashu.',
}

function getAuthorPosts(slug: string) {
  return blogPosts.filter((p) => p.author && slugifyAuthor(p.author.name) === slug)
}

function getAuthorInfo(slug: string) {
  const posts = getAuthorPosts(slug)
  if (posts.length === 0) return null
  const first = posts.find((p) => p.author)!
  return {
    name: first.author!.name,
    avatar: first.author!.avatar,
    bio: AUTHOR_BIOS[slug] ?? `${first.author!.name} is a contributor at RamenNearYou, writing about the best ramen restaurants across the country.`,
    posts,
  }
}

export function generateStaticParams() {
  const slugs = new Set<string>()
  for (const p of blogPosts) {
    if (p.author) slugs.add(slugifyAuthor(p.author.name))
  }
  return Array.from(slugs).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const info = getAuthorInfo(slug)
  if (!info) return {}
  const url = `https://www.ramennearyou.com/authors/${slug}`
  return {
    title: `${info.name} — Contributor Profile | RamenNearYou`,
    description: info.bio,
    alternates: { canonical: url },
    openGraph: { title: info.name, description: info.bio, url },
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  const info = getAuthorInfo(slug)
  if (!info) notFound()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#ECEAE4] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6862] mb-6 flex-wrap pt-2">
            <Link href="/" className="hover:text-[#1E2026] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-[#1E2026] transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1E2026]">{info.name}</span>
          </nav>

          <header className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-white rounded-2xl border border-black/8 p-6 sm:p-8 mb-10">
            <Image
              src={info.avatar}
              alt={info.name}
              width={96}
              height={96}
              className="rounded-full border border-black/8 shrink-0"
              unoptimized
            />
            <div>
              <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Contributor Profile</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E2026] mb-3">{info.name}</h1>
              <p className="text-[#6B6862] text-sm leading-relaxed">{info.bio}</p>
            </div>
          </header>

          <h2 className="font-serif text-2xl font-bold text-[#1E2026] mb-5">
            Articles by {info.name} ({info.posts.length})
          </h2>
          <ul className="flex flex-col gap-3">
            {info.posts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="block bg-white rounded-xl border border-black/5 p-5 hover:border-[#B57F50]/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#B57F50]/15 text-[#96602F]">
                      {p.category}
                    </span>
                    <span className="text-xs text-[#6B6862]/60">{p.date}</span>
                  </div>
                  <p className="font-semibold text-[#1E2026] text-base leading-snug mb-1">
                    {p.h1 ?? p.title}
                  </p>
                  <p className="text-[#6B6862] text-sm leading-relaxed line-clamp-2">{p.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  )
}
