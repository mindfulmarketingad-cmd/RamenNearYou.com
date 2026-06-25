import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for RamenNearYou.com — important information about the accuracy and use of content on our ramen restaurant directory.',
  alternates: { canonical: 'https://www.ramennearyou.com/disclaimer' },
}

export default function DisclaimerPage() {
  const lastUpdated = 'June 25, 2026'

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">Disclaimer</h1>
          <p className="text-[#6B6862] text-sm mb-12">Last updated: {lastUpdated}</p>

          <div className="prose prose-invert max-w-none space-y-10 text-[#6B6862] leading-relaxed">

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">1. General Information</h2>
              <p>
                The information provided by RamenNearYou (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) on{' '}
                <a href="https://www.ramennearyou.com" className="text-[#B57F50] hover:underline">
                  www.ramennearyou.com
                </a>{' '}
                (the &ldquo;Site&rdquo;) is for general informational purposes only. All information on the Site is
                provided in good faith; however, we make no representation or warranty of any kind, express or
                implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of
                any information on the Site.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">2. Restaurant Listings &amp; Information</h2>
              <p className="mb-3">
                RamenNearYou is a directory of ramen restaurants. Restaurant details — including names, addresses,
                phone numbers, hours, menus, prices, ratings, and photos — are aggregated from third-party sources
                and may change without notice. We do not own, operate, endorse, or guarantee any of the
                restaurants listed on the Site.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Hours of operation may be inaccurate or out of date — always confirm directly with the restaurant before visiting.</li>
                <li>Menus, prices, and availability are subject to change at the restaurant&apos;s discretion.</li>
                <li>Ratings and reviews reflect third-party data and individual opinions, not our endorsement.</li>
                <li>The inclusion of a restaurant does not imply any affiliation, sponsorship, or recommendation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">3. No Professional Advice</h2>
              <p>
                The Site does not constitute professional advice of any kind. Information regarding ingredients,
                allergens, and dietary suitability (such as vegan, vegetarian, or gluten-free options) is not
                guaranteed. If you have a food allergy or dietary restriction, always verify directly with the
                restaurant. We are not responsible for any reaction or harm resulting from food consumed at a
                listed establishment.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">4. External Links Disclaimer</h2>
              <p>
                The Site may contain links to external websites that are not provided or maintained by us. We do
                not guarantee the accuracy, relevance, timeliness, or completeness of any information on these
                external websites and are not responsible for their content or practices.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">5. Affiliate &amp; Advertising Disclaimer</h2>
              <p>
                The Site may display advertisements and contain affiliate links, meaning we may earn a commission
                if you click a link or make a purchase, at no additional cost to you. Advertisements served through
                third-party networks such as Google AdSense are not endorsements of the advertised products or
                services.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">6. Limitation of Liability</h2>
              <p>
                Under no circumstance shall we be liable to you for any loss or damage of any kind incurred as a
                result of the use of the Site or reliance on any information provided on the Site. Your use of the
                Site and your reliance on any information is solely at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">7. Changes to This Disclaimer</h2>
              <p>
                We may update this Disclaimer from time to time. We will notify you of any changes by updating the
                &ldquo;Last updated&rdquo; date at the top of this page. Your continued use of the Site after changes
                constitutes acceptance of the updated Disclaimer.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">8. Contact Us</h2>
              <p>
                If you have questions about this Disclaimer, please contact us:
              </p>
              <div className="mt-3 p-4 bg-[#F5F4F0] rounded-xl border border-black/5 text-sm">
                <p className="text-[#1E2026] font-medium">RamenNearYou</p>
                <p>Email: <a href="mailto:hello@ramennearyou.com" className="text-[#B57F50] hover:underline">hello@ramennearyou.com</a></p>
                <p>Website: <a href="https://www.ramennearyou.com/contact" className="text-[#B57F50] hover:underline">www.ramennearyou.com/contact</a></p>
              </div>
            </section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
