import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ramen for Lunch Near Me | Quick Lunch Ramen Spots | RamenNearYou',
  description: 'Find ramen for lunch near you — quick, satisfying bowls that fit a lunch break. My picks for fast service, lunch deals, and bowls that won\'t put you to sleep at your desk.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/ramen-lunch' },
  openGraph: {
    title: 'Ramen for Lunch Near Me',
    description: 'Find quick, satisfying ramen for lunch near you.',
    url: 'https://www.ramennearyou.com/find/ramen-lunch',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function RamenLunchPage() {
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
          initialMoods={['quick-lunch']}
          pageTitle="Ramen for Lunch Near Me"
          pageDescription="Showing quick, satisfying ramen spots for lunch. Enter your ZIP or use your location to find a fast bowl near you."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/ramen-lunch"
        heading="How I Squeeze Great Ramen Into a Lunch Break"
        intro={[
          'Ramen is one of the best lunches going — hot, filling, and fast when you pick the right spot. It beats a sad desk sandwich, it beats a fast-food drive-through, and it does it at a price that usually fits a weekday budget without any guilt. The map above is filtered toward quick, satisfying lunch bowls near you. Enter your ZIP or use your location to find a spot close enough to the office that you spend your break actually eating and enjoying yourself, not commuting and rushing.',
          'The trick to ramen at lunch is choosing both the right restaurant and the right bowl for what the clock and your afternoon allow. Not all ramen shops are built for speed, and not all bowls are well-suited to midday eating. A slow, leisurely tonkotsu temple with a 30-minute wait might be perfect for a Saturday afternoon but is a disaster on a 45-minute lunch break. Here is how I get in and out in under an hour, plus how to avoid the bowl that leaves you ready for a nap at 2 PM.',
          'I eat ramen for lunch more than any other time of day, which means I have developed pretty strong opinions about what works and what does not. The key variables are proximity, service speed, and the density of the bowl — get all three right and you have the best possible midday meal. Get one wrong and you end up either skipping lunch or sleepwalking through your afternoon.',
          'Lunch ramen is also one of the best value meals in the city when you know where to look. Many shops run weekday lunch specials that combine a smaller or standard bowl with a side like gyoza, rice, or a drink at a meaningfully better price than ordering everything separately at dinner. Those sets are worth seeking out specifically, and I have learned which filters surface the spots most likely to offer them.',
        ]}
        sections={[
          {
            h2: 'What makes ramen a great lunch',
            body: (
              <p>
                Ramen has a structural advantage over most lunch options: it comes out fast. At a counter-style
                shop, you can be seated, order, and have a bowl in front of you within five to ten minutes of
                walking in. That is a speed most sit-down lunch options cannot match, and it means even a 45-minute
                break can work. The meal is also complete on its own — broth, noodles, protein, and vegetables
                all in a single bowl — which means there is no assembling sides or making decisions while the clock
                ticks. Takeout is an equally good option at many shops, especially if you order ahead: you pick up
                a ready bowl and eat back at your desk or in the park, which reclaims even more of your break for
                actual eating rather than waiting. The "Open Now" filter confirms a spot is serving, which I always
                check before leaving the office.
              </p>
            ),
            points: [
              { h3: 'Fast service', text: 'Counter-style shops are specifically built for speed — you can walk in, sit, and be eating a complete bowl within minutes. No table service delays, no bread basket to wait through.' },
              { h3: 'Takeout option', text: 'Ordering ahead for pickup turns a ramen lunch into a true grab-and-go experience. You spend your break eating, not waiting, and you can take the bowl wherever you want.' },
              { h3: 'Lunch specials', text: 'Many shops run weekday lunch sets — a standard bowl plus gyoza or rice at a better combined price than ordering each item separately at dinner. These sets are worth specifically seeking out.' },
            ],
          },
          {
            h2: 'Bowls that will not make you sleepy',
            body: (
              <p>
                A giant, ultra-rich tonkotsu with extra fat and double noodles is one of life's genuine pleasures,
                but at noon it can send you directly into a 2 PM slump that derails the rest of your workday. For
                a midday bowl I consistently lean lighter: a clean shoyu with a clear, soy-seasoned broth, a shio
                with its salt-forward brightness, or a simple chicken broth bowl that hits all the savory notes
                without the fat load of a full pork tonkotsu. If I do order tonkotsu at lunch, I go standard
                size rather than large and skip the extra fat. You still get the full ramen experience without the
                food coma consequence. A regular-size portion rather than an upgraded large is also a meaningful
                choice — the portion difference is often smaller than you expect, but the afternoon energy
                difference is real.
              </p>
            ),
            points: [
              { h3: 'Shoyu or shio for midday', text: 'Clean, clear broths deliver the full savory ramen experience without the heavy fat load that triggers an afternoon energy crash. They are also fast to eat since they are not as dense.' },
              { h3: 'Standard size over large', text: 'The large bowl feels like great value but can cross the line into too-full territory at noon. Standard size keeps you satisfied without the post-lunch heaviness.' },
              { h3: 'Skip the extra fat', text: 'Most tonkotsu shops offer a fat level setting. For a lunch bowl, go normal rather than extra — you still get richness without the sluggish aftermath.' },
            ],
          },
          {
            h2: 'Beating the lunch rush',
            body: (
              <p>
                Popular ramen spots get genuinely slammed between about noon and 1 PM on weekdays. If your
                schedule gives you any flexibility at all, going a little before noon — arriving at 11:30 when the
                shop first opens — or pushing lunch to 1:15 makes a meaningful difference in wait time and
                atmosphere. The room is calmer, the staff are less stretched, and the broth has been going long
                enough to be at its best without the kitchen being overwhelmed. If I have to eat right at noon,
                I lean toward spots with counter seating where single diners turn over quickly, or I order takeout
                ahead so I skip the line entirely. Stacking the "Open Now" filter confirms a spot is serving
                at that moment, and sorting by distance means I am not walking somewhere so far that the commute
                eats half my break.
              </p>
            ),
            points: [
              { h3: 'Eat at 11:30 or after 1', text: 'Arriving right at opening or after the peak means shorter waits, calmer rooms, and staff who are not in the weeds. Even 15 minutes of timing difference makes a real impact.' },
              { h3: 'Choose counter seating', text: 'Single counter seats at busy shops turn over fast. If you are eating alone, a counter spot often means skipping the line that forms for table seating.' },
              { h3: 'Order takeout ahead', text: 'For absolute efficiency, order pickup before you leave the office. You walk in, pick up your bowl, and your lunch break starts immediately rather than after a wait.' },
            ],
          },
          {
            h2: 'Getting the most out of a lunch set',
            body: (
              <p>
                Weekday lunch sets are one of ramen dining's best-kept secrets for the uninitiated. Many shops
                offer them only on weekdays during lunch hours, and they typically bundle a standard bowl with a
                portion of gyoza, a small rice, or a drink for a combined price that is noticeably better than
                ordering each item separately. The gyoza-and-bowl combination is my standard move: the gyoza
                arrives quickly, gives me something to eat while the bowl finishes, and rounds out the meal in a
                way that keeps me full through the afternoon without going overboard. I always ask at the counter
                or check the lunch menu section of the listing before I go, because these sets are not always
                prominently advertised.
              </p>
            ),
          },
        ]}
        tipsHeading="My lunch-ramen tips"
        tips={[
          'Sort by distance before anything else — a ramen spot is only a good lunch option if it is close enough to fit the commute into your break.',
          'Choose counter-style shops or order takeout ahead for the fastest turnaround; table service at a busy spot can eat your entire break.',
          'Go lighter at midday — a shoyu, shio, or standard-size bowl keeps you satisfied without the afternoon slump that a heavy tonkotsu can cause.',
          'Look for weekday lunch sets: a bowl plus gyoza or rice at a combined price is consistently better value than ordering separately.',
          'Beat the noon-to-1 PM rush by going at 11:30 when the shop opens or pushing lunch to after 1 PM — the difference in wait time is significant.',
          'Stack "Open Now" before leaving the office to confirm the spot is serving; nothing wastes a lunch break like walking to a closed kitchen.',
          'Single diners get a real advantage at counters — a solo lunch seat often means jumping the line that forms for tables.',
          'Order a soft egg as an add-on rather than ordering extra noodles; the protein keeps you fuller longer without the carb spike that leads to mid-afternoon fatigue.',
        ]}
        faqs={[
          { q: 'Where can I get ramen for lunch near me?', a: 'The map above is filtered toward quick lunch spots. Enter your ZIP or tap "Use my location" to find fast, satisfying bowls close to where you are. Sorting by distance first makes sure the closest open options appear at the top of the list.' },
          { q: 'Is ramen a good quick lunch?', a: 'Yes — it is one of the best. It comes out fast at counter-style shops, takeout is easy to set up ahead of time, and a single bowl is a complete meal. All of that makes ramen unusually well-suited to a 45-minute lunch break compared to most sit-down alternatives.' },
          { q: 'What ramen should I order for lunch?', a: 'Go a little lighter than your dinner bowl: a clean shoyu or shio, or a standard-size portion even if you usually order large. This gets you the full ramen satisfaction without the afternoon energy crash that a heavy tonkotsu or oversized bowl can cause.' },
          { q: 'Do ramen restaurants have lunch specials?', a: 'Many run weekday lunch sets — a standard bowl plus gyoza, rice, or a drink at a better combined price. These sets are not always prominently displayed, so it is worth checking the listing or asking at the counter before you order.' },
          { q: 'How do I beat the ramen lunch rush?', a: 'Go right at opening around 11:30, or push lunch past 1 PM if your schedule allows. Counter seats at busy spots also turn over faster than tables, and ordering takeout ahead eliminates the wait entirely.' },
          { q: 'Can I get ramen takeout for lunch?', a: 'Yes, and it is one of the best ways to manage a lunch break efficiently. Order ahead for pickup, collect your bowl, and eat wherever works for you. The main trade-off is that noodles continue absorbing broth in transit, so eating soon after pickup keeps the texture at its best.' },
          { q: 'How long does it take to eat ramen at a lunch counter?', a: 'At a fast counter-style shop you can realistically be in, eating, and out in about 20 to 25 minutes if you are not waiting for a seat. Add waiting time depending on how busy the spot is and whether you arrive at the rush. A total lunch break of 45 minutes is workable at the right spot.' },
          { q: 'Is ramen too heavy for a midday meal?', a: 'It can be if you choose the heaviest bowl and the largest portion. But a clean shoyu or shio in a standard size is genuinely well-calibrated for midday eating: satisfying, savory, and complete without being the kind of meal that demands a nap afterward. The choice of bowl matters as much as the restaurant.' },
        ]}
      />
    </main>
  )
}
