import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Thick Noodle Ramen Near Me | Chewy, Wavy Noodles | RamenNearYou',
  description: 'Find thick noodle ramen near you — chewy, wavy noodles with serious bite. Which broths suit thick noodles, why they matter, and how to find a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/thick-noodle-ramen' },
  openGraph: {
    title: 'Thick Noodle Ramen Near Me',
    description: 'Find chewy, thick-noodle ramen near you.',
    url: 'https://www.ramennearyou.com/find/thick-noodle-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ThickNoodleRamenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ErrorBoundary
        fallback={
          <section className="pt-16 bg-[#F5F4F0]">
            <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#B57F50] animate-spin" />
            </div>
          </section>
        }
      >
        <HomeMapHero
          pageTitle="Thick Noodle Ramen Near Me"
          pageDescription="Find ramen restaurants serving thick, chewy noodles near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/thick-noodle-ramen"
        heading="Why I Seek Out Thick Noodle Ramen Near Me"
        intro={[
          'For me, the noodle is half the bowl, and thick noodles bring a chew and presence that thin strands just cannot match. That springy, toothsome bite holding onto a hearty broth is one of ramen’s great pleasures. The map above helps you find ramen near you — enter your ZIP or use your location and look for the shops doing thick, chewy noodles.',
          'Noodle thickness is not a detail; it changes the whole experience and pairs with different broths. Here is why thick noodles matter and where to find them.',
        ]}
        sections={[
          {
            h2: 'Why noodle thickness matters',
            body: (
              <p>
                Thicker noodles have more chew and hold their texture longer in the bowl, so they stand up to
                heavy, robust broths without going soft. They also carry more sauce or broth per bite, which is
                why styles built on intensity — like tsukemen and mazemen — almost always use thick noodles. If
                you have ever wished a bowl had more substance, the noodle gauge was probably the missing piece.
              </p>
            ),
            points: [
              { h3: 'More chew', text: 'Thick, often wavy noodles deliver a satisfying, springy bite that holds up from first slurp to last.' },
              { h3: 'Stands up to rich broth', text: 'They resist going mushy in heavy broths, so the texture stays right even as you take your time.' },
              { h3: 'Carries more flavor', text: 'A thicker strand grabs more broth or tare per bite — ideal for bold, concentrated bowls.' },
            ],
          },
          {
            h2: 'Which styles use thick noodles',
            body: (
              <p>
                Thick noodles are the default for tsukemen (dipping ramen) and mazemen (brothless ramen), where
                texture is everything and there is no thin broth to soak into. Hearty miso ramen, especially the
                Sapporo style, also favors thicker, curlier noodles to match its body. If you want guaranteed
                chew, those styles are the most reliable bet.
              </p>
            ),
          },
          {
            h2: 'How to find thick-noodle bowls',
            body: (
              <p>
                Noodle gauge is not always labeled, so I open listings and check menus and photos — and I lean
                on the styles that reliably use thick noodles. Stack the “Tsukemen” or “Mazemen” filters for a
                near-guarantee of thick, chewy strands, or look for Sapporo-style miso. When in doubt, the shop
                will happily tell you what noodles they use.
              </p>
            ),
          },
        ]}
        tipsHeading="My thick-noodle tips"
        tips={[
          'For guaranteed chew, stack the “Tsukemen” or “Mazemen” filters — both use thick noodles.',
          'Sapporo-style miso ramen is another reliable home for thick, curly noodles.',
          'Thick noodles hold up in rich broths, so take your time without them going soft.',
          'Open listings and skim photos when noodle gauge is not labeled.',
          'Ask the shop — they will happily tell you what noodles they make.',
        ]}
        faqs={[
          { q: 'What is thick noodle ramen?', a: 'It is ramen made with thicker, often wavy noodles that have more chew and hold their texture longer. They suit hearty, intense bowls and styles like tsukemen, mazemen, and Sapporo-style miso.' },
          { q: 'Why do some ramen use thick noodles?', a: 'Thick noodles stand up to rich, robust broths without going mushy and carry more broth or tare per bite, which is why intense styles like tsukemen and mazemen rely on them.' },
          { q: 'Which ramen styles have the thickest noodles?', a: 'Tsukemen and mazemen almost always use thick, chewy noodles, and Sapporo-style miso favors thicker, curlier ones. Filter to those styles for a reliable chew.' },
          { q: 'Are thick or thin noodles better?', a: 'Neither — it is about matching the broth. Thick noodles suit heavy, concentrated bowls; thin noodles suit light, clear or creamy ones like Hakata tonkotsu. It comes down to preference.' },
          { q: 'How do I find thick noodle ramen near me?', a: 'Use the map above to find ramen nearby, then favor tsukemen, mazemen, or Sapporo miso, and check menus and photos on each listing for noodle style.' },
        ]}
      />
    </main>
  )
}
