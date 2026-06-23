import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Beef Ramen Near Me | Beef Broth & Gyu Ramen | RamenNearYou',
  description: 'Find beef ramen near you — rich beef-bone broths, beef chashu, and Lanzhou-style beef noodle soup. What beef ramen is and how to find a great bowl.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/beef-ramen' },
  openGraph: {
    title: 'Beef Ramen Near Me',
    description: 'Find rich beef-broth ramen and beef noodle soup near you.',
    url: 'https://www.ramennearyou.com/find/beef-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function BeefRamenPage() {
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
          pageTitle="Beef Ramen Near Me"
          pageDescription="Find ramen restaurants serving beef broth and beef toppings near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/beef-ramen"
        heading="How I Track Down Great Beef Ramen Near Me"
        intro={[
          'Beef ramen is a little less common than pork or chicken, which makes finding a great one all the more satisfying. From rich beef-bone broths to thinly sliced beef chashu to the legendary Lanzhou beef noodle soup, there is a whole world of beefy bowls out there. The map above helps you find ramen near you — enter your ZIP or use your location and look for the beef-forward spots.',
          'Because “beef ramen” spans a few different traditions, it helps to know what you are looking for. Here is how I think about the styles and how to spot the good ones.',
        ]}
        sections={[
          {
            h2: 'The different kinds of beef ramen',
            body: (
              <p>
                Beef shows up in ramen in a few ways. Some Japanese shops build a beef-bone broth (gyukotsu)
                that is rich and deeply savory, a cousin to pork tonkotsu. Others keep a lighter broth but pile
                on thin-sliced beef or beef chashu as the star topping. And then there is Lanzhou beef noodle
                soup — a Chinese hand-pulled-noodle tradition with a clear, aromatic, spiced beef broth that is
                a world-class bowl in its own right.
              </p>
            ),
            points: [
              { h3: 'Beef-bone broth (gyukotsu)', text: 'Rich and savory like tonkotsu but made from beef bones — less common and worth seeking out.' },
              { h3: 'Beef-topped bowls', text: 'A lighter base broth with thin-sliced beef or beef chashu as the showpiece topping.' },
              { h3: 'Lanzhou beef noodle soup', text: 'Hand-pulled noodles in a clear, spiced beef broth — a distinct Chinese tradition many noodle shops serve.' },
            ],
          },
          {
            h2: 'How to find the beefy bowls',
            body: (
              <p>
                Since beef is a less standardized category, I open listings and skim the menu and photos to spot
                beef broths and beef toppings. Shops with “Lanzhou” or hand-pulled noodles in the name are a
                reliable bet for beef noodle soup. If you want a specific beef bowl, the restaurant’s own menu
                link on each listing is the fastest way to confirm before you go.
              </p>
            ),
          },
          {
            h2: 'How I order beef ramen',
            body: (
              <p>
                For a rich bowl I go for a beef-bone broth with extra beef chashu and a soft egg. For something
                cleaner and aromatic, Lanzhou beef noodle soup is hard to beat — ask for your preferred noodle
                thickness, since hand-pulled shops often let you choose. Either way, a squeeze of chili oil and
                some fresh scallion finishes it perfectly.
              </p>
            ),
          },
        ]}
        tipsHeading="My beef ramen tips"
        tips={[
          'Open listings and skim menus and photos to spot beef broths and beef toppings.',
          'Shops with “Lanzhou” or hand-pulled noodles are a reliable bet for beef noodle soup.',
          'For richness, look for a beef-bone (gyukotsu) broth and add extra beef chashu.',
          'At hand-pulled shops, choose your noodle thickness — many let you customize.',
          'Finish with chili oil and fresh scallion to round out the bowl.',
        ]}
        faqs={[
          { q: 'What is beef ramen?', a: 'Beef ramen covers bowls built on beef-bone broth (gyukotsu), lighter broths topped with sliced beef or beef chashu, and Chinese-style Lanzhou beef noodle soup with hand-pulled noodles in a spiced beef broth.' },
          { q: 'Is beef ramen common?', a: 'It is less common than pork or chicken in Japanese ramen, but beef-topped bowls and Lanzhou beef noodle soup are widely available, especially at hand-pulled-noodle shops.' },
          { q: 'What is Lanzhou beef noodle soup?', a: 'A famous Chinese dish of hand-pulled noodles in a clear, aromatic, spiced beef broth, often topped with sliced beef, radish, chili oil, and cilantro. Many noodle shops serve it.' },
          { q: 'How do I find beef ramen near me?', a: 'Use the map above to find ramen nearby, then open listings to check menus and photos for beef broths and toppings. Shops with hand-pulled or Lanzhou noodles are a good starting point.' },
          { q: 'What should I order at a beef noodle shop?', a: 'Try the beef-bone broth with extra beef chashu for richness, or Lanzhou beef noodle soup for something cleaner and aromatic. Choose your noodle thickness where offered, and add chili oil.' },
        ]}
      />
    </main>
  )
}
