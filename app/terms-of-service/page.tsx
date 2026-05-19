import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for RamenNearYou.com — the rules and guidelines for using our restaurant directory.',
  alternates: { canonical: 'https://www.ramennearyou.com/terms-of-service' },
}

export default function TermsOfServicePage() {
  const lastUpdated = 'May 19, 2026'

  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-[#B0B3BB] text-sm mb-12">Last updated: {lastUpdated}</p>

          <div className="space-y-10 text-[#B0B3BB] leading-relaxed">

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using RamenNearYou.com (&ldquo;the Site,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound
                by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use the Site.
                These Terms apply to all visitors, users, and anyone who accesses or uses the Site.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">2. Description of Service</h2>
              <p>
                RamenNearYou is an online directory of ramen restaurants across the United States. We provide
                information about ramen restaurants including location, ratings, hours, and menu information
                to help users find great ramen near them. We also offer restaurant owners the ability to claim
                and manage their listings, and offer featured listing opportunities.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">3. Accuracy of Restaurant Information</h2>
              <p>
                Restaurant information on the Site (including hours, menus, pricing, and contact details) is
                sourced from publicly available data and user submissions. We make reasonable efforts to keep
                this information accurate and up to date, but <strong className="text-white">we do not guarantee
                the accuracy, completeness, or timeliness of any restaurant information</strong>. Always confirm
                directly with the restaurant before visiting. RamenNearYou is not responsible for any
                inconvenience caused by outdated or incorrect information.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">4. User Accounts</h2>
              <p className="mb-3">
                Some features of the Site require you to create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide accurate and complete registration information.</li>
                <li>Maintain the security of your password.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
                <li>Be responsible for all activity that occurs under your account.</li>
              </ul>
              <p className="mt-3">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">5. Restaurant Listings &amp; Claims</h2>
              <p className="mb-3">
                Restaurant owners may claim their listing and submit updated information. By submitting a listing claim or update, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>You are authorized to represent the restaurant.</li>
                <li>All submitted information is accurate and truthful.</li>
                <li>You will keep information up to date.</li>
              </ul>
              <p className="mt-3">
                We reserve the right to approve, reject, or remove any listing or submitted content at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">6. Acceptable Use</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Use the Site for any unlawful purpose or in violation of any applicable laws.</li>
                <li>Submit false, misleading, or fraudulent information.</li>
                <li>Scrape, crawl, or harvest data from the Site without our written permission.</li>
                <li>Attempt to gain unauthorized access to any part of the Site or its infrastructure.</li>
                <li>Transmit viruses, malware, or other harmful code.</li>
                <li>Harass, abuse, or harm other users.</li>
                <li>Impersonate any person, business, or entity.</li>
                <li>Use the Site to send unsolicited communications (spam).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">7. Intellectual Property</h2>
              <p>
                All content on the Site — including text, graphics, logos, images, and software — is the property
                of RamenNearYou or its content suppliers and is protected by applicable intellectual property laws.
                You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
              <p className="mt-3">
                Restaurant names, logos, and photos remain the property of their respective owners. Their appearance
                on the Site does not imply endorsement of RamenNearYou.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">8. Third-Party Links &amp; Advertising</h2>
              <p>
                The Site may contain links to third-party websites and display advertisements from third-party
                advertising networks including Google AdSense. We are not responsible for the content, privacy
                practices, or terms of any third-party sites. The display of advertisements does not constitute
                endorsement of the advertiser or their products.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">9. Disclaimer of Warranties</h2>
              <p>
                THE SITE AND ALL CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, RAMENNEARYOU DISCLAIMS ALL
                WARRANTIES INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, OR
                FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">10. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, RAMENNEARYOU AND ITS OFFICERS, DIRECTORS, EMPLOYEES,
                AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE, INCLUDING BUT NOT LIMITED
                TO LOSS OF REVENUE, PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY SHALL NOT EXCEED $100.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">11. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless RamenNearYou and its affiliates, officers, agents,
                and employees from any claims, losses, damages, or expenses (including reasonable attorneys&apos; fees)
                arising from your use of the Site, your violation of these Terms, or your submission of any content.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States,
                without regard to conflict of law principles. Any disputes arising under these Terms shall be
                subject to the exclusive jurisdiction of the courts located in the United States.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will update the &ldquo;Last updated&rdquo; date
                when changes are made. Your continued use of the Site after any changes constitutes your
                acceptance of the new Terms. We encourage you to review these Terms periodically.
              </p>
            </section>

            <section>
              <h2 className="text-white text-xl font-semibold mb-3">14. Contact Us</h2>
              <p>
                If you have questions about these Terms, please contact us:
              </p>
              <div className="mt-3 p-4 bg-[#1E2026] rounded-xl border border-white/5 text-sm">
                <p className="text-white font-medium">RamenNearYou</p>
                <p>Email: <a href="mailto:legal@ramennearyou.com" className="text-[#77567A] hover:underline">legal@ramennearyou.com</a></p>
                <p>Website: <a href="https://www.ramennearyou.com/contact" className="text-[#77567A] hover:underline">www.ramennearyou.com/contact</a></p>
              </div>
            </section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
