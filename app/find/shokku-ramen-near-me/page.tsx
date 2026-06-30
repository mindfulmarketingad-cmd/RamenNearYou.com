import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shokku Ramen Near Me | Find Shokku Ramen Restaurants | RamenNearYou',
  description: 'Find Shokku Ramen near you — browse Shokku Ramen restaurant locations by rating, hours, and distance. See menus, directions, and reviews.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/shokku-ramen-near-me' },
  openGraph: {
    title: 'Shokku Ramen Near Me',
    description: 'Find Shokku Ramen restaurants near you.',
    url: 'https://www.ramennearyou.com/find/shokku-ramen-near-me',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function ShokkuRamenPage() {
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
          initialFlags={['shokku']}
          pageTitle="Shokku Ramen Near Me"
          pageDescription="Showing Shokku Ramen locations near you. Enter your ZIP or use your location to find the closest one."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/shokku-ramen-near-me"
        heading="How I Find Shokku Ramen Near Me"
        intro={[
          'Shokku Ramen is a Japanese ramen concept known for bold flavors, intensely seasoned broths, and a modern take on classic ramen styles that makes it stand out in the current ramen landscape. The map above is filtered to Shokku Ramen locations near you. Enter your ZIP or tap "Use my location" and the closest spots sort to the top, showing distance, hours, and ratings so you can make a decision at a glance.',
          'The name Shokku (衝撃) means shock or impact in Japanese, and that name is a deliberate statement about what to expect in the bowl. I have found that ramen concepts with this kind of name-level commitment to intensity either fully deliver or fall short — Shokku tends to deliver. The broths are genuinely assertive, the seasoning is confident, and the overall experience rewards people who want ramen that makes a statement rather than playing it safe.',
          'What makes Shokku interesting to me as a ramen enthusiast is that it combines the focus of a curated, intentional concept with enough menu range to give you a genuine reason to return. The first visit is about understanding what the kitchen is proudest of. The second visit is where you start exploring the range and finding your personal favorite bowl. That progression from discovery to personal preference is part of what makes a great ramen concept, and Shokku sets it up well.',
          'Here is everything I know about finding a Shokku Ramen near you, what to order, when to go, and what to look for if the nearest location is not within easy reach.',
        ]}
        sections={[
          {
            h2: 'What is Shokku Ramen?',
            body: (
              <p>
                Shokku Ramen brings a bold, modern approach to Japanese ramen. "Shokku" (衝撃) means shock or
                impact in Japanese — a fitting name for a restaurant that aims to surprise with intensely
                flavored broths and creative toppings. Locations typically serve a curated menu of Japanese
                ramen styles alongside sides and Japanese-inspired drinks, with the emphasis squarely on
                flavor intensity rather than subtlety. This is a kitchen that wants you to notice the broth
                from the first sip, not after several bites. I find that approach refreshing in a market
                that sometimes gets overly cautious about bold seasoning. The modern Japanese design
                aesthetic at most Shokku locations reinforces the concept — the visual presentation is clean
                and intentional in the same way the flavors are, and sitting down there puts you in the
                right frame of mind for a bowl that is going to make an impression.
              </p>
            ),
            points: [
              { h3: 'Impact-forward flavors', text: 'Bold, deeply seasoned broths designed to make an impression from the first sip. I appreciate that Shokku does not hedge on this — the broth has conviction, and you can taste that confidence in every bowl.' },
              { h3: 'Curated, focused menu', text: 'A deliberate selection of ramen styles rather than an overwhelming list — every bowl on the menu is meant to be there. I find that a shorter, well-considered menu is almost always a better sign than a long one, and Shokku\'s approach reflects that thinking.' },
              { h3: 'Modern Japanese atmosphere', text: 'Contemporary Japanese design and a comfortable dining experience that suits the bold flavor concept. The atmosphere at Shokku sets the expectation before the bowl arrives, which I think is part of how the concept works.' },
            ],
          },
          {
            h2: 'What to order at Shokku Ramen',
            body: (
              <p>
                On your first visit, go with the house signature bowl — it showcases what makes Shokku
                distinct and gives you the clearest view of what the kitchen is doing. The signature bowl
                is where the concept is most fully expressed, and it serves as the reference point from
                which everything else on the menu makes more sense. If the menu offers a spicy option, it
                is worth trying on a second visit — bold-flavored concepts that commit to intensity tend
                to execute heat well, because heat is just another form of impact and the kitchen is
                already thinking in those terms. Add a soft-boiled marinated egg to any bowl you order.
                The soy-cured yolk breaks open into the broth and adds a layer of richness that softens
                the intensity in exactly the right way. Check for any limited specials the kitchen is
                running — Shokku locations that rotate seasonal or limited bowls often put some of their
                most creative work into those specials, and asking the server about current offerings
                before ordering is always a worthwhile move.
              </p>
            ),
            points: [
              { h3: 'House signature bowl is the starting point', text: 'The signature bowl tells you what the kitchen is most confident about. On a first visit I always go with the signature so I have a baseline — everything else on the menu becomes easier to evaluate once you know what the kitchen is building toward.' },
              { h3: 'Spicy option for the second visit', text: 'Bold ramen concepts tend to execute spicy options with the same conviction as the base bowls. If Shokku offers a spicy bowl, I recommend it for the second visit once you understand the flavor framework.' },
              { h3: 'Ask about specials', text: 'Limited and seasonal bowls at ramen restaurants often represent the kitchen\'s most creative current work. Asking your server what is special that day takes ten seconds and might get you the best thing on the menu.' },
            ],
          },
          {
            h2: 'When to go to Shokku Ramen',
            body: (
              <p>
                Shokku Ramen locations tend to be busiest at weekend dinners, particularly on Friday and
                Saturday nights when the modern atmosphere and drinks draw larger groups. A weekday lunch
                or an early dinner right at opening is the easiest way to get seated quickly and enjoy
                the bowl without waiting. I have found that the service is also more attentive during
                off-peak hours — servers have more time to walk you through the menu and make
                recommendations, which is especially useful on a first visit when you are still learning
                the concept. Check the listing above for current hours before heading out, since some
                Shokku locations may adjust their schedule or close between lunch and dinner service.
                Confirming hours takes thirty seconds and saves a wasted trip, which is always worth
                the small effort.
              </p>
            ),
          },
          {
            h2: 'Understanding bold ramen — why intensity matters',
            body: (
              <p>
                Shokku's commitment to impact-forward flavors is rooted in a genuine philosophy about
                what ramen can be. The best tonkotsu broths I have had are not subtle — they hit you
                with richness and depth immediately and then reveal more complexity as you drink deeper
                into the bowl. The same is true of a well-executed spicy miso or a deeply seasoned
                shoyu. Ramen that plays it safe tends to be forgettable; ramen with conviction tends
                to stay with you. What Shokku is doing, in naming itself after the word for shock and
                building its menu around intensely seasoned broths, is committing to the more memorable
                end of the spectrum. That commitment can be polarizing for diners who prefer lighter,
                more restrained broths, but for anyone who loves a bowl that leaves an impression, it
                is exactly the right approach. I find that first-time ramen diners sometimes need a
                moment to calibrate to the intensity, but almost everyone comes around by the bottom
                of the bowl.
              </p>
            ),
            points: [
              { h3: 'Rich broths have depth that unfolds', text: 'The best ramen broths reveal more complexity as you drink through them. An intensely seasoned broth at the start often becomes more nuanced as your palate adjusts and as the toppings integrate — the full picture reveals itself over the course of the bowl.' },
              { h3: 'Bold seasoning requires balance', text: 'Intensity without balance is just loud. The best bold ramen spots, including Shokku at its best, back up the initial impact with balance — fat, acid, umami, and heat in correct proportion so the bowl stays interesting from first sip to last.' },
              { h3: 'Toppings should match the broth intensity', text: 'A bold broth calls for toppings with enough presence to stand up to it. Braised chashu, marinated eggs, and deeply seasoned bamboo shoots are not just garnishes in this context — they are flavor contributions that complete the bowl.' },
            ],
          },
          {
            h2: 'How to find the nearest Shokku Ramen and what to do if it is too far',
            body: (
              <p>
                The map at the top of this page is already filtered to Shokku Ramen locations. Enter
                your ZIP code or tap "Use my location" to sort by proximity, and check the distance and
                hours for each listing before making a decision. If the nearest Shokku is too far for a
                casual visit, the map can just as easily find you a different bold ramen experience
                nearby. Clear the search and add the "Top Rated" filter to surface the highest-rated
                ramen shops in your area regardless of brand. If you want to stay close to the intensity
                profile that Shokku offers, stack "Tonkotsu" or "Spicy" on top of "Top Rated" and you
                will surface local options with the same flavor direction. Some of my most memorable
                ramen discoveries have come from doing exactly this — removing the brand filter and
                letting the ratings and style filters surface hidden local gems.
              </p>
            ),
          },
        ]}
        tipsHeading="My tips for Shokku Ramen"
        tips={[
          'Order the house signature bowl first — it is the clearest statement of what the kitchen believes in and gives you the best starting reference for everything else on the menu.',
          'Try the spicy option on your second visit if one is available. Bold ramen concepts tend to execute heat with the same confidence as their base bowls, and Shokku is no exception.',
          'Add the soft-boiled marinated egg to your bowl. The soy-cured yolk breaks into the broth and adds richness that softens the intensity in a way that makes the whole bowl more complete.',
          'Go on a weekday or arrive at opening to avoid the weekend dinner rush. Off-peak visits also tend to come with more attentive service and more time for the staff to walk you through the menu.',
          'Ask your server about current limited or seasonal specials before ordering — Shokku locations that rotate offerings often put their most creative work into those bowls.',
          'Check the listing for current hours before heading out, especially if you are planning a midday visit when some locations close between lunch and dinner service.',
          'If you finish the noodles and still have broth, do not leave it. A deeply seasoned Shokku broth is worth drinking to the end, and the intensity at the bottom of the bowl is often the most interesting part.',
          'No Shokku nearby? Clear the brand search, stack "Tonkotsu" or "Spicy," and add "Top Rated" to find a bold, highly-rated local ramen option with a similar flavor profile.',
        ]}
        faqs={[
          { q: 'Is there a Shokku Ramen near me?', a: 'Use the map above — enter your ZIP or tap "Use my location" to see the closest Shokku Ramen locations, sorted by distance and rating. The map also shows current hours and open status so you can confirm before heading out.' },
          { q: 'What does Shokku mean?', a: '"Shokku" (衝撃) means shock or impact in Japanese, reflecting the bold, intense flavors the restaurant delivers in every bowl. The name is an upfront declaration of the kitchen\'s philosophy — this is ramen that is meant to make an immediate, memorable impression.' },
          { q: 'What kind of ramen does Shokku serve?', a: 'Shokku Ramen focuses on bold, intensely flavored Japanese ramen styles with a modern twist. Menus vary by location but typically include a signature rich broth alongside spicy and classic options. The emphasis is on assertive seasoning and depth of flavor rather than light or subtle broth profiles.' },
          { q: 'What should I order at Shokku Ramen on my first visit?', a: 'Start with the house signature bowl — it is where the concept is most fully expressed and gives you the clearest view of what the kitchen is doing. Add a soft-boiled marinated egg for richness, and ask your server about any current specials before committing to your order.' },
          { q: 'Does Shokku Ramen take reservations?', a: 'Reservation policies vary by location. Check the listing for your nearest Shokku Ramen or call ahead for large groups. For smaller parties, arriving at off-peak times — weekday lunches or early weekday dinners — is the most reliable way to get seated quickly.' },
          { q: 'What are the hours for Shokku Ramen?', a: 'Hours vary by location and some adjust seasonally. Check the listing on the map above for your nearest Shokku Ramen before heading out. Some locations may also close between lunch and dinner service, so confirming in advance is worth the effort.' },
          { q: 'Is Shokku Ramen good for someone new to ramen?', a: 'Yes, though I would prepare a first-time ramen eater for the intensity. The bold, assertive flavors that define Shokku can be a lot for someone expecting a mild soup — but in my experience most people who try it come around by the bottom of the bowl. The key is to take it slowly and let the broth reveal itself rather than judging on the first sip.' },
          { q: 'What if there is no Shokku Ramen near me?', a: 'Clear the brand search on the map and stack "Tonkotsu" or "Spicy" with "Top Rated" to find highly-rated ramen shops near you with a similar bold flavor profile. Some of the best ramen I have ever had came from independent shops surfaced this way — places that do not have brand recognition but put out extraordinary bowls.' },
        ]}
      />
    </main>
  )
}
