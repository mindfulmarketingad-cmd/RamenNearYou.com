import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CateringForm from './catering-form'

export const metadata: Metadata = {
  title: 'Ramen Catering for Events',
  description: 'Need ramen catering for your event? Tell us your details and we\'ll personally match you with the best ramen caterers in your city — free, no commitment.',
}

export default function CateringPage() {
  return (
    <main className="min-h-screen bg-[#2F323A]">
      <Navbar />
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#77567A] text-xs font-medium uppercase tracking-widest mb-3">Event Catering</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">
            Get Ramen Catering Quotes
          </h1>
          <p className="text-[#B0B3BB] leading-relaxed mb-8">
            Tell us about your event and we&apos;ll personally match you with the best ramen caterers available in your area — free, no commitment.
          </p>
          <CateringForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
