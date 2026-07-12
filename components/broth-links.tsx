import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BrothLink {
  title: string
  description: string
  href: string
}

interface Props {
  links: BrothLink[]
}

export default function BrothLinks({ links }: Props) {
  return (
    <section className="broth-carousel-section py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {links.map((link) => (
          <div key={link.href}>
            <Link href={link.href} className="group inline-flex items-center gap-2">
              <h2 className="broth-carousel-title font-serif text-3xl sm:text-4xl font-bold group-hover:text-[#96602F] transition-colors">
                {link.title}
              </h2>
              <ChevronRight className="w-6 h-6 text-[#96602F] shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="broth-carousel-desc text-sm sm:text-base max-w-2xl leading-relaxed mt-3">
              {link.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
