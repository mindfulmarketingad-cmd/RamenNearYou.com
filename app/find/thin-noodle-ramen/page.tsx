import type { Metadata } from 'next'
import HomeMapHero from '@/components/home-map-hero'
import ErrorBoundary from '@/components/error-boundary'
import Navbar from '@/components/navbar'
import FindPageContent from '@/components/find-page-content'
import { Loader2 } from 'lucide-react'

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

export default function ThinNoodleRamenPage() {
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
          pageTitle="Thin Noodle Ramen Near Me"
          pageDescription="Find ramen restaurants serving thin, delicate noodles near you. Enter your ZIP or use your location to sort by distance."
        />
      </ErrorBoundary>

      <FindPageContent
        currentHref="/find/thin-noodle-ramen"
        heading="My Take on Thin Noodle Ramen Near Me"
        intro={[
          'Thin noodles are the soul of classic Hakata tonkotsu — delicate, firm, straight strands that slip through rich broth and cook in seconds. There is an elegance to a great thin-noodle bowl that I find myself craving often. The map above helps you find ramen near you; enter your ZIP or use your location and look for the shops serving thin, straight noodles.',
          'Thin noodles come with their own customs, especially around firmness, and getting it right makes a real difference. Here is why they pair with certain broths and how to order them.',
        ]}
        sections={[
          {
            h2: 'Why thin noodles pair with rich broth',
            body: (
              <p>
                It seems counterintuitive — thin noodles with heavy tonkotsu — but it works beautifully. Thin,
                low-moisture Hakata-style noodles cook in well under a minute and stay firm, so they do not turn
                soft even in a thick, creamy broth. Their delicate gauge also lets the broth take center stage
                rather than competing with a chewy noodle. The pairing is a Kyushu classic for good reason.
              </p>
            ),
            points: [
              { h3: 'Fast-cooking', text: 'Thin noodles cook in seconds, which is why Hakata shops cook them to order and serve them quickly.' },
              { h3: 'Stays firm', text: 'Their low-moisture dough holds a firm bite even in rich broth, especially when ordered “katame” (firm).' },
              { h3: 'Lets broth shine', text: 'A delicate strand keeps the focus on a creamy tonkotsu or clean shio broth rather than fighting it.' },
            ],
          },
          {
            h2: 'Ordering firmness — and kaedama',
            body: (
              <p>
                Hakata shops usually let you choose noodle firmness: futsuu (normal), katame (firm), or barikata
                (very firm) for the truly al dente. I order katame so the noodles stay perfect to the last bite.
                Because thin noodles are quick to soften, many shops offer kaedama — a fresh extra portion of
                noodles you add to your remaining broth when the first round is gone. It is the right way to
                finish a tonkotsu.
              </p>
            ),
          },
          {
            h2: 'Where to find thin-noodle bowls',
            body: (
              <p>
                Thin, straight noodles are the signature of Hakata-style tonkotsu, so the most reliable way to
                find them is to look for tonkotsu specialists. Stack the “Tonkotsu” filter, and check listings
                and photos for that classic straight-noodle look. Lighter shio and some shoyu bowls use thin
                noodles too, if you want the delicacy without the richness.
              </p>
            ),
          },
        ]}
        tipsHeading="My thin-noodle tips"
        tips={[
          'Stack the “Tonkotsu” filter — Hakata-style thin straight noodles are its signature.',
          'Order firmness to taste: katame (firm) or barikata (very firm) keeps the bite perfect.',
          'Order kaedama (an extra noodle portion) to finish your remaining broth.',
          'Eat promptly — thin noodles soften faster than thick ones.',
          'Want delicacy without the richness? Look for thin-noodle shio or shoyu bowls.',
        ]}
        faqs={[
          { q: 'What is thin noodle ramen?', a: 'It is ramen made with thin, firm, straight noodles — the signature of Hakata-style tonkotsu. They cook in seconds, stay firm in rich broth, and let the broth take center stage.' },
          { q: 'Why do thin noodles go with tonkotsu?', a: 'Thin, low-moisture noodles hold a firm bite even in thick, creamy tonkotsu and cook almost instantly, so they stay perfect while letting the rich broth shine. It is a Kyushu classic.' },
          { q: 'What does katame and barikata mean?', a: 'They are noodle firmness levels at Hakata shops: futsuu is normal, katame is firm, and barikata is very firm (extra al dente). Order the firmness you prefer.' },
          { q: 'What is kaedama?', a: 'Kaedama is an extra portion of fresh noodles you order to add to your leftover broth once the first round is gone — a Hakata tradition that suits fast-softening thin noodles.' },
          { q: 'How do I find thin noodle ramen near me?', a: 'Use the map above and stack the “Tonkotsu” filter, since thin straight noodles are its signature. Check listings and photos, or ask the shop about their noodle style.' },
        ]}
      />
    </main>
  )
}
