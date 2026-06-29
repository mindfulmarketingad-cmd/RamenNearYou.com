import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Miso Ramen Near Me | Hearty Sapporo-Style Ramen | RamenNearYou',
  description: 'Find miso ramen near you — the hearty, fermented-soybean broth from Sapporo. What makes great miso ramen, what to order, and how it compares to other styles.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/miso-ramen' },
  openGraph: {
    title: 'Miso Ramen Near Me',
    description: 'Find hearty, savory miso ramen near you.',
    url: 'https://www.ramennearyou.com/find/miso-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default function MisoRamenPage() {
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
          initialBowls={['miso']}
          pageTitle="Miso Ramen Near Me"
          pageDescription="Showing miso ramen near you. Enter your ZIP or use your location to find a hearty, savory bowl nearby."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/miso-ramen"
        heading="How I Find Hearty Miso Ramen Near Me"
        intro={[
          'When I want a bowl that feels like a warm hug, miso ramen is what I reach for every single time. That deep, savory, slightly sweet broth built on fermented soybean paste is the most full-bodied of the classic ramen styles, and it is absolutely incredible on a cold day or any time I need something genuinely comforting. The map above is filtered to miso ramen near you — enter your ZIP or use your location to find the closest bowl.',
          'Miso ramen has a specific origin and a specific personality, and knowing both makes it much easier to order well and to tell a great bowl from an ordinary one. The style comes from Sapporo, where harsh winters shaped a cuisine that prized warmth, richness, and staying power above all else. Understanding that context helps you appreciate why the toppings are what they are and why the noodles are the way they are.',
          'I have tried miso ramen all over, and the versions that stick with me are the ones where the kitchen clearly understands miso as an ingredient rather than just a flavoring. Good miso is complex — it has sweetness, funk, salt, and umami all at once — and a thoughtful cook uses it to build a broth that tastes layered and alive rather than just salty and thick.',
          'Here is what defines miso ramen, what to look for, what the toppings are and why they work, and how I order it to get the best possible bowl. Whether you are a miso veteran or trying it for the first time, this guide will help you navigate the map above and find a version worth the trip.',
        ]}
        sections={[
          {
            h2: 'What miso ramen is all about',
            body: (
              <p>
                Miso ramen comes from Sapporo, on the northern island of Hokkaido, where frigid winters call for
                something rich, warming, and deeply sustaining. The broth is seasoned with miso — fermented
                soybean paste — which gives it a thick, savory, umami-packed body with a touch of natural
                sweetness and a complex fermented depth you cannot get from any other seasoning. It is often
                built on a pork or chicken base and finished with ground pork stir-fried with garlic, corn,
                a pat of butter, and bean sprouts — a combination that sounds simple but creates pure,
                undeniable comfort. The miso is not cooked into the broth from the start; instead, it is whisked
                into hot stock at the last moment to preserve its complexity and living cultures.
              </p>
            ),
            points: [
              { h3: 'The broth', text: 'Thick, savory, and slightly sweet from the miso, with more body than shoyu or shio but a different kind of richness than tonkotsu. A well-made miso broth has layers — fermented funk, natural sweetness, deep umami, and a clean finish.' },
              { h3: 'Classic Sapporo toppings', text: 'Ground pork sauteed with garlic, sweet corn, a pat of butter, bean sprouts, and scallion — the Sapporo signature combination. The butter melts slowly into the broth and adds another dimension of richness and gloss.' },
              { h3: 'The noodles', text: 'Usually thicker, curlier noodles that grab onto the hearty broth and stand up to the substantial toppings. The extra surface area of a wavy noodle is genuinely important here — each bite carries more broth.' },
            ],
          },
          {
            h2: 'Spicy miso and other variations worth knowing',
            body: (
              <p>
                One of my favorite things about miso ramen is how remarkably well it takes to additional heat.
                Spicy miso, often called kara miso, adds chili paste or chili oil to the tare, creating a warming
                kick that plays beautifully against the broth's natural sweetness — the sweetness of the miso
                dampens the edge of the heat just enough to keep it exciting rather than punishing. If you like
                spice at all, kara miso is worth ordering. The corn-and-butter Hokkaido version leans the other
                way entirely: rich, almost comforting-sweet, golden from the butter, and ideal for cold weather.
                Some shops also do a butter-corn miso with a drizzle of chili oil on top, which is an excellent
                middle ground I always order when I see it.
              </p>
            ),
            points: [
              { h3: 'Kara miso (spicy miso)', text: 'Chili paste or rayu is blended into the tare before the miso, creating a heat that builds as you eat. The miso sweetness keeps it from feeling one-dimensional. Order it if you see it.' },
              { h3: 'Butter-corn miso', text: 'The Sapporo classic at its most iconic: a knob of butter placed on top melts slowly as you eat, enriching every spoonful with a glossy, dairy sweetness that complements the fermented miso base perfectly.' },
              { h3: 'White miso vs. red miso variations', text: 'Some shops specify which miso they use. White miso (shiro miso) is sweeter and milder; red miso (aka miso) is more pungent and deeply savory. Blended miso (awase miso) splits the difference and is the most common choice.' },
            ],
          },
          {
            h2: 'How I order miso ramen',
            body: (
              <p>
                I almost always go for the corn and butter option when I want pure comfort — there is nothing
                quite like watching that pat of butter melt slowly into the rich, steaming broth. When I want
                something with a little more energy, I order the spicy miso and let the heat build through
                the bowl. A soft egg is a non-negotiable addition for me regardless of which version I pick, and
                the thicker, curlier noodles mean I can take my time without worrying about them going soft.
                If a shop is specifically known for its miso — mentions it on the sign, has built a reputation
                on it — I trust them to have dialed in the balance of salt, sweetness, and fermented depth that
                makes or breaks the style.
              </p>
            ),
            points: [
              { h3: 'Start with butter corn if you are new', text: 'The corn-and-butter combination is the most approachable entry point to miso ramen. The sweetness of the corn and the richness of the butter make the fermented miso feel welcoming rather than challenging.' },
              { h3: 'Always add a soft egg', text: 'The jammy yolk enriches the already substantial broth and adds a silkiness that ties everything together. It is the single best addition to any miso bowl.' },
              { h3: 'Eat it hot and fast', text: 'Miso ramen is best when the butter is still melting and the broth is at full temperature. Unlike lighter styles, miso tends to thicken as it cools, so the first half of the bowl is the best half.' },
            ],
          },
          {
            h2: 'How miso ramen compares to the other classic styles',
            body: (
              <p>
                Understanding where miso fits among the four main ramen categories — tonkotsu, shoyu, shio, and
                miso — helps me choose the right bowl for the right moment. Tonkotsu gets its richness from
                long-simmered pork bones and is creamy in a very specific, fatty way. Shoyu is the lightest and
                most balanced of the soy-seasoned styles. Shio is the most delicate and lets the base stock
                do all the talking. Miso sits in its own lane: it is the thickest in flavor if not always in
                texture, the most intensely savory, and the most distinctly fermented. When I want something
                that fills me up and warms me from the inside, miso wins every time. When I want something
                clean and elegant, I reach for shio or shoyu instead.
              </p>
            ),
            points: [
              { h3: 'Miso vs. tonkotsu', text: 'Both are hearty and full-flavored, but their richness comes from entirely different sources. Tonkotsu richness is fatty and animal-forward; miso richness is fermented, complex, and slightly sweet. They are equally satisfying in very different ways.' },
              { h3: 'Miso vs. shoyu', text: 'Shoyu is lighter, more balanced, and designed to be clean and drinkable. Miso is bolder, more filling, and built for cold weather and big appetites. Shoyu is a great first ramen; miso is the one you graduate to when you want more.' },
              { h3: 'Miso for cold days and big meals', text: 'I reach for miso ramen when the temperature drops, when I skipped lunch, or when I want a bowl that doubles as a full meal. It is the most sustaining of the classic styles and the most forgiving of a big appetite.' },
            ],
          },
        ]}
        tipsHeading="My miso ramen tips"
        tips={[
          'Filter to "Miso," then sort by distance for the nearest hearty bowl. The map is already set, so just confirm your location to get started.',
          'Try the corn-and-butter Sapporo classic first if you are new to miso ramen — the sweetness of the corn and the richness of the butter make the fermented broth immediately approachable.',
          'Love heat? Look for spicy miso or kara miso on the menu. The miso sweetness balances the chili beautifully and keeps the heat from feeling one-dimensional.',
          'Always add a soft egg — the jammy yolk enriches the already substantial broth and adds silkiness that ties the whole bowl together.',
          'Eat it while it is very hot. Miso broth thickens as it cools, and the first half of a miso bowl is always the best half.',
          'Look for shops that specify the type of miso they use — white, red, or blended. It signals that the kitchen thinks seriously about the ingredient rather than treating it as a generic flavoring.',
          'Stack "Top Rated" to find the best-reviewed miso ramen near you, then read the reviews specifically for mentions of broth depth and noodle quality.',
          'Miso ramen pairs well with gyoza as a side — the crispy, pork-filled dumplings complement the rich, savory broth without competing with it.',
        ]}
        faqs={[
          { q: 'What is miso ramen?', a: 'Miso ramen is built on a broth seasoned with fermented soybean paste (miso). Originating in Sapporo, Hokkaido, it is rich, savory, and slightly sweet, often topped with corn, butter, bean sprouts, and ground pork. The miso gives the broth a complex, layered character that no other seasoning can replicate.' },
          { q: 'Is miso ramen spicy?', a: 'Classic miso ramen is savory and slightly sweet rather than spicy, but spicy miso — kara miso — adds chili paste or chili oil to the tare for real heat. Many shops offer both versions. The miso base actually dampens the edge of the spice, so kara miso tends to feel warming and exciting rather than punishing.' },
          { q: 'How is miso ramen different from tonkotsu?', a: 'Miso gets its body and flavor from fermented soybean paste, giving a savory-sweet, complex fermented character, while tonkotsu is a creamy broth from long-simmered pork bones with a fatty, porky richness. Miso also tends to use thicker, curlier noodles rather than the thin straight noodles associated with Hakata-style tonkotsu.' },
          { q: 'Is miso ramen vegetarian?', a: 'Not usually — most miso broths use a pork or chicken base and are topped with ground pork. However, miso ramen adapts extremely well to a vegetarian or vegan approach because miso paste itself is plant-based and pairs naturally with vegetable stocks and plant proteins. Some shops offer a dedicated vegan miso; confirm before ordering if it matters to you.' },
          { q: 'How do I find miso ramen near me?', a: 'The map above is filtered to miso. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then open a listing for hours, photos, and directions. I recommend checking the reviews for specific mentions of the miso broth to make sure a spot truly specializes in it.' },
          { q: 'What kind of noodles does miso ramen use?', a: 'Miso ramen typically uses thicker, wavy or curly noodles rather than the thin straight noodles of Hakata tonkotsu. The extra surface area of a wavy noodle holds onto the thick miso broth far better, so each bite is more flavorful. The noodles also tend to be more alkaline, giving them a distinctive chew that suits the bold broth.' },
          { q: 'What is the difference between white miso and red miso ramen?', a: 'White miso (shiro miso) is fermented for a shorter time and is sweeter and milder in flavor, producing a broth that is approachable and slightly sweet. Red miso (aka miso) is fermented longer and is more pungent, salty, and deeply savory. Blended miso (awase miso) combines both and is the most common choice in ramen shops because it balances sweetness with depth.' },
          { q: 'Why does miso ramen come from Sapporo?', a: 'Sapporo is the capital of Hokkaido, Japan\'s northernmost major island, where winters are genuinely brutal. The local food culture developed around rich, warming, sustaining dishes — and miso ramen, with its thick broth, hearty toppings, and deeply warming character, was a natural response to that climate. The style became popular nationwide but has always kept its Sapporo identity.' },
        ]}
      />
    </main>
  )
}
