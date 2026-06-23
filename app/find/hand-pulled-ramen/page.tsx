import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hand Pulled Ramen Near Me | Fresh Hand-Pulled Noodles | RamenNearYou',
  description: 'Find hand pulled ramen near you — fresh noodles stretched by hand for incredible chew and bite. What hand-pulled noodles are, where to find them, and how to order.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/hand-pulled-ramen' },
  openGraph: {
    title: 'Hand Pulled Ramen Near Me',
    description: 'Find fresh, hand-pulled ramen noodles near you.',
    url: 'https://www.ramennearyou.com/find/hand-pulled-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function HandPulledRamenPage() {
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
          pageTitle="Hand Pulled Ramen Near Me"
          pageDescription="Find ramen with fresh, hand-pulled noodles near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/hand-pulled-ramen"
        heading="Where I Find Hand Pulled Ramen Near Me"
        intro={[
          'Watching a cook take a single lump of dough and stretch, fold, and snap it into a bowl of perfectly even noodles never gets old — and the noodles that come out of it have a chew and freshness that machine-cut strands just cannot match. The map above helps you find ramen near you; enter your ZIP or use your location, then look for the hand-pulled noodle shops, which I will show you how to spot below.',
          'Hand-pulled noodles (often called la mian) are a craft, and the shops that make them tend to take everything seriously. Here is what hand-pulled ramen actually is, where to find it, and how I order it.',
        ]}
        sections={[
          {
            h2: 'What hand-pulled ramen noodles are',
            body: (
              <p>
                Hand-pulled noodles are made by repeatedly stretching and folding a single piece of dough,
                doubling the strands with each pull until one rope becomes dozens of thin, even noodles — all by
                hand, to order. The technique comes from Chinese la mian and is most famous in Lanzhou beef
                noodle soup, but you will find it at many noodle shops. Because the dough is worked and pulled
                fresh, the noodles have a springy, elastic bite (what the Japanese call koshi) that you simply
                cannot get from dried or pre-cut noodles.
              </p>
            ),
            points: [
              { h3: 'Pulled to order', text: 'The dough is stretched moments before it hits the water, so the noodles are about as fresh as noodles can be.' },
              { h3: 'Incredible chew', text: 'Hand-pulling develops the gluten and gives the noodles a springy, satisfying bite that holds up in broth.' },
              { h3: 'Choose your width', text: 'Many shops let you pick a thickness, from ultra-thin strands to wide, belt-like noodles, all from the same dough.' },
            ],
          },
          {
            h2: 'Where to find hand-pulled noodles',
            body: (
              <p>
                The most reliable place to find hand-pulled noodles is a Lanzhou beef noodle or la mian shop —
                look for &quot;Lanzhou,&quot; &quot;la mian,&quot; or &quot;hand-pulled&quot; in the name or on
                the menu. Some Japanese ramen-yas and broader noodle houses pull noodles in-house too. Since the
                technique is not always advertised, I open a few listings, scan the photos and reviews for
                hand-pulled mentions, and when in doubt, just ask — shops that pull their own noodles are proud
                of it and usually do it right in the open.
              </p>
            ),
          },
          {
            h2: 'How I order hand-pulled ramen',
            body: (
              <p>
                I start by choosing my noodle width — a medium gauge is a great first try, then I explore
                thinner or wider on later visits. At a Lanzhou shop I get the classic beef noodle soup with a
                spoon of chili oil; at a Japanese spot I pair hand-pulled noodles with whatever broth the
                kitchen is known for. Either way, I eat them promptly: fresh-pulled noodles are at their springy
                best in the first few minutes, so dig in while the texture is perfect.
              </p>
            ),
          },
        ]}
        tipsHeading="My hand-pulled ramen tips"
        tips={[
          'Look for “Lanzhou,” “la mian,” or “hand-pulled” in a shop’s name or menu — the most reliable bet.',
          'Open listings and scan photos and reviews for hand-pulled mentions when it is not advertised.',
          'Choose your noodle width — try a medium gauge first, then explore thin and wide.',
          'Eat promptly; fresh-pulled noodles are at their springiest in the first few minutes.',
          'At a Lanzhou shop, get the beef noodle soup with chili oil; at a ramen-ya, pair with the house broth.',
        ]}
        faqs={[
          { q: 'What is hand-pulled ramen?', a: 'Hand-pulled ramen uses noodles made by repeatedly stretching and folding a single piece of dough by hand until it becomes many thin, even strands, pulled fresh to order. The technique comes from Chinese la mian and is famous in Lanzhou beef noodle soup.' },
          { q: 'Are hand-pulled noodles better than regular noodles?', a: 'Many people think so. Because they are stretched and cooked fresh, hand-pulled noodles have a springy, elastic chew (koshi) and a freshness that dried or pre-cut noodles cannot match.' },
          { q: 'Where can I find hand-pulled ramen near me?', a: 'Use the map above to find ramen nearby, then look for Lanzhou beef noodle or la mian shops, or any spot that lists hand-pulled noodles. Check listings and photos, or simply ask the shop.' },
          { q: 'What is the difference between hand-pulled noodles and Japanese ramen noodles?', a: 'Japanese ramen noodles are typically machine-cut from rolled dough, while hand-pulled (la mian) noodles are stretched by hand to order. Both can be excellent; hand-pulled noodles are prized for their fresh, springy bite and customizable width.' },
          { q: 'Can I choose the noodle thickness for hand-pulled ramen?', a: 'Often, yes. Many hand-pulled and Lanzhou shops let you pick a width — from ultra-thin strands to wide, belt-like noodles — all pulled from the same dough.' },
        ]}
      />
    </main>
  )
}
