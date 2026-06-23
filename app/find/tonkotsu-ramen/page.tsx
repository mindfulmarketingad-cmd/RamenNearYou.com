import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tonkotsu Ramen Near Me | Rich Pork-Bone Ramen | RamenNearYou',
  description: 'Find tonkotsu ramen near you — the rich, creamy pork-bone broth from Hakata. What real tonkotsu tastes like, how to order it, and how to spot the good stuff.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tonkotsu-ramen' },
  openGraph: {
    title: 'Tonkotsu Ramen Near Me',
    description: 'Find rich, creamy tonkotsu (pork-bone) ramen near you.',
    url: 'https://www.ramennearyou.com/find/tonkotsu-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function TonkotsuRamenPage() {
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
          initialBowls={['tonkotsu']}
          pageTitle="Tonkotsu Ramen Near Me"
          pageDescription="Showing tonkotsu (pork-bone) ramen near you. Enter your ZIP or use your location to find a rich, creamy bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/tonkotsu-ramen"
        heading="My Guide to Finding Real Tonkotsu Ramen Near Me"
        intro={[
          'Tonkotsu is the bowl that made me fall in love with ramen — that rich, creamy, milky-white pork broth that coats every noodle and stays with you. The map above is filtered to tonkotsu ramen near you, so you can skip straight to the good stuff. Enter your ZIP or use your location and the closest spots sort to the top.',
          'Great tonkotsu is a labor of love, and not every bowl labeled “tonkotsu” lives up to it. Here is what the style actually is, how to recognize a serious version, and exactly how I order it.',
        ]}
        sections={[
          {
            h2: 'What tonkotsu actually is',
            body: (
              <p>
                Tonkotsu means “pork bone,” and that is the whole secret. The bones are boiled hard for 12 to 18
                hours until the collagen and marrow break down into a thick, opaque, almost creamy broth. It
                originated in Fukuoka (Hakata) on the island of Kyushu and is traditionally served with thin,
                firm, straight noodles and slices of chashu pork. Done right, it is rich without being greasy —
                deeply porky, savory, and a little sweet.
              </p>
            ),
            points: [
              { h3: 'The broth', text: 'Milky-white and full-bodied from long-simmered pork bones — the texture should coat the noodles, not sit thin and watery.' },
              { h3: 'The noodles', text: 'Classic Hakata style uses thin, firm, straight noodles, often cooked to order at your chosen firmness (“katame” for extra firm).' },
              { h3: 'The toppings', text: 'Chashu pork, wood-ear mushroom, scallion, and often a soft marinated egg. Many shops let you add extra noodles (kaedama) to finish the broth.' },
            ],
          },
          {
            h2: 'How to spot great tonkotsu',
            body: (
              <p>
                The tell is the broth’s body. A serious tonkotsu has real weight and cling — you can see it
                coating the side of the bowl — because it was simmered for the better part of a day. Thin,
                pale, or oily-on-top broth usually means a shortcut. I also look for shops that specialize in
                tonkotsu rather than offering ten broths; the focused kitchens almost always nail it.
              </p>
            ),
          },
          {
            h2: 'How I order my tonkotsu',
            body: (
              <p>
                If the shop cooks noodles to order, I ask for them firm (katame) so they hold up in the rich
                broth. I add a soft egg and extra chashu, and if there is a kaedama option, I order a second
                round of noodles to finish the broth at the end. A little extra garlic or the chili oil on the
                counter takes it over the top.
              </p>
            ),
          },
        ]}
        tipsHeading="My tonkotsu ordering tips"
        tips={[
          'Filter to “Tonkotsu,” then sort by distance for the nearest creamy bowl.',
          'Favor shops that specialize in tonkotsu — focused kitchens nail the long-simmered broth.',
          'Ask for firm noodles (katame) so they hold up in the rich broth.',
          'Add a soft egg and extra chashu, and order kaedama (extra noodles) to finish the broth.',
          'Stack “Top Rated” to find the best-reviewed tonkotsu near you.',
        ]}
        faqs={[
          { q: 'What is tonkotsu ramen?', a: 'Tonkotsu is ramen built on a rich, creamy broth made by simmering pork bones for 12 to 18 hours until the collagen breaks down into a milky stock. It originated in Fukuoka (Hakata) and is served with thin, firm noodles and chashu pork.' },
          { q: 'Is tonkotsu ramen pork?', a: 'Yes — “tonkotsu” literally means pork bone. The broth is made entirely from pork bones and the bowl is usually topped with chashu pork, so it is not vegetarian unless a shop offers a plant-based version.' },
          { q: 'How do I find tonkotsu ramen near me?', a: 'The map above is filtered to tonkotsu. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours, photos, and directions.' },
          { q: 'How can I tell if tonkotsu is good?', a: 'Look for a broth with real body that coats the bowl — the result of a long simmer. Thin, pale, or oily-topped broth signals a shortcut. Shops that specialize in tonkotsu usually do it best.' },
          { q: 'What does “katame” and “kaedama” mean?', a: 'Katame means firm noodles, ideal for holding up in rich tonkotsu. Kaedama is an extra portion of noodles you can order to finish your remaining broth — a Hakata tradition.' },
        ]}
      />
    </main>
  )
}
