import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Muroran Curry Ramen Near Me | Hokkaido Curry Ramen | RamenNearYou',
  description: 'Find Muroran curry ramen near you — the spicy Hokkaido curry broth topped with a lard slick that keeps it scalding hot. What it is, how to order it, and where to find it nearby.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/muroran-curry-ramen-near-me' },
  openGraph: {
    title: 'Muroran Curry Ramen Near Me',
    description: 'Find Hokkaido-style Muroran curry ramen near you.',
    url: 'https://www.ramennearyou.com/find/muroran-curry-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function MuroranCurryRamenPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <ErrorBoundary
        fallback={
          <section className="pt-16 bg-[#F5F4F0]">
            <div className="h-[68vh] min-h-[460px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#96602F] animate-spin" />
            </div>
          </section>
        }
      >
        <HomeMapHero
          initialFlags={['muroran-curry']}
          pageTitle="Muroran Curry Ramen Near Me"
          pageDescription="Showing Muroran-style curry ramen near you. Enter your ZIP or use your location to find a bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/muroran-curry-ramen-near-me"
        heading="My Guide to Finding Real Muroran Curry Ramen Near Me"
        intro={[
          'Muroran curry ramen comes from Muroran, a port city on the southern coast of Hokkaido, and it is one of the more distinctive regional bowls in all of Japan — thin, crimped noodles swimming in a spiced curry broth, finished with a thin slick of lard that seals in the heat so the bowl stays scorching until the very last noodle. The map above is filtered to Muroran-style curry ramen near you; enter your ZIP or tap "Use my location" to find the closest one.',
          'This is not curry poured over ramen as an afterthought — it is a genuine broth built specifically for the style, seasoned with a Japanese curry roux and simmered into the base stock rather than added on top. The lard slick is the signature move: it floats on the surface and acts like a lid, trapping steam and keeping the broth blisteringly hot far longer than a standard bowl.',
          'I go looking for Muroran curry ramen whenever I want something with more warmth and spice than a classic shoyu or miso bowl but still recognizably ramen. Here is what makes it distinct, what to expect on the menu, and how to order it well.',
        ]}
        sections={[
          {
            h2: 'What Muroran curry ramen actually is',
            body: (
              <p>
                The broth is built on a base stock — usually pork or chicken — seasoned with a Japanese-style
                curry roux, giving it warmth and a savory-sweet spice rather than the sharp heat of a chili
                bowl. The noodles are thin and tightly crimped, which grab the thicker curry broth far better
                than straight noodles would. The defining touch is the layer of lard floated on top: it keeps
                the broth insulated and steaming hot, a practical solution born from Muroran&apos;s cold,
                windy coastline where a bowl needed to stay hot on the walk home from the shipyards.
              </p>
            ),
            points: [
              { h3: 'The curry broth', text: 'A pork or chicken stock seasoned with Japanese curry roux — warm and savory-sweet rather than sharply spicy, though some shops offer a hotter version on request.' },
              { h3: 'Thin, crimped noodles', text: 'The tight curls grab the thicker curry broth far better than straight noodles, so every bite carries a good coating of sauce.' },
              { h3: 'The lard slick', text: 'A thin layer of melted lard floats on top and insulates the broth, keeping it scalding hot from the first bite to the last — the bowl\'s signature practical trick.' },
            ],
          },
          {
            h2: 'How to order Muroran curry ramen',
            body: (
              <p>
                Start with the standard curry broth before asking for anything spicier, since the base
                seasoning is already well balanced and worth tasting on its own first. Toppings tend to be
                simple — chashu pork, bean sprouts, scallion, sometimes a bit of ground meat stirred into the
                broth — so there is not much customizing to do beyond spice level. Because the lard keeps the
                bowl so hot, pace yourself on the first few bites; it is easy to underestimate the temperature
                until it catches up with you.
              </p>
            ),
            points: [
              { h3: 'Try it straight first', text: 'The curry seasoning is already balanced, so order the standard bowl before asking the kitchen to turn up the heat.' },
              { h3: 'Watch the temperature', text: 'The lard slick keeps the broth hotter for longer than a typical bowl — take it slow on the first few spoonfuls.' },
              { h3: 'Ask about rice', text: 'Some shops serve Muroran curry ramen with a small side of rice for dipping once the noodles are gone, similar to how you might finish a Japanese curry rice plate.' },
            ],
          },
        ]}
        tipsHeading="My Muroran curry ramen tips"
        tips={[
          'Filter to Muroran curry ramen, then sort by distance for the nearest bowl — it is the fastest starting point.',
          'Order the standard curry broth first before asking for extra spice; the base seasoning is already well balanced.',
          'Take it slow on the first few bites — the lard slick keeps the broth hotter for longer than most ramen styles.',
          'Ask if a side of rice is available for dipping once the noodles are finished, in the spirit of a Japanese curry rice plate.',
          'Read recent reviews specifically for the word "curry" to confirm a shop actually runs a dedicated Muroran-style bowl rather than a generic curry ramen.',
        ]}
        faqs={[
          { q: 'What is Muroran curry ramen?', a: 'Muroran curry ramen is a Hokkaido specialty from the port city of Muroran — thin, crimped wheat noodles in a spiced Japanese curry broth, topped with a thin lard slick that keeps the bowl scalding hot until the last bite.' },
          { q: 'Is Muroran curry ramen very spicy?', a: 'It leans warm and savory-sweet like a Japanese curry roux rather than sharply chili-hot, though some shops offer an extra-spicy version on request.' },
          { q: 'Why does Muroran curry ramen have lard on top?', a: 'The lard slick floats on the broth and acts as insulation, trapping heat so the bowl stays hot far longer than a standard broth — useful in Muroran\'s cold coastal climate where the dish originated.' },
          { q: 'How do I find Muroran curry ramen near me?', a: 'The map above is filtered to Muroran-style curry ramen. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then check menus and reviews to confirm the shop runs a dedicated curry ramen.' },
        ]}
      />
    </main>
  )
}
