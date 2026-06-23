import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tsukemen Near Me | Dipping Ramen Noodles | RamenNearYou',
  description: 'Find tsukemen near you — ramen dipping noodles served alongside a thick, intense broth. What tsukemen is, how to eat it the right way, and how to order it.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/tsukemen' },
  openGraph: {
    title: 'Tsukemen Near Me',
    description: 'Find tsukemen (dipping ramen) near you.',
    url: 'https://www.ramennearyou.com/find/tsukemen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function TsukemenPage() {
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
          initialBowls={['tsukemen']}
          pageTitle="Tsukemen Near Me"
          pageDescription="Showing tsukemen (dipping ramen) near you. Enter your ZIP or use your location to find a bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/tsukemen"
        heading="How I Find Great Tsukemen Near Me"
        intro={[
          'Tsukemen is the bowl I send people to when they think they have tried everything ramen has to offer. The noodles come separate from a thick, ultra-concentrated dipping broth, and you dunk each bite — it is interactive, intense, and addictive. The map above is filtered to tsukemen near you; enter your ZIP or use your location to find the closest spot.',
          'Tsukemen has its own logic and its own etiquette, and getting them right makes the whole experience click. Here is what it is, how to eat it, and how I order it.',
        ]}
        sections={[
          {
            h2: 'What tsukemen actually is',
            body: (
              <p>
                Tsukemen means “dipping noodles.” Instead of sitting in soup, the noodles are served on their
                own — often chilled or at room temperature — next to a small bowl of broth that is much thicker,
                richer, and more concentrated than regular ramen soup. You dip a few noodles at a time, coating
                them before each bite. Because the noodles are not soaking, they are usually thicker and chewier,
                with a satisfying bite that holds up beautifully.
              </p>
            ),
            points: [
              { h3: 'Separate noodles', text: 'Served apart from the broth, usually chilled, so they stay firm and chewy from first bite to last.' },
              { h3: 'Concentrated broth', text: 'Thicker and far more intense than soup ramen — it has to cling to the noodles in a single dip.' },
              { h3: 'Thick noodles', text: 'Because they are not soaking in soup, tsukemen noodles are typically thick and extra chewy.' },
            ],
          },
          {
            h2: 'How to eat tsukemen the right way',
            body: (
              <p>
                Dip a small bundle of noodles into the broth, coat them, and eat — do not pour the broth over
                the noodles. The broth is meant to be strong because it is only clinging to each bite, not
                surrounding it. When you finish the noodles, many shops offer “soup wari”: they will dilute your
                remaining dipping broth with hot dashi so you can drink it down as a light soup at the end. Do
                not skip it — it is the perfect finish.
              </p>
            ),
          },
          {
            h2: 'How I order tsukemen',
            body: (
              <p>
                I go for a rich pork or fish-and-pork (gyokai) dipping broth, ask for the noodles cold for
                maximum chew, and always take the soup wari at the end. A soft egg and extra chashu on the side
                round it out. If it is your first time, tell the shop — they will often walk you through the dip
                and the soup-wari finish.
              </p>
            ),
          },
        ]}
        tipsHeading="My tsukemen tips"
        tips={[
          'Filter to “Tsukemen,” then sort by distance for the nearest dipping bowl.',
          'Dip the noodles into the broth a few at a time — never pour the broth over them.',
          'Ask for the noodles cold for the chewiest texture.',
          'Always take the soup wari (broth dilution) to finish — it is the best part.',
          'New to it? Tell the shop; they will happily explain how to eat it.',
        ]}
        faqs={[
          { q: 'What is tsukemen?', a: 'Tsukemen is dipping ramen: the noodles are served separately from a thick, concentrated broth. You dip a few noodles at a time into the broth before each bite, rather than eating them in soup.' },
          { q: 'How do you eat tsukemen?', a: 'Dip a small bundle of noodles into the broth to coat them, then eat — do not pour the broth over the noodles. At the end, ask for soup wari to dilute the remaining broth into a drinkable soup.' },
          { q: 'Why is tsukemen broth so strong?', a: 'Because it only needs to cling to each bite, not surround the noodles, the broth is made thicker and far more concentrated than regular ramen soup.' },
          { q: 'What is soup wari?', a: 'Soup wari is when the shop dilutes your leftover dipping broth with hot dashi so you can drink it as a light soup to finish the meal. It is a classic, satisfying ending to tsukemen.' },
          { q: 'How do I find tsukemen near me?', a: 'The map above is filtered to tsukemen. Enter your ZIP or tap “Use my location” to sort the closest bowls by distance, then open a listing for hours and directions.' },
        ]}
      />
    </main>
  )
}
