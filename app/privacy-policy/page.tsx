import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for RamenNearYou.com — how we collect, use, and protect your information.',
  alternates: { canonical: 'https://www.ramennearyou.com/privacy-policy' },
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'May 19, 2026'

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-3">Privacy Policy</h1>
          <p className="text-[#6B6862] text-sm mb-12">Last updated: {lastUpdated}</p>

          <div className="prose prose-invert max-w-none space-y-10 text-[#6B6862] leading-relaxed">

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">1. Introduction</h2>
              <p>
                RamenNearYou (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website{' '}
                <a href="https://www.ramennearyou.com" className="text-[#96602F] hover:underline">
                  www.ramennearyou.com
                </a>{' '}
                (the &ldquo;Site&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our Site. Please read it carefully. By using the Site you agree to
                the practices described below.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">2. Information We Collect</h2>
              <h3 className="text-[#1E2026] text-base font-medium mt-4 mb-2">Information You Provide</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-[#1E2026]">Contact form:</strong> name, email address, and message when you submit our contact form.</li>
                <li><strong className="text-[#1E2026]">Account registration:</strong> email address and password when you create an account.</li>
                <li><strong className="text-[#1E2026]">Restaurant listings:</strong> business name, address, phone, and other details when you submit or claim a restaurant listing.</li>
                <li><strong className="text-[#1E2026]">Catering inquiries:</strong> contact details and event information submitted through our catering form.</li>
              </ul>

              <h3 className="text-[#1E2026] text-base font-medium mt-4 mb-2">Information Collected Automatically</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-[#1E2026]">Log data:</strong> IP address, browser type and version, pages visited, time and date of visits, time spent on pages, and referring URL.</li>
                <li><strong className="text-[#1E2026]">Device data:</strong> device type, operating system, and screen resolution.</li>
                <li><strong className="text-[#1E2026]">Cookies and similar technologies:</strong> see Section 4 below for full details.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Respond to contact inquiries and catering requests.</li>
                <li>Provide, operate, and improve the restaurant directory.</li>
                <li>Create and manage user accounts.</li>
                <li>Process and review restaurant listing submissions and claims.</li>
                <li>Analyze site traffic and user behavior to improve our services (via Google Analytics).</li>
                <li>Display relevant advertisements on the Site (via Google AdSense).</li>
                <li>Send newsletters if you have subscribed (you may unsubscribe at any time).</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">4. Cookies &amp; Tracking Technologies</h2>
              <p className="mb-3">
                We use cookies and similar tracking technologies to operate the Site and serve relevant advertisements.
                A cookie is a small file stored on your device. You can instruct your browser to refuse all cookies or
                to indicate when a cookie is being sent, but some features of the Site may not function properly without them.
              </p>

              <h3 className="text-[#1E2026] text-base font-medium mt-4 mb-2">Types of Cookies We Use</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[#1E2026] text-sm font-medium">Essential / Session Cookies</p>
                  <p className="text-sm">Required for authentication and core site functionality (e.g., keeping you logged in). Set by our authentication provider, Supabase.</p>
                </div>
                <div>
                  <p className="text-[#1E2026] text-sm font-medium">Analytics Cookies</p>
                  <p className="text-sm">
                    We use <strong className="text-[#1E2026]">Google Analytics</strong> (GA4) to understand how visitors interact with our Site.
                    Google Analytics sets cookies that collect information such as the number of visitors, pages visited, and traffic sources.
                    This information helps us improve the Site. Google&apos;s use of this data is governed by the{' '}
                    <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">
                      Google Privacy Policy
                    </a>
                    . You can opt out of Google Analytics by installing the{' '}
                    <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">
                      Google Analytics Opt-out Browser Add-on
                    </a>
                    .
                  </p>
                </div>
                <div>
                  <p className="text-[#1E2026] text-sm font-medium">Advertising Cookies</p>
                  <p className="text-sm">
                    We use <strong className="text-[#1E2026]">Google AdSense</strong> to display advertisements on our Site.
                    Google AdSense and its partners use cookies (including the DoubleClick cookie) to serve ads based on
                    your prior visits to this website or other websites. These cookies allow Google and its partners to
                    serve ads based on your interests. You can opt out of personalized advertising by visiting{' '}
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">
                      Google Ads Settings
                    </a>
                    {' '}or by visiting{' '}
                    <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">
                      www.aboutads.info
                    </a>
                    . You can also opt out through the{' '}
                    <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">
                      Network Advertising Initiative opt-out page
                    </a>
                    .
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">5. Third-Party Services</h2>
              <p className="mb-3">We share information with the following third-party service providers as necessary to operate our Site:</p>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <span className="text-[#1E2026] font-medium min-w-[140px]">Google Analytics</span>
                  <span>Site analytics and traffic measurement. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">Privacy Policy</a></span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#1E2026] font-medium min-w-[140px]">Google AdSense</span>
                  <span>Display advertising. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">Privacy Policy</a></span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#1E2026] font-medium min-w-[140px]">Supabase</span>
                  <span>Authentication and database. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">Privacy Policy</a></span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#1E2026] font-medium min-w-[140px]">Stripe</span>
                  <span>Payment processing for featured listings. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">Privacy Policy</a></span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#1E2026] font-medium min-w-[140px]">Vercel</span>
                  <span>Website hosting and infrastructure. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">Privacy Policy</a></span>
                </div>
              </div>
              <p className="mt-3 text-sm">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">6. Data Retention</h2>
              <p>
                We retain personal data for as long as necessary to provide our services and comply with legal
                obligations. Contact form submissions are retained for up to 2 years. Account data is retained
                until you delete your account. Analytics data is retained per Google&apos;s standard retention settings (26 months).
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">7. Your Rights</h2>
              <p className="mb-3">
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong className="text-[#1E2026]">Access:</strong> request a copy of the personal data we hold about you.</li>
                <li><strong className="text-[#1E2026]">Correction:</strong> request that we correct inaccurate or incomplete data.</li>
                <li><strong className="text-[#1E2026]">Deletion:</strong> request deletion of your personal data (&ldquo;right to be forgotten&rdquo;).</li>
                <li><strong className="text-[#1E2026]">Objection:</strong> object to our processing of your data for direct marketing or analytics.</li>
                <li><strong className="text-[#1E2026]">Portability:</strong> receive your data in a structured, machine-readable format.</li>
                <li><strong className="text-[#1E2026]">Opt-out of personalized ads:</strong> visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#96602F] hover:underline">Google Ads Settings</a>.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, contact us at{' '}
                <a href="mailto:privacy@ramennearyou.com" className="text-[#96602F] hover:underline">
                  privacy@ramennearyou.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">8. Children&apos;s Privacy</h2>
              <p>
                Our Site is not directed to children under the age of 13. We do not knowingly collect personal
                information from children under 13. If you believe we have inadvertently collected such information,
                please contact us immediately and we will delete it.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">9. Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information, including
                SSL/TLS encryption for data in transit, hashed passwords, and access controls. However, no method
                of transmission over the internet is 100% secure and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes
                by updating the &ldquo;Last updated&rdquo; date at the top of this page. Your continued use of the Site after
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-[#1E2026] text-xl font-semibold mb-3">11. Contact Us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy, please contact us:
              </p>
              <div className="mt-3 p-4 bg-[#F5F4F0] rounded-xl border border-black/5 text-sm">
                <p className="text-[#1E2026] font-medium">RamenNearYou</p>
                <p>Email: <a href="mailto:privacy@ramennearyou.com" className="text-[#96602F] hover:underline">privacy@ramennearyou.com</a></p>
                <p>Website: <a href="https://www.ramennearyou.com/contact" className="text-[#96602F] hover:underline">www.ramennearyou.com/contact</a></p>
              </div>
            </section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
