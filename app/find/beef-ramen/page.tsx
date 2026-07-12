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
              <Loader2 className="w-8 h-8 text-[#96602F] animate-spin" />
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
          'Beef ramen is a little less common than pork or chicken, which makes finding a genuinely great one all the more satisfying when you do. From rich, deep beef-bone broths to thinly sliced beef chashu to the legendary Lanzhou hand-pulled beef noodle soup, there is a whole world of beefy bowls out there waiting to be discovered. The map above helps you find ramen near you — enter your ZIP or use your location and look for the beef-forward spots in your area.',
          'What draws me to beef ramen is its unique flavor profile. Beef has a deeper, more mineral richness than pork, and a well-made beef broth carries a savory intensity that is unlike anything else in the noodle soup world. Whether you are after the cloudy, unctuous weight of a gyukotsu broth or the clear, aromatic elegance of Lanzhou lamian, beef rewards the hunt.',
          'Because "beef ramen" spans a few different traditions and culinary cultures, it helps to know what you are looking for before you start searching. Japanese gyukotsu, Chinese Lanzhou lamian, and beef-topped bowls with lighter broths are all different experiences. Here is how I think about the styles, where to find them, and how to spot the ones worth a trip.',
          'One thing I have learned chasing beef ramen is that patience pays off. These are not always the most prominent items on a menu, and sometimes the best beef bowls are at shops that are not exclusively ramen joints. Staying curious and reading menus carefully is half the work.',
        ]}
        sections={[
          {
            h2: 'The different kinds of beef ramen',
            body: (
              <p>
                Beef shows up in ramen in several distinct ways, and the experiences are very different from
                one another. Some Japanese shops build an entire menu around a beef-bone broth called gyukotsu
                — a rich, deeply savory cousin to pork tonkotsu, made by simmering beef bones for many hours
                until the collagen releases and the broth develops real weight and complexity. Other shops keep
                a lighter, cleaner base broth but make the protein the star, piling on thin-sliced wagyu-style
                beef or a carefully braised beef chashu as the showpiece topping. And then there is Lanzhou
                beef noodle soup — a Chinese hand-pulled-noodle tradition rooted in Gansu province, featuring
                a clear, aromatic, warmly spiced beef broth that is entirely its own thing and, in my opinion,
                one of the great noodle soups in the world.
              </p>
            ),
            points: [
              { h3: 'Beef-bone broth (gyukotsu)', text: 'Rich and savory like tonkotsu but made from beef bones — less common in Japanese ramen and worth seeking out for its deep, mineral character and satisfying weight.' },
              { h3: 'Beef-topped bowls', text: 'A lighter or standard base broth with thin-sliced beef or braised beef chashu as the showpiece topping. The beef does the heavy lifting without necessarily requiring a beef broth underneath.' },
              { h3: 'Lanzhou beef noodle soup', text: 'Hand-pulled noodles in a clear, aromatic, spiced beef broth — a distinct and celebrated Chinese tradition that many noodle shops in the US now serve. Lighter-bodied but enormously flavorful.' },
            ],
          },
          {
            h2: 'The art of the beef broth',
            body: (
              <p>
                What separates a great beef broth from an ordinary one is time and quality of bones. A proper
                gyukotsu starts with high-quality beef bones — often a mix of marrow bones, knuckles, and
                sometimes oxtail — simmered for many hours. The marrow enriches the soup, the knuckles provide
                collagen for body, and the long cook draws out a deep savory character that no shortcut can
                replicate. I always look for shops that describe their broth process, because when a kitchen is
                proud of how they make their beef broth, they usually have a reason to be. Clear beef broths,
                like the kind used in Lanzhou lamian, take a different approach: a careful, lower-temperature
                simmer that draws out flavor without muddying the liquid, resulting in a broth that looks
                simple but conceals tremendous depth.
              </p>
            ),
            points: [
              { h3: 'Marrow and knuckle bones', text: 'The backbone of a great gyukotsu — marrow enriches the broth, knuckles provide collagen and body, and together they create the signature richness.' },
              { h3: 'Long simmer time', text: 'Hours of careful cooking are what transform raw ingredients into the kind of beef broth that stays with you. Shortcuts show up immediately in the final bowl.' },
              { h3: 'Aromatics and seasoning', text: 'Ginger, scallion, garlic, and spices vary by tradition, but they all work to complement the beef and round out the broth. The balance is what makes one shop stand out from another.' },
            ],
          },
          {
            h2: 'How to find the beefy bowls',
            body: (
              <p>
                Since beef is a less standardized category in the ramen world, I take a more hands-on approach
                to finding a great bowl. I open listings and skim both the menu and the photos to spot beef
                broths and beef toppings before committing to a visit. Shops with "Lanzhou," "lamian," or
                "hand-pulled" in the name are a reliable bet for Lanzhou-style beef noodle soup. For Japanese
                gyukotsu, I look for menu language like "beef bone broth" or "gyu ramen." If you want a
                specific beef bowl, the restaurant's own menu link on each listing is the fastest way to
                confirm before you go. Recent photos showing a deep, dark broth or beautifully sliced beef
                on top are also strong signals that you have found the right place.
              </p>
            ),
          },
          {
            h2: 'How I order beef ramen',
            body: (
              <p>
                For a rich, indulgent bowl, I go for a beef-bone broth with extra beef chashu and a soft
                marinated egg. I like to add a drizzle of chili oil and some fresh scallion to cut through
                the richness and add brightness. For something cleaner and more aromatic, Lanzhou beef noodle
                soup is hard to beat — I ask for a medium noodle width on my first visit, since hand-pulled
                shops almost always let you choose, and I pile on extra chili oil for the classic warmth and
                color. Either way, I look for shops that take their beef seriously, whether that means a slow
                broth simmer or the skill of pulling fresh noodles to order.
              </p>
            ),
          },
        ]}
        tipsHeading="My beef ramen tips"
        tips={[
          'Open listings and skim both menus and photos to spot beef broths and beef toppings before making the trip.',
          'Shops with "Lanzhou," "lamian," or "hand-pulled" in the name are a reliable bet for clear, aromatic beef noodle soup.',
          'For richness, look for a beef-bone (gyukotsu) broth and add extra beef chashu to maximize the beefy depth.',
          'At Lanzhou hand-pulled shops, choose your noodle thickness — many let you customize, and trying different widths across visits is half the fun.',
          'Finish any beef bowl with chili oil and fresh scallion to cut through richness and add brightness.',
          'Read reviews that specifically praise the broth, not just the meat — a well-made beef broth is what separates a great shop from a mediocre one.',
          'Do not overlook Japanese gyukotsu ramen — it is less common than tonkotsu but offers a distinct, deeply savory experience worth seeking out.',
          'For a lighter option, a clear beef chintan or Lanzhou-style broth gives you all the savory beef flavor with less richness and weight.',
        ]}
        faqs={[
          { q: 'What is beef ramen?', a: 'Beef ramen covers bowls built on beef-bone broth (gyukotsu), lighter broths topped with sliced beef or beef chashu, and Chinese-style Lanzhou beef noodle soup with hand-pulled noodles in a spiced, aromatic beef broth. Each style offers a distinct experience.' },
          { q: 'Is beef ramen common?', a: 'It is less common than pork or chicken in Japanese ramen, but beef-topped bowls and Lanzhou beef noodle soup are widely available, especially at hand-pulled-noodle shops. Gyukotsu (beef bone broth) ramen is the rarest style to find but worth the search.' },
          { q: 'What is Lanzhou beef noodle soup?', a: 'A famous Chinese dish of hand-pulled noodles in a clear, aromatic, spiced beef broth, often topped with sliced beef, white radish, chili oil, and cilantro. It originated in Lanzhou, Gansu province, and is celebrated for its fresh-pulled noodles and clean but deeply flavorful broth.' },
          { q: 'What is gyukotsu ramen?', a: 'Gyukotsu is a Japanese ramen style built on a beef-bone broth, similar in method to tonkotsu but made with beef bones instead of pork. The result is rich, deeply savory, and has a distinct mineral depth that sets it apart from other broth styles.' },
          { q: 'How do I find beef ramen near me?', a: 'Use the map above to find ramen nearby, then open listings to check menus and photos for beef broths and toppings. Shops with hand-pulled, Lanzhou, or lamian in the name are a good starting point for the Chinese style; look for "gyu" or "beef bone broth" for the Japanese version.' },
          { q: 'What should I order at a beef noodle shop?', a: 'Try the beef-bone broth with extra beef chashu for richness, or Lanzhou beef noodle soup for something cleaner and aromatic. Choose your noodle thickness where offered, add chili oil and scallion, and do not skip the soft egg if they have it.' },
          { q: 'What noodles are best for beef ramen?', a: 'For Japanese gyukotsu, thicker or wavier noodles that hold up in the rich broth tend to work well. For Lanzhou-style, the noodles are hand-pulled to order and you choose your width — thin strands are delicate and cook quickly, while wide noodles bring a satisfying chew.' },
          { q: 'Is beef ramen suitable for people who do not eat pork?', a: 'A genuine beef ramen broth uses beef bones rather than pork, making it a strong option for those avoiding pork. However, always confirm the tare, oils, and toppings with the shop, as some kitchens use pork-based seasoning sauces even in otherwise beef-forward bowls.' },
        ]}
      />
    </main>
  )
}
