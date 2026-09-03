import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import ContactForm from './contact-form'

// Navbar and Footer are server components that read the (large) restaurants
// dataset server-side only. Keeping this file a server component — and the
// interactive form in its own 'use client' file — stops that dataset from
// being pulled into this page's client bundle, which is what happens when a
// 'use client' page imports Navbar/Footer directly.
export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />
      <ContactForm />
      <Footer />
    </main>
  )
}
