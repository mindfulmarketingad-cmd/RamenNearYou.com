import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authentic Ramen Near Me | Traditional Ramen Shops | RamenNearYou',
  description: 'Find authentic ramen near you — traditional shops that simmer real broth and pull fresh noodles. How I tell authentic ramen from imitations and what to look for.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/authentic-ramen' },
  openGraph: {
    title: 'Authentic Ramen Near Me',
    description: 'Find authentic, traditional ramen shops near you.',
    url: 'https://www.ramennearyou.com/find/authentic-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function AuthenticRamenPage() {
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
          pageTitle="Authentic Ramen Near Me"
          pageDescription="Find authentic, traditional ramen near you. Enter your ZIP or use your location, then filter by broth, price, and hours."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/authentic-ramen"
        heading="How I Tell Authentic Ramen From the Rest"
        intro={[
          'Once you have had truly authentic ramen, you can taste the difference instantly — broth with depth that only comes from hours of simmering over real bones and aromatics, noodles with the spring and bite that kansui alkaline water creates, toppings made with care rather than assembled from a bag. The map above helps you find authentic ramen near you; enter your ZIP or use your location to see the closest traditional shops sorted by rating and distance.',
          'Authenticity is not about a label, a nationality, or a price point. It is about craft and commitment. A kitchen run by a chef who learned to make tonkotsu from a master in Fukuoka is making authentic ramen. So is a kitchen run by a self-taught cook who spent three years perfecting a shoyu broth built around the principles of the Tokyo style. What matters is the technique, the time investment, and the refusal to shortcut the things that make the bowl great.',
          'Here are the signals I look for, the toppings and techniques that separate the real thing from an approximation, and how to use the map to find it near you. I have spent a lot of time developing these instincts, and they have never steered me wrong. A great authentic ramen bowl is one of the most satisfying things you can eat, and knowing how to find one consistently is a skill worth developing.',
          'The most important thing I have learned about authentic ramen is that it is defined by process, not geography. It is defined by whether someone made a real broth that took hours, whether the noodles were made with real kansui and fresh-milled wheat, and whether the tare — the seasoning concentrate that gives each bowl its character — was built from real ingredients with real attention. Those are the questions worth asking, and the answers show up in the listing photos, the reviews, and the menu.',
        ]}
        sections={[
          {
            h2: 'The signs of an authentic ramen shop',
            body: (
              <p>
                The strongest tell is focus. Shops that specialize in one or two broths and do them obsessively
                well almost always make more authentic ramen than places with a sprawling pan-Asian menu that
                includes ramen as one item among dozens. A kitchen that has staked its identity on the bowl has
                every incentive to make it great. I also look for house-made or fresh noodles — the menu often
                says so explicitly, and reviewers tend to mention it when they notice — broth with genuine body
                and depth, and a kitchen that takes its chashu and tare seriously. The chashu should be
                slow-braised or sous-vide with a proper sear, not a thin slice of deli pork. The tare should be
                seasoned with real intention, not just soy sauce and salt. A line of regulars who have been
                coming for years is perhaps the most honest signal of all.
              </p>
            ),
            points: [
              { h3: 'A focused menu', text: 'A short list built around a couple of broths signals a kitchen committed to its craft, not cutting corners. When the menu is small, every item on it is there because the kitchen has mastered it.' },
              { h3: 'Real broth and noodles', text: 'Long-simmered broth with body and fresh, springy noodles made with kansui are the foundation of an authentic bowl. These are the two things that cannot be faked or shortcutted without everyone noticing.' },
              { h3: 'Classic execution', text: 'Proper chashu slow-braised with care, a well-marinated soft egg (ajitama), menma bamboo shoots, and a balanced tare show the shop respects the tradition and has learned its fundamentals.' },
            ],
          },
          {
            h2: 'Authentic does not mean only one style',
            body: (
              <p>
                Authentic ramen spans many regional traditions — Hakata tonkotsu from Fukuoka, Sapporo miso from
                Hokkaido, Tokyo shoyu from the capital, Hakodate shio from the north — so an authentic shop is one
                that executes its chosen style faithfully, not one that serves a single "correct" bowl. Each regional
                tradition has its own logic: Hakata tonkotsu is meant to be rich and milky with thin noodles because
                that is what the local taste demands. Sapporo miso is meant to be hearty and warming because the
                winters there require it. Knowing which tradition a shop is drawing from helps you judge it on its
                own terms and order what they do best, rather than expecting a Sapporo-style shop to produce a light
                Tokyo shoyu or vice versa.
              </p>
            ),
          },
          {
            h2: 'Using the map to find the real thing',
            body: (
              <p>
                I start by reading listings carefully before I go anywhere. Recent reviews that praise the broth
                and noodles specifically — not just the atmosphere or the service — are the most valuable signal.
                Photos that show a glossy, carefully built bowl with toppings placed with intention tell me the
                kitchen cares about every detail. A menu centered on ramen rather than on everything under the sun
                tells me the kitchen has made a choice about what it wants to be. Stack the "Top Rated" filter to
                surface the shops people consistently rave about across many visits, then narrow by the broth you
                want for a bowl that is both authentic to its tradition and exactly your style right now.
              </p>
            ),
          },
          {
            h2: 'What the toppings tell you about authenticity',
            body: (
              <p>
                An authentic bowl does not pile on toppings for visual impact — it uses a few classic elements
                placed with purpose. Chashu pork belly or shoulder, slow-cooked until tender with a soy-mirin
                basting liquid, is the protein anchor. Ajitama — a soft-boiled egg marinated in tare — adds
                richness and seasoning. Menma (fermented bamboo shoots), nori, scallion, and toasted sesame
                round out the bowl without overwhelming the broth. When I see a bowl with classic toppings
                executed well rather than a mountain of extras competing for attention, I know the kitchen
                understands what authentic ramen is actually about. The broth and the noodles should be
                the stars; the toppings should support them.
              </p>
            ),
            points: [
              { h3: 'Chashu', text: 'Slow-braised pork belly or shoulder, not a thin deli slice. Proper chashu melts against the noodles and enriches the broth as it sits.' },
              { h3: 'Ajitama', text: 'A soft-boiled egg marinated in tare until the white is flavored and the yolk is jammy. A well-made ajitama tells you the kitchen sweats the small things.' },
              { h3: 'Classic supporting cast', text: 'Menma, nori, scallion, and sesame — each element in proportion, none competing for the spotlight. Restraint in toppings is a sign of confidence in the broth.' },
            ],
          },
        ]}
        tipsHeading="My tips for finding authentic ramen"
        tips={[
          'Favor shops with a focused, ramen-centered menu over sprawling pan-Asian ones; a kitchen that has committed to the bowl has every reason to make it great.',
          'Look for fresh noodles and broth with real body — these are the two foundations of authenticity that cannot be shortcutted without everyone tasting the difference.',
          'Read recent reviews for specific praise of the broth, noodles, and chashu; specificity means the reviewer paid attention to the actual craft.',
          'Judge a shop on how faithfully it executes its chosen regional style, not whether it makes a style you happen to prefer; each tradition has its own logic and standards.',
          'Stack "Top Rated," then filter by broth for a bowl that is authentic to its tradition and precisely what you are craving right now.',
          'Look at the toppings in the listing photos — a bowl with classic, purposefully placed elements signals more authenticity than one buried in novelty add-ons.',
          'Check whether the menu uses real Japanese ramen terminology (ajitama, menma, tare, kaedama); a kitchen fluent in the vocabulary usually knows the technique too.',
          'Trust a ramen-ya format over a broad Japanese restaurant for the most authentic bowl; when noodles are the only thing on the menu, the kitchen can focus everything on getting them right.',
        ]}
        faqs={[
          { q: 'What makes ramen authentic?', a: 'Craft and time: long-simmered broth with real depth built from bones and aromatics, fresh noodles made with kansui for springy bite, and carefully made toppings like proper chashu and a marinated ajitama. Shops focused on a few broths tend to execute all of these at the highest level.' },
          { q: 'How can I tell if a ramen shop is authentic?', a: 'Look for a focused, ramen-centered menu, house-made or fresh noodles, broth with genuine body, and reviews that praise those specifics rather than just the atmosphere. Classic toppings executed well — real chashu, ajitama, menma — are another strong signal.' },
          { q: 'Is there only one authentic style of ramen?', a: 'No — authentic ramen spans many regional traditions like Hakata tonkotsu, Sapporo miso, Tokyo shoyu, and Hakodate shio. An authentic shop executes its chosen style faithfully and with understanding of that tradition, not a single "correct" bowl.' },
          { q: 'Does authentic ramen have to be Japanese-owned?', a: 'Not necessarily. Authenticity comes from technique and respect for the craft — long-simmered broth, fresh kansui noodles, and proper toppings — which cooks of any background can master through study and dedication.' },
          { q: 'How do I find authentic ramen near me?', a: 'Use the map above, read listings for specific praise of broth and noodles, stack "Top Rated," and filter by the broth you want to find a faithful, high-quality bowl. Focused ramen-ya almost always deliver a more authentic experience than broad-menu restaurants.' },
          { q: 'What is tare and why does it matter for authentic ramen?', a: 'Tare is the seasoning concentrate — made from soy, salt, or miso — that is added to the broth at the moment of service to give each bowl its distinctive flavor character. A well-made tare is built from real ingredients and balanced carefully; it is the element that separates a nuanced bowl from a one-note one.' },
          { q: 'What is the difference between authentic ramen and Americanized ramen?', a: 'Authentic ramen uses house-simmered broth, kansui noodles, and classic toppings executed in the tradition of a specific Japanese regional style. Americanized ramen may use non-traditional proteins, fusion toppings, or premade bases, and it tends to prioritize novelty over fidelity to the original craft.' },
          { q: 'Should I order the most expensive bowl at an authentic ramen shop?', a: 'Not necessarily. At a focused ramen-ya, the most authentic and the best bowl is often the simplest one — the house signature that the kitchen has been perfecting for years. Premium toppings add cost but do not always add the most value. Start with the house bowl and build from there.' },
        ]}
      />
    </main>
  )
}
