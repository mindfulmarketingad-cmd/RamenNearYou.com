import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Shio Ramen Near Me | Light Salt-Based Ramen | RamenNearYou',
  description: 'Find shio ramen near you — the delicate, salt-seasoned broth that is the lightest classic style. What shio ramen is, how to order it, and how to spot a great one.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/shio-ramen' },
  openGraph: {
    title: 'Shio Ramen Near Me',
    description: 'Find light, delicate shio (salt) ramen near you.',
    url: 'https://www.ramennearyou.com/find/shio-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function ShioRamenPage() {
  const NATIONWIDE_FILTER = { initialBowls: ["shio"] }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(ranked.slice(0, 48), { verifiedSlugs })
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
        initialBowls={['shio']}
        pageTitle="Shio Ramen Near Me"
        pageDescription="Showing shio (salt) ramen near you. Enter your ZIP or use your location to find a light, delicate bowl nearby."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Shio Ramen Near Me" }]}
        title={`Shio Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/shio-ramen"
        guideLink={{
          href: '/blog/tonkotsu-vs-shoyu-vs-shio-vs-miso-4-types-of-ramen',
          title: 'Tonkotsu vs. Shoyu vs. Shio vs. Miso: The 4 Types of Ramen Explained',
          blurb: 'How shio compares to the other three classic broth styles — history, technique, flavor, and what to order.',
        }}
        heading="Where I Find Delicate Shio Ramen Near Me"
        intro={[
          'Shio is the quiet master of the ramen world. It is the lightest of the classic styles — a clear, salt-seasoned broth that lets the quality of the stock shine through with almost nothing to hide behind. The first time I had a truly excellent shio, I was struck by how much complexity could live in something so transparent and seemingly simple. The map above is filtered to shio ramen near you; enter your ZIP or use your location to find the closest delicate bowl.',
          'Shio rewards a careful palate and a careful kitchen. There is no soy sauce to add color and depth, no miso to add body and funk — just salt and whatever the cook built the stock from. That means every shio bowl is a direct expression of the chef\'s craft, and a great one is genuinely moving in a way that heavier, more assertive styles sometimes are not.',
          'I have been chasing great shio ramen for years, and the versions that stay with me are the ones where the stock is impeccably made — whether from chicken, seafood, pork, or some refined combination — and the salt tare is calibrated with enough precision that the broth tastes seasoned but never salty. Getting that right is harder than it sounds, and when a kitchen does it, I always come back.',
          'This guide explains what shio ramen is, why it is deceptively difficult to execute well, what to look for in a great bowl, and how to use the map above to find a version near you worth seeking out. Whether you are new to shio or have been hunting for a great one for a while, this is the practical breakdown I wish I had when I started.',
        ]}
        sections={[
          {
            h2: 'What shio ramen is',
            body: (
              <p>
                Shio means "salt," and that is the seasoning at the heart of the bowl. Instead of soy sauce or
                miso paste, the tare is salt-based — sometimes pure sea salt, sometimes a blend of salts, often
                combined with mirin, sake, or a touch of citrus to add dimension. This produces the clearest,
                most delicate broth of the four classic ramen styles. The base stock is usually built on clean
                chicken, seafood, pork, or an elegant combination of all three, and the salt tare seasons it
                with surgical precision. The result is light, savory, and pure — the broth tastes almost
                literally like whatever went into the pot, without the masking effect of soy or miso. Shio
                is often associated with Hakodate, a port city in Hokkaido, where the local fishing culture
                made seafood-forward stocks a natural fit for the clean salt seasoning.
              </p>
            ),
            points: [
              { h3: 'The broth', text: 'Clear and pale — the lightest classic style by both color and body. Seasoned with salt alone, the broth lets the underlying stock take center stage entirely. It should look almost like a very refined, very clear consomme.' },
              { h3: 'The base stock', text: 'Often chicken or seafood for the most elegant, clean flavor. Some of the most refined shio bowls use a dashi-forward stock built from kombu and dried fish, which adds an oceanic depth that suits the light seasoning beautifully.' },
              { h3: 'The toppings', text: 'Kept intentionally simple and refined — delicate chashu, scallion, menma, and sometimes a sliver of yuzu peel or a thin slice of citrus for brightness. The restraint is part of the aesthetic; nothing should compete with the clarity of the broth.' },
            ],
          },
          {
            h2: 'Why shio is harder to make well than it looks',
            body: (
              <p>
                Because there is no soy or miso to mask anything, every flaw in the underlying stock is
                completely exposed. A great shio broth has to be built on a genuinely excellent, carefully
                made stock — one that was properly skimmed, built with good ingredients, and simmered at the
                right temperature for the right amount of time. The salt tare then has to be calibrated with
                enough precision that the broth tastes beautifully seasoned without ever tipping into saltiness.
                That is a very narrow target to hit consistently, every service, every day. It is why I use
                shio as my benchmark for a refined, technique-driven shop: if their shio sings, I know the
                kitchen has real skill and real discipline. A mediocre shio cannot hide behind richness or
                complexity. It is nakedly what it is.
              </p>
            ),
            points: [
              { h3: 'Stock quality is everything', text: 'A shio broth is only as good as the stock underneath it. The bones, water, aromatics, and time all matter at a level that other styles can partially compensate for. Excellent shio starts with excellent stock, full stop.' },
              { h3: 'Salt calibration is a skill', text: 'Too little salt and the broth tastes flat and disappointing. Too much and it becomes unpleasant and one-dimensional. The best shio ramen chefs develop a near-automatic sense for this balance, adjusting daily based on the batch of broth.' },
              { h3: 'Aromatic oil as a bridge', text: 'Many skilled shio chefs add a thin layer of carefully flavored aromatic oil — chicken fat, yuzu oil, or a subtle herb oil — to the surface of the bowl. This adds fragrance and a thin richness without clouding the broth, bridging the gap between delicate and satisfying.' },
            ],
          },
          {
            h2: 'Who should order shio ramen',
            body: (
              <p>
                Shio is for when I want something elegant rather than heavy — a clean, almost restorative bowl
                that does not weigh me down or demand my full attention. It is my first choice on warmer days
                when tonkotsu would feel like too much, and my pick for a refined dinner when I want something
                that lets me appreciate technique rather than richness. It is also genuinely excellent for anyone
                who appreciates subtle flavors — people who enjoy a clear, well-made broth, who like tasting
                the individual components of a dish, and who find real pleasure in restraint. Stack "Top Rated"
                on the map to find the kitchens that have truly mastered this deceptively simple style.
              </p>
            ),
            points: [
              { h3: 'For the subtlety seeker', text: 'If you are someone who pays attention to the quality of stock in a soup, who appreciates when seasoning is precise rather than aggressive, and who finds pleasure in delicate flavors, shio was designed for you.' },
              { h3: 'For lighter meals and warm weather', text: 'Shio is my warm-weather ramen. When it is too hot for tonkotsu or too bright a day for miso, a clear, clean shio bowl feels right in a way no other ramen style does. It is refreshing and satisfying at the same time.' },
              { h3: 'For testing a new shop', text: 'Like shoyu, shio reveals kitchen technique immediately. A shop that makes excellent shio has earned my trust completely, because there is nowhere for them to hide. If you are visiting a new place and want to know how good it really is, order the shio.' },
            ],
          },
          {
            h2: 'Shio ramen across different regions',
            body: (
              <p>
                While Hakodate in Hokkaido is most often cited as the home of shio ramen, the style appears
                in different forms across Japan, each shaped by local ingredients and food culture. Hakodate
                shio tends to use a seafood-forward stock reflecting the city\'s fishing heritage, with a broth
                that has a gentle oceanic depth. Tokyo-area shio ramen often uses a refined chicken stock seasoned
                with a complex salt tare that includes sake, mirin, and sometimes a light dashi component.
                Modern craft ramen shops have pushed shio into highly refined territory, using single-source salts,
                multi-element dashi stocks, and aromatic oils crafted from single ingredients to produce bowls
                of remarkable complexity and subtlety. Whatever the regional origin, the unifying principle
                is the same: clarity, precision, and the courage to let a great stock speak for itself.
              </p>
            ),
            points: [
              { h3: 'Hakodate shio', text: 'The regional archetype, built on a seafood and chicken stock with a gentle maritime depth. The broth is very clear and light-golden, the toppings minimal, and the overall impression is of something pure and coastal.' },
              { h3: 'Tokyo-style shio', text: 'More focused on a refined chicken base with a multi-component salt tare. Often features a thin layer of chicken fat on the surface and toppings like delicate chashu, yuzu, and premium menma.' },
              { h3: 'Craft ramen shio', text: 'Modern shops elevate shio to its highest expression: house-made single-source salt tares, kombu-and-clam dashi bases, aromatic oils from roasted chicken skin or herb infusions. These are some of the most technically ambitious bowls in all of ramen.' },
            ],
          },
        ]}
        tipsHeading="My shio ramen tips"
        tips={[
          'Filter to "Shio," then sort by distance for the nearest delicate bowl. The map is already set to shio, so just confirm your location to get started.',
          'Judge it on the stock first — shio has nowhere to hide, and the broth must taste clean, savory, and multi-dimensional all at once. If it just tastes salty, the stock was weak.',
          'Look for a thin layer of aromatic oil on the surface of the bowl. A well-made shio uses flavored chicken fat or a delicate herb oil to add fragrance without clouding the clarity of the broth.',
          'Shio is the ideal bowl for warm weather and lighter meals — it is refreshing in a way that heavier styles simply cannot be, and it satisfies without weighing you down.',
          'Seek shops that mention their stock base specifically — chicken, seafood, or dashi-forward. This signals a kitchen that thinks seriously about what goes into a shio rather than treating it as a default light option.',
          'Use shio as a benchmark when visiting a new shop, just as you would shoyu. A kitchen that nails shio has nowhere to hide and has earned your trust completely.',
          'Stack "Top Rated" on the map to find kitchens that have mastered this subtle style. Then look in the reviews for specific language about broth depth and clarity rather than just overall satisfaction.',
          'If the shop offers a yuzu shio variation, try it — the citrus brightens the clean broth in a way that feels exactly right and is one of the most elegant flavor combinations in ramen.',
        ]}
        faqs={[
          { q: 'What is shio ramen?', a: 'Shio ("salt") ramen is the lightest classic ramen style — a clear, salt-seasoned broth, usually built on a clean chicken, seafood, or dashi-forward stock and served with thinner, straighter noodles and minimal, refined toppings. It is delicate, savory, and pure, with the quality of the underlying stock defining every bowl.' },
          { q: 'How is shio different from shoyu ramen?', a: 'Both are clear and relatively light in body, but shio is seasoned with salt alone and shoyu with soy sauce. Shio is even more delicate and transparent — the underlying stock is more exposed — while shoyu has a deeper, color-forward soy-driven savoriness. Shio is also typically lighter in color, ranging from nearly clear to a very pale gold.' },
          { q: 'Is shio ramen healthy or light?', a: 'It is the lightest of the four classic styles, with a clear broth, minimal fat, and simple toppings. That makes it a genuinely good choice when you want something restorative rather than rich, or when you are watching fat and calorie intake. It is still a full, satisfying meal — just a lighter one than tonkotsu or miso.' },
          { q: 'How can I tell if shio ramen is good?', a: 'Because there is no soy or miso to hide behind, everything depends on the stock. A great shio broth is simultaneously clean and deeply savory — those are hard to achieve together. It should taste of actual ingredients rather than just salt, and it should be clear and bright rather than murky. If the broth tastes one-dimensional or simply salty, the stock was not strong enough.' },
          { q: 'How do I find shio ramen near me?', a: 'The map above is filtered to shio. Enter your ZIP or tap "Use my location" to sort the closest bowls by distance, then open a listing for hours, photos, and directions. I recommend reading reviews specifically for mentions of broth quality rather than just checking star ratings.' },
          { q: 'Where does shio ramen come from?', a: 'Shio ramen is most closely associated with Hakodate, a port city in Hokkaido, where the fishing culture made seafood-forward stocks a natural pairing for clean salt seasoning. However, shio appears across Japan in regional variations, and it is one of the four foundational ramen categories alongside tonkotsu, shoyu, and miso.' },
          { q: 'What toppings go on shio ramen?', a: 'Shio toppings are intentionally minimal and refined: delicate sliced chashu, scallion, menma, and sometimes a sliver of yuzu peel or a thin slice of citrus for brightness. Some shops add a soft marinated egg. The restraint is intentional — nothing should compete with the clean, transparent broth that is the soul of the bowl.' },
          { q: 'Is shio ramen good for people who do not like heavy food?', a: 'Yes — it is genuinely the ramen I recommend to anyone who finds tonkotsu too rich or miso too heavy. The clear broth is light but fully satisfying, the toppings are simple, and the overall impression is clean and energizing rather than filling and sluggish. It is also a great choice for warmer weather when a heavy bowl feels like too much.' },
        ]}
      />
    </main>
  )
}
