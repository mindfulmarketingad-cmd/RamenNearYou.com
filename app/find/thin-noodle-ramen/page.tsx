import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'
import PseoListicle from '@/components/pseo-listicle'
import { restaurants } from '@/lib/restaurants'
import { restaurantMatchesModifier } from '@/lib/modifier-match'
import { restaurantsToListicleItems, pickNationwideSample } from '@/lib/listicle-items'
import { getAllVerifiedSlugs } from '@/lib/verified-listings'

export const metadata: Metadata = {
  title: 'Thin Noodle Ramen Near Me | Hakata-Style Straight Noodles | RamenNearYou',
  description: 'Find thin noodle ramen near you — the delicate, firm, straight noodles of Hakata tonkotsu. Why thin noodles suit rich broth, and how to order them just right.',
  alternates: { canonical: 'https://www.ramennearyou.com/find/thin-noodle-ramen' },
  openGraph: {
    title: 'Thin Noodle Ramen Near Me',
    description: 'Find delicate, thin-noodle ramen near you.',
    url: 'https://www.ramennearyou.com/find/thin-noodle-ramen',
    siteName: 'RamenNearYou',
    type: 'website',
  },
}

export default async function ThinNoodleRamenPage() {
  const NATIONWIDE_FILTER = {  }
  const matched = restaurants.filter(r => restaurantMatchesModifier(r, NATIONWIDE_FILTER))
  const ranked = [...matched].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
  const verifiedSlugs = await getAllVerifiedSlugs()
  const listicleItems = restaurantsToListicleItems(pickNationwideSample(ranked), { verifiedSlugs })
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
        pageTitle="Thin Noodle Ramen Near Me"
        pageDescription="Find ramen restaurants serving thin, delicate noodles near you. Enter your ZIP or use your location to sort by distance."
      />
    </ErrorBoundary>
  )

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <PseoListicle
        breadcrumb={[{ label: 'Ramen Near You', href: '/' }, { label: 'Find Ramen', href: '/find' }, { label: "Thin Noodle Ramen Near Me" }]}
        title={`Thin Noodle Ramen Near Me — ${count} Spot${count === 1 ? '' : 's'}`}
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
        currentHref="/find/thin-noodle-ramen"
        heading="My Take on Thin Noodle Ramen Near Me"
        intro={[
          'Thin noodles are the soul of classic Hakata tonkotsu — delicate, firm, straight strands that slip through rich broth and cook in seconds. There is an elegance to a great thin-noodle bowl that I find myself craving often, particularly when I want something that feels precise and refined rather than hearty and heavy. The contrast between those delicate strands and a thick, creamy broth is one of ramen\'s most brilliant pairings. The map above helps you find ramen near you; enter your ZIP or use your location and look for the shops serving thin, straight noodles.',
          'Thin noodles come with their own customs, culture, and vocabulary that make ordering them a more interactive experience than many other styles. The concept of choosing noodle firmness, requesting an extra portion when you run out, and eating quickly before the noodles soften all make thin-noodle ramen feel like something you participate in rather than just receive. Once you understand the conventions, you will get a noticeably better bowl every single time.',
          'I have eaten thin-noodle ramen in many different contexts and styles, from classic Hakata tonkotsu to light shio bowls where thin noodles let the clarity of the broth take center stage. The versatility of thin noodles surprises people who assume they only belong in one style. They are not just for tonkotsu — they work beautifully in any bowl where the broth is the star and the noodle should support rather than compete.',
          'The map above is the fastest way to find thin-noodle ramen near you right now. Here is everything I have learned about what makes thin noodles special, how they pair with different broths, and how to order them like someone who has done this before.',
        ]}
        sections={[
          {
            h2: 'Why thin noodles pair with rich broth',
            body: (
              <p>
                It seems counterintuitive — thin noodles with heavy tonkotsu — but it works beautifully and
                makes perfect sense once you understand the logic. Thin, low-moisture Hakata-style noodles cook
                in well under a minute and stay firm, so they do not turn soft even in a thick, creamy broth.
                Their delicate gauge also lets the broth take center stage rather than competing with a chewy
                noodle for attention. Because the noodle is light and sleek, each slurp delivers mostly broth
                with the noodle as a clean, firm conduit. The pairing is a Kyushu classic for good reason —
                over generations, cooks in the Hakata region refined the formula and discovered that this
                specific noodle type made their tonkotsu shine rather than obscure it.
              </p>
            ),
            points: [
              { h3: 'Fast-cooking', text: 'Thin noodles cook in seconds, which is why Hakata shops cook them to order and serve the bowl almost immediately. That speed means maximum freshness from the moment the bowl arrives.' },
              { h3: 'Stays firm', text: 'Their low-moisture dough holds a firm bite even in rich, creamy tonkotsu broth, especially when ordered katame (firm) or barikata (very firm). The low hydration is a deliberate choice to preserve that snap.' },
              { h3: 'Lets broth shine', text: 'A delicate strand keeps the focus on a creamy tonkotsu or clean shio broth rather than competing with the noodle\'s own texture. The broth becomes the protagonist, and the noodle is a willing supporting actor.' },
            ],
          },
          {
            h2: 'Ordering firmness — and kaedama',
            body: (
              <p>
                Hakata shops usually let you choose noodle firmness: futsuu (normal), katame (firm), or barikata
                (very firm) for the truly al dente experience. I always order katame so the noodles stay at their
                best texture from first bite to last, because thin noodles can go from perfect to overcooked
                faster than any other style. The logic is simple: you can always leave noodles in hot broth a
                moment longer if you want them softer, but you cannot un-soften them once they are past their
                peak. Because thin noodles are quick to soften and the portions at Hakata-style shops are
                sometimes smaller by design, many shops offer kaedama — a fresh extra portion of noodles you
                add to your remaining broth when the first round is gone. This is not a side dish; it is the
                intended way to finish a tonkotsu bowl, and it is the right way to make the most of every last
                drop of broth.
              </p>
            ),
          },
          {
            h2: 'Where to find thin-noodle bowls',
            body: (
              <p>
                Thin, straight noodles are the signature of Hakata-style tonkotsu, so the most reliable way to
                find them is to look for tonkotsu specialists or shops that explicitly reference Hakata or
                Fukuoka in their branding. Stack the tonkotsu filter when browsing listings and check photos for
                that classic straight-noodle look — thin noodles are visually distinct from thick, wavy ones and
                easy to identify in a good bowl photo. Lighter shio and some shoyu bowls also use thin noodles
                if you want the delicacy without the richness of tonkotsu. At shops that serve multiple styles,
                the shio bowl is often where thin noodles appear most naturally because the clean, light broth
                pairs with the delicate noodle the same way tonkotsu does — both let the noodle exist without
                visual or textural competition.
              </p>
            ),
          },
          {
            h2: 'Thin noodles and the art of eating quickly',
            body: (
              <p>
                One of the defining features of thin-noodle ramen — particularly in the Hakata tradition — is
                that it rewards eating with intention and speed. This is not to say you should rush and miss the
                experience, but thin noodles do not have the same window of optimal texture that thick noodles
                do. I treat a thin-noodle bowl like a conversation that deserves my full attention: I sit down,
                start immediately, and stay engaged. I save the toppings and any add-ons for mid-bowl rather
                than front-loading them, which lets me eat through the noodles at their best firmness first.
                When the first round of noodles is gone and I still have rich broth left, I order kaedama and
                start again. It is one of the most enjoyable rituals in all of ramen culture.
              </p>
            ),
            points: [
              { h3: 'Start eating immediately', text: 'Thin noodles begin absorbing broth from the moment the bowl arrives, so the window of perfect firmness is shorter than with thick noodles. Do not wait.' },
              { h3: 'Order kaedama to finish the broth', text: 'A fresh portion of thin noodles added to remaining broth is both practical and delicious — a Hakata tradition worth embracing every time.' },
              { h3: 'Pair your firmness choice with the broth temperature', text: 'In a very hot, thick tonkotsu broth, ordering barikata (very firm) is smart because the broth will continue softening the noodles as you eat your way through the bowl.' },
            ],
          },
        ]}
        tipsHeading="My thin-noodle tips"
        tips={[
          'Stack the tonkotsu filter — Hakata-style thin straight noodles are the style\'s signature, and tonkotsu specialists almost always serve them.',
          'Order firmness to taste: katame (firm) or barikata (very firm) keeps the bite perfect throughout the bowl, especially in very hot broth.',
          'Order kaedama — a fresh portion of thin noodles — to finish your remaining broth when the first round is gone. It is the intended Hakata way to eat.',
          'Eat promptly after the bowl arrives; thin noodles soften faster than thick ones and the window of perfect texture is shorter.',
          'Want delicacy without the richness of tonkotsu? Look for thin-noodle shio or shoyu bowls, where the clean broth and delicate noodle work equally well together.',
          'Check menu photos for the noodle detail — straight, thin strands are visually obvious and easy to identify before you order.',
          'If a shop offers both thin and thick noodles, ask which pairs better with the specific broth you want; good ramen cooks have a strong opinion and it is always worth hearing.',
          'In very hot weather, a cold thin-noodle bowl (hiyashi chuka or cold ramen) is a great way to appreciate the clean texture of thin noodles without broth temperature softening them further.',
        ]}
        faqs={[
          { q: 'What is thin noodle ramen?', a: 'It is ramen made with thin, firm, straight noodles — most famously the signature of Hakata-style tonkotsu from Kyushu, Japan. They cook in seconds, stay firm in rich broth, and let the broth take center stage rather than competing with the noodle\'s own texture.' },
          { q: 'Why do thin noodles go with tonkotsu broth?', a: 'Thin, low-moisture noodles hold a firm bite even in thick, creamy tonkotsu and cook almost instantly, so they stay perfect while letting the rich broth shine. The delicate noodle acts as a conduit for the broth rather than a competing element. It is a Kyushu classic refined over generations.' },
          { q: 'What does katame and barikata mean?', a: 'They are noodle firmness levels at Hakata shops: futsuu is normal, katame is firm, and barikata is very firm (extra al dente). Ordering katame or barikata is smart because thin noodles soften quickly in hot broth and you want to preserve their texture throughout the bowl.' },
          { q: 'What is kaedama?', a: 'Kaedama is an extra portion of fresh noodles you order to add to your leftover broth once the first round is gone — a Hakata tradition that suits fast-softening thin noodles perfectly. It means you never have to waste a drop of good broth and you always finish with noodles at their freshest.' },
          { q: 'How do I find thin noodle ramen near me?', a: 'Use the map above and filter to tonkotsu, since thin straight noodles are its signature. Check listings and photos for the straight-noodle look, or ask the shop about their noodle style. Shio and light shoyu bowls also often use thin noodles.' },
          { q: 'Are thin noodles only for tonkotsu ramen?', a: 'No — thin noodles also appear in clean shio bowls, some shoyu styles, and cold ramen preparations. Anywhere the broth is meant to be the star and the noodle should support without competing, thin noodles are a natural fit.' },
          { q: 'How do thin noodles differ from thick noodles in texture?', a: 'Thin noodles are more delicate and have a snappier, crisper bite when cooked firm. Thick noodles offer a more substantial, springy chew. Thin noodles soften faster in hot broth, which is why Hakata culture developed the custom of ordering by firmness and adding kaedama when the first portion is gone.' },
          { q: 'Can I get thin noodles at any ramen shop?', a: 'Not necessarily — most shops use a fixed noodle matched to their broth. The most reliable way to find thin noodles is to seek out Hakata-style tonkotsu specialists or shio shops. Check menus and photos, or simply ask — staff are almost always happy to describe the noodle style they use.' },
        ]}
      />
    </main>
  )
}
