'use client'

import { useState, FormEvent } from 'react'
import RestaurantImage from '@/components/restaurant-image'
import { pickStockPhoto } from '@/lib/stock-photos'
import { sendViaMail } from '@/lib/mailto'

const inputClass =
  'w-full px-4 py-3 bg-sunken border border-line/8 rounded-lg text-ink text-sm outline-none focus:border-brand transition-colors'

export default function AmbassadorBody() {
  const [submitted, setSubmitted] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [instagram, setInstagram] = useState('')
  const [whyApply, setWhyApply] = useState('')
  const [experience, setExperience] = useState('')

  // No backend: the application opens in the visitor's own mail app.
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    sendViaMail(`City Ambassador application: ${city}`, [
      ['Name', name], ['Email', email], ['City', city], ['Instagram', instagram],
      ['Why I want to apply', whyApply], ['Experience', experience],
    ])
    setSubmitted(true)
  }

  return (
    <main className="flex-1 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-8">
            <RestaurantImage src={pickStockPhoto('ambassador')} alt="A bowl of ramen" fill className="object-cover" sizes="672px" priority />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink mb-4">
            Become a City Ambassador
          </h1>
          <p className="text-ink-soft text-base leading-relaxed">
            Represent your city&apos;s ramen scene. Help us surface the best bowls, write reviews,
            and grow the RamenNearYou community.
          </p>
        </div>

        {submitted ? (
          <div className="bg-sunken border border-brand/30 rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-brand-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-bold text-ink mb-2">Almost done</h2>
            <p className="text-ink-soft text-sm">
              Your email app should open with your application filled in &mdash; hit send there
              and we&apos;ll get back to you within 3&ndash;5 business days.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-sunken border border-line/8 rounded-xl p-6 sm:p-8 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="amb-name" className="text-ink text-sm font-medium">Full Name</label>
                <input
                  id="amb-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="amb-email" className="text-ink text-sm font-medium">Email</label>
                <input
                  id="amb-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="amb-city" className="text-ink text-sm font-medium">Your City</label>
                <input
                  id="amb-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Los Angeles, CA"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="amb-instagram" className="text-ink text-sm font-medium">
                  Instagram Handle{' '}
                  <span className="text-ink-soft font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft text-sm select-none">
                    @
                  </span>
                  <input
                    id="amb-instagram"
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="yourhandle"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="amb-why" className="text-ink text-sm font-medium">
                Why do you want to be an ambassador?
              </label>
              <textarea
                id="amb-why"
                required
                rows={4}
                value={whyApply}
                onChange={(e) => setWhyApply(e.target.value)}
                placeholder="Tell us what drives your passion for ramen and your local community..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="amb-experience" className="text-ink text-sm font-medium">Describe your ramen experience</label>
              <textarea
                id="amb-experience"
                required
                rows={4}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="How long have you been eating ramen? Do you have favorites in your city? Have you written reviews before?"
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-none bg-brand text-white text-sm font-medium hover:bg-brand-hi transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Submit Application
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
