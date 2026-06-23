import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'ICHIRAN Ramen Near Me | Find an ICHIRAN Location | RamenNearYou',
  description: 'Find ICHIRAN near you — the famous solo-booth tonkotsu chain with its signature order sheet. What makes ICHIRAN unique, how the booths work, and nearby alternatives.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ichiran-ramen' },
  openGraph: {
    title: 'ICHIRAN Ramen Near Me',
    description: 'Find an ICHIRAN ramen location near you.',
    url: 'https://www.ramennearyou.com/find/ichiran-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function IchiranRamenPage() {
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
          initialQuery="ichiran"
          pageTitle="ICHIRAN Ramen Near Me"
          pageDescription="Find an ICHIRAN ramen location near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ichiran-ramen"
        heading="How to Find ICHIRAN Ramen Near Me"
        intro={[
          'ICHIRAN is one of the most distinctive ramen experiences in the world — solo “flavor concentration booths,” a paper order sheet where you customize every detail, and a single, laser-focused tonkotsu bowl. The map above is set to find ICHIRAN locations near you; enter your ZIP or use your location to see the closest one, plus how it works and where to go if there is not one nearby.',
          'ICHIRAN does one thing and does it obsessively. Here is what makes it unique and how to get your perfect bowl.',
        ]}
        sections={[
          {
            h2: 'What makes ICHIRAN unique',
            body: (
              <p>
                ICHIRAN serves a single dish — a classic Hakata tonkotsu — but the experience is the draw. You
                sit in an individual booth designed to let you focus entirely on the ramen, and you order via a
                detailed sheet where you specify broth richness, garlic, scallion, spice level (their signature
                red sauce), noodle firmness, and more. The staff pass your bowl through a small window, and you
                can eat in near-solitude. It is ramen as a personal ritual.
              </p>
            ),
            points: [
              { h3: 'Solo booths', text: 'Individual “flavor concentration” stalls let you focus entirely on the bowl — famously great for eating alone.' },
              { h3: 'The order sheet', text: 'Customize broth strength, richness, garlic, scallion, noodle firmness, and the signature spicy red sauce.' },
              { h3: 'One perfected bowl', text: 'ICHIRAN makes only tonkotsu, refined obsessively — depth over breadth.' },
            ],
          },
          {
            h2: 'How to order at ICHIRAN',
            body: (
              <p>
                Take your time with the order sheet — it is the whole point. For a first visit I suggest medium
                richness, medium garlic, the original (or level 2) red sauce, and firm noodles. If you finish
                your noodles and still have broth, order kaedama (extra noodles) by pressing the call button.
                It is a fun, hyper-customizable way to learn exactly how you like your tonkotsu.
              </p>
            ),
          },
          {
            h2: 'No ICHIRAN nearby? Find a tonkotsu spot',
            body: (
              <p>
                ICHIRAN has only a handful of U.S. locations, so there is a good chance the nearest one is far.
                If so, the map can find a local Hakata-style tonkotsu shop with the same thin noodles and creamy
                broth. Clear the search and stack the “Tonkotsu” filter, then add “Top Rated” to find the
                best-reviewed bowls near you — you may discover a new favorite without the wait.
              </p>
            ),
          },
        ]}
        tipsHeading="My ICHIRAN tips"
        tips={[
          'Enter your ZIP or use your location to find the nearest ICHIRAN, sorted by distance.',
          'Take your time with the order sheet — customizing the bowl is the whole experience.',
          'First visit? Try medium richness and garlic, original red sauce, and firm noodles.',
          'Still have broth? Order kaedama (extra noodles) via the call button.',
          'No ICHIRAN nearby? Clear the search and stack “Tonkotsu” + “Top Rated” for a local equal.',
        ]}
        faqs={[
          { q: 'What is ICHIRAN known for?', a: 'ICHIRAN is famous for individual solo dining booths, a detailed order sheet to customize every aspect of your bowl, and a single, obsessively refined Hakata tonkotsu ramen with a signature spicy red sauce.' },
          { q: 'How does ordering at ICHIRAN work?', a: 'You fill out a paper sheet choosing broth richness, garlic, scallion, spice level (the red sauce), noodle firmness, and more. Staff deliver the bowl through a small window to your private booth.' },
          { q: 'What should I order at ICHIRAN for the first time?', a: 'Try medium richness, medium garlic, the original or level-2 red sauce, and firm noodles. If you still have broth at the end, order kaedama (extra noodles).' },
          { q: 'How do I find an ICHIRAN near me?', a: 'The map above is set to find ICHIRAN locations. Enter your ZIP or tap “Use my location” to see the closest ones — note there are only a handful of U.S. locations.' },
          { q: 'What if there is no ICHIRAN near me?', a: 'Clear the search and stack the “Tonkotsu” filter to find a local Hakata-style shop with the same thin noodles and creamy broth, then add “Top Rated” for the best nearby.' },
        ]}
      />
    </main>
  )
}
