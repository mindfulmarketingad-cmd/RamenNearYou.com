import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import ServiceCityLinks from '@/components/service-city-links'
import { getServiceCityLinks } from '@/lib/city-filter-pages'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Vegan Ramen Near Me | Plant-Based Ramen | RamenNearYou',
  description: 'Find vegan ramen near you — fully plant-based broths and toppings with serious umami. What makes great vegan ramen, what to ask, and how it differs from vegetarian.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/vegan-ramen' },
  openGraph: {
    title: 'Vegan Ramen Near Me',
    description: 'Find fully plant-based vegan ramen near you.',
    url: 'https://www.ramennearyou.com/find/vegan-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function VeganRamenPage() {
  const cityLinks = getServiceCityLinks('Vegan')
  const NATIONWIDE_FILTER = { initialBowls: ["vegan"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked, { verifiedSlugs })
  const count = matched.length

  const mapSlot = (
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
        initialBowls={['vegan']}
        pageTitle="Vegan Ramen Near Me"
        pageDescription="Showing vegan ramen near you. Enter your ZIP or use your location to find a fully plant-based bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Vegan Ramen Near Me" }]}
        title={`Vegan Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
        subtitle={"Every ramen restaurant we track that matches this, ranked by rating and review volume. Search by name or city, or switch to the map."}
        items={listicleItems}
        noun="ramen restaurant"
        nounPlural="ramen restaurants"
        searchPlaceholder="Search by name or city..."
        filterLabel="Feature"
        primaryCtaLabel="View details"
        mapSlot={mapSlot}
      />

      <FindPageContent
        currentHref="/find/vegan-ramen"
        heading="How I Find Genuinely Great Vegan Ramen Near Me"
        intro={[
          'Vegan ramen has gone from an afterthought to some of the most exciting bowls being made today. Kitchens are coaxing incredible depth out of mushrooms, kombu, miso, and roasted vegetables with no animal products at all, and the results can genuinely rival anything made with pork bones or fish stock. The map above is filtered to vegan ramen near you; enter your ZIP or use your location to find the closest plant-based bowl.',
          'I have been seeking out vegan ramen for years, and it has changed my understanding of what makes a great bowl. The best plant-based kitchens approach broth building as a serious craft — layering ingredients, adjusting seasoning, and coaxing umami out of every vegetable and fungus they can get their hands on. Once you taste a well-made vegan miso or a deeply savory kombu-shiitake broth, it is hard to go back to thinking of plant-based ramen as a compromise.',
          'The catch is that "vegan" needs to be verified carefully in a ramen kitchen, where fish and pork sneak into broths and seasonings by default. Many shops label a bowl vegetarian when the broth is plant-based but the tare is finished with bonito, or they add a pat of butter as a garnish. Here is what makes a great vegan bowl and exactly what to confirm before you order so you can enjoy every last drop.',
          'Whether I am in my home city or traveling somewhere new, I use this page the same way: I pull up the map, filter to vegan, read a few reviews to see if people mention the broth specifically, and then call ahead to confirm. That extra two minutes of checking has saved me from more than a few disappointing surprises.',
        ]}
        sections={[
          {
            h2: 'What makes great vegan ramen',
            body: (
              <p>
                The whole game is building umami without animal products, and the best vegan kitchens do it
                brilliantly. A deep broth comes from kombu (kelp), dried shiitake mushrooms, roasted vegetables,
                soy, and miso, layered until it is every bit as savory and satisfying as a traditional bowl.
                Creamy styles use sesame paste or soy milk for body, and the result can genuinely rival a
                meat-based ramen in richness and depth. What separates a great vegan bowl from a mediocre one is
                how many umami sources the kitchen stacks together — a single-note broth tastes flat, while a
                layered one tastes full and complete. The best bowls I have had use at least three or four different
                sources of savory depth, from roasted garlic to dried tomato to fermented bean paste.
              </p>
            ),
            points: [
              { h3: 'Mushroom and kombu broth', text: 'Shiitake and kelp deliver the deep, savory backbone that meat usually provides — when simmered long and slow, they release glutamates that create a genuinely meaty umami the foundation of great vegan ramen.' },
              { h3: 'Miso and sesame', text: 'Vegan miso and creamy sesame (tantanmen-style) bowls are naturally suited to plant-based cooking. Fermented miso brings depth and complexity, while tahini or ground sesame adds a rich, nutty body that makes the bowl feel substantial.' },
              { h3: 'Toppings with substance', text: 'Marinated mushrooms, braised tofu, corn, bamboo shoots, blanched greens, and nori make the bowl hearty and complete. Great vegan shops treat toppings as seriously as they treat the broth, seasoning each one individually so the whole bowl sings.' },
            ],
          },
          {
            h2: 'Vegan vs. vegetarian — verify it',
            body: (
              <p>
                Vegan means zero animal products, full stop — and that is stricter than it sounds in a ramen
                shop. A broth that looks plant-based may be finished with a fish tare (bonito or niboshi), and
                toppings like a soft-boiled egg or a pat of butter make a bowl vegetarian but not vegan. A
                tablespoon of lard stirred into the broth at the end is another common surprise, added for
                richness by kitchens that have not thought through the implications for vegan diners. So even on a
                vegan-filtered list, I always confirm the specific bowl is fully plant-based before ordering,
                because menus change and kitchens have different definitions of the word.
              </p>
            ),
          },
          {
            h2: 'What to ask before ordering',
            body: (
              <p>
                Two questions cover most situations: "Is the broth and the tare entirely plant-based, with no fish
                or chicken stock?" and "Are all the toppings vegan — no egg, no butter, no mayo?" Most shops
                that offer a dedicated vegan bowl have thought this through and will answer confidently. A quick
                check means you get a bowl you can fully enjoy, and it also signals to the kitchen that vegan
                diners are paying attention, which encourages them to keep standards high.
              </p>
            ),
          },
          {
            h2: 'How I build the perfect vegan bowl',
            body: (
              <p>
                Once I have confirmed the bowl is truly plant-based, I think about how to customize it for
                maximum satisfaction. I almost always ask for extra mushrooms and any marinated tofu the kitchen
                offers, because those toppings deliver the most protein and chew. If the shop lets me adjust
                richness level, I go medium-rich to get the full depth without the broth feeling flat or watery.
                I also pay attention to the noodle recommendation — a chewy, alkaline noodle stands up to a bold
                vegan broth better than a thin noodle, which can get lost. Finishing the bowl with a little chili
                oil or house-made spice paste adds a final layer of complexity that I rarely skip.
              </p>
            ),
            points: [
              { h3: 'Extra mushrooms and tofu', text: 'These are the most satisfying plant-based toppings in a ramen bowl, delivering both umami and texture. Ask for extra if the kitchen offers it — the difference between a good vegan bowl and a great one is often simply more of the right toppings.' },
              { h3: 'Medium-rich broth setting', text: 'If the shop offers richness levels, I prefer a medium setting. A very thin vegan broth can taste watery, while medium lets the layered flavors come through clearly without overwhelming the palate.' },
              { h3: 'Chili oil or spice paste', text: 'A spoonful of good chili oil or house spice paste adds heat, fat, and another umami layer to a plant-based bowl. Most vegan-friendly shops keep a naturally vegan chili condiment on hand, so it is always worth asking.' },
            ],
          },
          {
            h2: 'Why vegan ramen deserves its own search',
            body: (
              <p>
                I built this filtered search because searching for "ramen near me" and then hunting through menus
                for vegan options is genuinely tedious. A surprising number of ramen shops now offer at least one
                dedicated vegan bowl, and the quality has risen sharply in recent years as plant-based cooking has
                become more mainstream. By filtering specifically to vegan, you surface those bowls immediately
                and can spend your time comparing quality rather than cross-referencing ingredient lists. The goal
                is to make it as easy as possible to find a bowl worth ordering, so you can spend more time eating
                and less time searching.
              </p>
            ),
          },
          ...(cityLinks.length > 0 ? [{
            h2: 'Vegan Ramen by City',
            body: (
              <>
                <p>
                  Want a deeper dive into a specific city&apos;s vegan ramen scene? I have written dedicated
                  guides for these cities, each with its own map, top picks, and local notes:
                </p>
                <ServiceCityLinks links={cityLinks} />
              </>
            ),
          }] : []),
        ]}
        tipsHeading="My vegan ramen tips"
        tips={[
          'Filter to "Vegan," then sort by distance for the nearest plant-based bowl — it is the fastest starting point.',
          'Lean toward vegan miso and sesame tantanmen-style bowls first; they tend to have the most developed flavor without animal products.',
          'Confirm both the broth and the tare are plant-based before ordering; a fish tare is the most common hidden catch in otherwise vegan bowls.',
          'Check toppings individually — egg and butter make a bowl vegetarian but not vegan, and they can appear even on bowls the menu labels as plant-based.',
          'Load up on mushrooms, braised tofu, corn, and greens to make the bowl hearty and complete; great toppings are what turn a good vegan broth into a filling meal.',
          'Read recent reviews specifically for the word "vegan" — other plant-based diners will flag if a shop is truly reliable or if past experiences have been inconsistent.',
          'If the shop is new to you, a quick phone call before visiting is worth the two minutes; a kitchen that answers vegan questions confidently is a kitchen you can trust.',
          'Do not skip the noodles — a thick, chewy wheat noodle (if you eat wheat) or a hearty rice noodle holds up far better in a bold vegan broth than a thin noodle does.',
        ]}
        faqs={[
          { q: 'What is vegan ramen?', a: 'Vegan ramen is a fully plant-based bowl with no meat, fish, egg, or dairy in any component. The broth builds umami from kombu, shiitake mushrooms, roasted vegetables, soy, and miso, and when done well it can be every bit as savory and satisfying as a traditional bowl. Toppings are all plant-based as well, often including marinated mushrooms, tofu, corn, bamboo shoots, and nori.' },
          { q: 'Is vegan ramen the same as vegetarian ramen?', a: 'No, and the difference matters. Vegetarian ramen may include egg, dairy, or a fish-based tare or dashi — all of which are excluded from vegan ramen. A bowl labeled vegetarian could still have a bonito-finished tare or a soft egg on top. Always confirm the specific bowl is fully plant-based, even when using a vegan-filtered search, because menus change and kitchen standards vary.' },
          { q: 'What makes a good vegan ramen broth?', a: 'Deep, layered umami from kombu (kelp), dried shiitake mushrooms, roasted vegetables, and fermented seasonings like miso and soy. The best vegan broths stack multiple umami sources so no single ingredient dominates. Creamy versions use sesame paste or soy milk for body, while clear styles let the clean stock flavor shine through. The result should taste savory and full, not flat or watery.' },
          { q: 'What should I ask to confirm ramen is vegan?', a: 'Ask two things: first, whether the broth and tare are entirely plant-based with no fish or chicken stock; second, whether all toppings are vegan with no egg, butter, or mayo. A fish tare is the most common hidden ingredient, but lard stirred into the broth and butter used as a garnish are also worth checking. Kitchens that genuinely offer vegan bowls will answer these questions readily.' },
          { q: 'Which ramen styles work best as vegan?', a: 'Miso and sesame (tantanmen-style) bowls adapt most naturally to being fully plant-based, because the miso paste and sesame already deliver the body and umami that meat usually provides. Clear vegan shio and shoyu styles are lighter but can be equally satisfying when the broth is well made. Avoid tonkotsu-style labels unless the shop explicitly makes a plant-based version.' },
          { q: 'How do I find vegan ramen near me?', a: 'The map above is filtered to vegan ramen. Enter your ZIP code or tap "Use my location" to sort the closest plant-based bowls by distance. From there I recommend reading a few recent reviews to confirm quality and then calling the shop to verify the specific bowl is fully plant-based before you make the trip.' },
          { q: 'Can I customize a vegan ramen bowl?', a: 'Usually yes. Most shops that take vegan bowls seriously will let you adjust toppings, add extra mushrooms or tofu, and sometimes choose a richness level. Ask about chili oil or spice paste as a finishing condiment — many shops keep a naturally vegan version. The key is to treat the bowl as a starting point and build from there rather than taking the default.' },
          { q: 'Is vegan ramen healthy?', a: 'Vegan ramen can be a nutritious meal, especially when loaded with mushrooms, tofu, and vegetables that deliver protein, fiber, and micronutrients. Like any ramen, sodium can be high in the broth, so I do not always finish every last drop of the soup. Overall, a well-constructed vegan bowl is a balanced, satisfying meal rather than a guilty indulgence.' },
        ]}
      />
    </main>
  )
}
