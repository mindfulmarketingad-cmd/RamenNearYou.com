import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'JINYA Ramen Bar Near Me | Find a JINYA Location | RamenNearYou',
  description: 'Find JINYA Ramen Bar near you — the chain known for slow-simmered tonkotsu and customizable bowls. What JINYA is known for, what to order, and nearby alternatives.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/jinya-ramen' },
  openGraph: {
    title: 'JINYA Ramen Bar Near Me',
    description: 'Find a JINYA Ramen Bar location near you.',
    url: 'https://www.ramennearyou.com/find/jinya-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function JinyaRamenPage() {
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
          initialQuery="jinya"
          pageTitle="JINYA Ramen Bar Near Me"
          pageDescription="Find a JINYA Ramen Bar near you. Enter your ZIP or use your location to sort locations by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/jinya-ramen"
        heading="How to Find JINYA Ramen Bar Near Me"
        intro={[
          'JINYA Ramen Bar is one of the most popular ramen chains in the United States, and for good reason — slow-simmered tonkotsu, a deep and well-considered menu, and a polished, sit-down bar atmosphere that makes it a comfortable choice for groups and solo visits alike. The map above is set to find JINYA locations near you; enter your ZIP or use your location to see the closest one, and I have included everything I know about what to order and how to find a great alternative if there is no JINYA within reach.',
          'Whether you are a JINYA regular or trying it for the first time, understanding what the chain is doing well helps you get the most from the visit. JINYA built its reputation on taking tonkotsu seriously — the broth is simmered for many hours and that time investment shows in every bowl. But it also broadened its appeal by offering a genuinely wide range of styles and accommodating dietary preferences that most ramen-only spots do not bother with. I find that flexibility makes JINYA one of the easiest ramen recommendations to make when I am going out with a mixed group.',
          'The atmosphere at JINYA leans modern and bar-forward. There is usually a full sake and cocktail list, table service throughout, and a menu of shareable starters that make it feel more like a proper restaurant than a quick-service noodle shop. That is by design, and it works well for the American dining context. I have had long, leisurely meals at JINYA that extended well past the ramen bowl itself.',
          'Here is everything I know about JINYA — what makes the tonkotsu worth ordering, how to navigate the menu, and where to look if the closest location is not convenient.',
        ]}
        sections={[
          {
            h2: 'What JINYA is known for',
            body: (
              <p>
                JINYA built its reputation on tonkotsu broth simmered for many hours, paired with thin or thick
                noodles you can often choose, and a wide range of bowls from rich and porky to spicy and even
                vegan-friendly options. The vibe leans toward a modern ramen bar — table service, a full drink
                list, and shareable starters — which makes it a reliable, comfortable choice for groups and
                first-timers. What I appreciate most about JINYA is that they committed to the broth. The long
                simmer is not a marketing claim; you can taste the time in the bowl. The depth of the tonkotsu
                here is genuine, and the kitchen clearly takes the base seriously. That commitment to the
                foundational element is why JINYA has grown as fast as it has while maintaining consistent
                quality across locations.
              </p>
            ),
            points: [
              { h3: 'Slow-simmered tonkotsu', text: 'Their signature pork broth is the headliner — rich and creamy after a long simmer. I always start with a sip of the broth before adding anything, and it consistently delivers that satisfying coating richness that only comes from a properly long cook.' },
              { h3: 'Customizable bowls', text: 'Choose noodle thickness, spice level, and toppings to dial in your bowl exactly how you want it. The ability to choose between thin and thick noodles alone makes JINYA more flexible than most tonkotsu specialists, and I find myself going back and forth depending on my mood.' },
              { h3: 'Full bar experience', text: 'Sake, cocktails, Japanese whisky, and a solid beer list make JINYA a comfortable sit-down spot, not just a quick counter. I have had some of my best ramen pairings here — a cold Sapporo with a rich tonkotsu black is hard to beat.' },
            ],
          },
          {
            h2: 'What to order at JINYA',
            body: (
              <p>
                The tonkotsu bowls are the move at JINYA. The Tonkotsu Black (with garlic and garlic oil added
                to the base broth) is consistently one of the most popular orders and for good reason — the
                garlic oil deepens the richness in a way that feels addictive rather than overwhelming. The
                spicy options are well balanced too; the heat never feels like a gimmick and it integrates
                cleanly with the pork-bone richness. I always add a seasoned egg to whatever bowl I order, and
                I usually start with either the crispy chicken or the brussels sprouts as a shared plate while
                the bowls are being prepared. If you want the noodles to hold up through the full bowl, order
                them firm — the broth is rich enough that softer noodles can get a little lost.
              </p>
            ),
            points: [
              { h3: 'Tonkotsu Black is the signature order', text: 'The Tonkotsu Black with garlic oil is what I recommend to anyone visiting JINYA for the first time. It represents the chain at its most confident — deep, rich, porky, and just slightly sharp from the garlic.' },
              { h3: 'Spicy options are balanced, not punishing', text: 'JINYA does spicy ramen well. The heat integrates into the broth rather than sitting on top of it, which makes the spicy bowls genuinely satisfying rather than just aggressively hot. If you like heat, they are worth trying.' },
              { h3: 'Shareable starters make the meal', text: 'The brussels sprouts and crispy chicken are reliable orders that hold the table while the ramen arrives. JINYA\'s kitchen handles non-ramen items with more care than most ramen chains, and the starters show it.' },
            ],
          },
          {
            h2: 'JINYA for dietary restrictions',
            body: (
              <p>
                One of JINYA's genuine strengths is menu breadth for people with dietary restrictions. Beyond
                the tonkotsu core, most JINYA locations carry vegan and vegetarian ramen options — typically
                a carefully made vegetable-based broth with plant-based toppings — that are thoughtfully
                constructed rather than an afterthought. This is rarer than you might think in the ramen world,
                where vegetarian options are often an underseasoned consolation bowl. I have brought friends
                with dietary restrictions to JINYA many times because I know there will be something on the
                menu that works for everyone at the table. Gluten-sensitive diners should always ask staff
                about specific dishes, but the range of options available makes JINYA one of the more
                accommodating ramen chains I know.
              </p>
            ),
            points: [
              { h3: 'Vegan ramen that stands on its own', text: 'The vegan broth at JINYA is typically built with the same care as the tonkotsu — it is not an afterthought, and I have had versions of it that are genuinely compelling in their own right.' },
              { h3: 'Vegetarian-friendly starters', text: 'Several of the shared plates are vegetarian-friendly, making it easy to put together a full meal without defaulting to the pork-forward main bowls.' },
              { h3: 'A reliable group dining choice', text: 'Because JINYA caters to a range of preferences and has table service, it is one of my go-to recommendations when I am organizing ramen outings with people who have different dietary needs.' },
            ],
          },
          {
            h2: 'No JINYA nearby? Great alternatives',
            body: (
              <p>
                If the closest JINYA is a hike, the map can help you find an independent tonkotsu specialist
                instead — often an even more memorable bowl. Clear the search and stack the "Tonkotsu" filter,
                or add "Top Rated" to surface the best-reviewed ramen near you. Some of my favorite bowls have
                come from small local shops I found exactly this way. An independent ramen shop doing serious
                tonkotsu often has a level of craft and personal investment in the broth that chains struggle
                to match — the owner may have trained in Japan, developed a proprietary recipe over years, or
                built a local following based purely on the quality of the bowl. These are the discoveries that
                make ramen hunting genuinely exciting, and the map is the fastest way I know to surface them.
              </p>
            ),
          },
          {
            h2: 'Making the most of a JINYA visit',
            body: (
              <p>
                A few practical notes from my visits. JINYA can get busy at weekend dinners, especially at
                locations in suburban strip malls and shopping centers, where they tend to draw large groups.
                A weekday lunch or an early weekday dinner significantly reduces your wait time and gives you
                a more relaxed meal. The drink menu is worth exploring — JINYA puts thought into its sake and
                Japanese whisky selections and a well-chosen drink genuinely elevates the ramen. Finally, take
                the noodle choice seriously. Thin noodles in tonkotsu give you the Hakata-style experience,
                while thick noodles provide more chew and absorb the broth differently. I switch between them
                depending on the bowl I am ordering, and both have a place at JINYA.
              </p>
            ),
          },
        ]}
        tipsHeading="My JINYA tips"
        tips={[
          'Enter your ZIP or use your location to find the nearest JINYA, sorted by distance. JINYA has a strong U.S. presence, so there is likely one within a reasonable distance.',
          'Order a tonkotsu bowl as your main — the Tonkotsu Black with garlic oil is the signature, and it earns that status. It is consistently the most recommended bowl by regulars.',
          'Ask for firmer noodles so they hold up in the rich broth without going soft before you finish the bowl.',
          'Start with a shared plate while the ramen arrives — the brussels sprouts and crispy chicken are reliable orders that the kitchen handles with genuine care.',
          'Check whether JINYA has a vegan or vegetarian option when dining with dietary restrictions. Their plant-based broth is one of the better ones in the chain ramen category.',
          'Explore the drink menu — the sake and Japanese whisky selections pair better with rich tonkotsu than most casual ramen spots offer.',
          'Go on a weekday or arrive early for dinner to skip the weekend rush. JINYA locations in busy suburban areas can have significant waits on Saturday nights.',
          'No JINYA nearby? Clear the search and stack "Tonkotsu" then "Top Rated" to find an independent specialist near you — often a surprising and memorable discovery.',
        ]}
        faqs={[
          { q: 'What is JINYA Ramen Bar known for?', a: 'JINYA is known for slow-simmered tonkotsu (pork-bone) broth, customizable bowls with choice of noodle thickness and spice level, and a modern ramen-bar atmosphere with table service, a full drinks list, and shareable starters. It is one of the more polished and consistent ramen chains in the United States.' },
          { q: 'What should I order at JINYA?', a: 'The tonkotsu bowls are the highlight — the Tonkotsu Black with garlic oil is the fan favorite and my personal recommendation for a first visit. Add a seasoned soft-boiled egg, order your noodles firm, and start with a shareable plate like the crispy chicken or brussels sprouts.' },
          { q: 'Does JINYA have vegan or vegetarian ramen?', a: 'JINYA typically offers vegan and vegetarian-friendly bowls in addition to its pork tonkotsu. The vegan broth is usually built with real care rather than being an afterthought, making it one of the better plant-based options in the chain ramen category. Options vary by location, so check the menu at your nearest spot.' },
          { q: 'What is the difference between thin and thick noodles at JINYA?', a: 'Thin noodles give you a more traditional Hakata-style experience — they slip through the broth cleanly and absorb the richness quickly. Thick noodles provide more chew and hold up differently in the soup. Both work well; I tend toward thin in the tonkotsu black and thick in spicier bowls, but personal preference matters most.' },
          { q: 'How do I find a JINYA near me?', a: 'The map above is set to find JINYA locations. Enter your ZIP or tap "Use my location" to see the closest ones sorted by distance. JINYA has a substantial U.S. presence, so there is a good chance one is within reach.' },
          { q: 'What if there is no JINYA near me?', a: 'Clear the search and stack the "Tonkotsu" filter to find an independent tonkotsu specialist nearby, or add "Top Rated" to discover the best-reviewed ramen in your area. Independent shops doing serious tonkotsu can be exceptional, and this filter combination is the fastest way to find them.' },
          { q: 'Is JINYA good for groups?', a: 'Yes — JINYA is one of the more group-friendly ramen concepts around. Table service, a wide menu that accommodates dietary restrictions, a full drinks list, and an ample selection of shareable starters make it easy to organize a satisfying meal for a mixed group. I regularly take friends there when I want to introduce someone to ramen in a comfortable setting.' },
          { q: 'What is the best time to visit JINYA to avoid a wait?', a: 'Weekday lunches and early weekday dinners are the lowest-traffic times. JINYA locations near shopping centers and in suburban areas tend to be busiest on Friday and Saturday evenings. Going at opening or before 6 PM on a weekday almost always means you will be seated immediately.' },
        ]}
      />
    </main>
  )
}
