'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MessageSquare, Building2, HelpCircle } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'

const subjects = [
  'General inquiry',
  'List my restaurant',
  'Claim or update a listing',
  'Catering inquiry',
  'Report incorrect information',
  'Press & partnerships',
  'Other',
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-[#ffffff]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative w-full max-w-xl mx-auto h-40 sm:h-48 rounded-2xl overflow-hidden mb-8">
          <RestaurantImage src={pickStockPhoto('contact')} alt="A bowl of ramen" fill className="object-cover" sizes="576px" priority />
        </div>
        <p className="text-[#B57F50] text-xs font-medium uppercase tracking-widest mb-3">Get in Touch</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2026] mb-4">Contact Us</h1>
        <p className="text-[#6B6862] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Questions, listing requests, or partnership inquiries — we&apos;d love to hear from you.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Info cards */}
          <div className="space-y-4">
            <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-[#B57F50]/15 flex items-center justify-center mb-3">
                <Mail className="w-4 h-4 text-[#B57F50]" />
              </div>
              <h3 className="font-semibold text-[#1E2026] text-sm mb-1">Email Us Directly</h3>
              <p className="text-[#6B6862] text-xs leading-relaxed">
                Reach our team directly for any inquiries.
              </p>
              <a href="mailto:hello@ramennearyououtreach.com" className="inline-block mt-3 text-xs text-[#B57F50] hover:underline">
                hello@ramennearyououtreach.com
              </a>
            </div>

            <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-[#B57F50]/15 flex items-center justify-center mb-3">
                <Building2 className="w-4 h-4 text-[#B57F50]" />
              </div>
              <h3 className="font-semibold text-[#1E2026] text-sm mb-1">List Your Restaurant</h3>
              <p className="text-[#6B6862] text-xs leading-relaxed">
                Own a ramen restaurant? Get listed and reach hungry customers searching near you.
              </p>
              <Link href="/list" className="inline-block mt-3 text-xs text-[#B57F50] hover:underline">
                Submit your listing →
              </Link>
            </div>

            <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-[#B57F50]/15 flex items-center justify-center mb-3">
                <MessageSquare className="w-4 h-4 text-[#B57F50]" />
              </div>
              <h3 className="font-semibold text-[#1E2026] text-sm mb-1">Catering Requests</h3>
              <p className="text-[#6B6862] text-xs leading-relaxed">
                Need ramen catering for an event? Request a free quote with no commitment.
              </p>
              <Link href="/catering" className="inline-block mt-3 text-xs text-[#B57F50] hover:underline">
                Request catering →
              </Link>
            </div>

            <div className="bg-[#F5F4F0] border border-black/5 rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg bg-[#B57F50]/15 flex items-center justify-center mb-3">
                <HelpCircle className="w-4 h-4 text-[#B57F50]" />
              </div>
              <h3 className="font-semibold text-[#1E2026] text-sm mb-1">Ramen Questions</h3>
              <p className="text-[#6B6862] text-xs leading-relaxed">
                Curious about broth types, toppings, or ordering tips?
              </p>
              <Link href="/faq" className="inline-block mt-3 text-xs text-[#B57F50] hover:underline">
                Read the FAQ →
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-[#F5F4F0] border border-black/5 rounded-2xl p-6 sm:p-8">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#1E2026]">Message sent!</h2>
                <p className="text-[#6B6862] text-sm max-w-xs">
                  Thanks for reaching out. We&apos;ll get back to you as soon as we can.
                </p>
                <button
                  onClick={() => { setStatus('idle'); setName(''); setEmail(''); setSubject(''); setMessage('') }}
                  className="mt-2 text-sm text-[#B57F50] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-serif text-xl font-bold text-[#1E2026] mb-1">Send a message</h2>
                <p className="text-[#6B6862] text-sm mb-6">We typically respond within 1–2 business days.</p>

                {status === 'error' && (
                  <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    Something went wrong. Please try again.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#6B6862] mb-1.5">Name <span className="text-[#B57F50]">*</span></label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6B6862] mb-1.5">Email <span className="text-[#B57F50]">*</span></label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#6B6862] mb-1.5">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors appearance-none"
                  >
                    <option value="">Select a subject…</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#6B6862] mb-1.5">Message <span className="text-[#B57F50]">*</span></label>
                  <textarea
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 bg-[#ffffff] border border-black/8 rounded-lg text-[#1E2026] placeholder-[#9B9490]/50 text-sm outline-none focus:border-[#B57F50] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3 bg-[#B57F50] hover:bg-[#c8934f] text-white text-sm font-semibold rounded-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
