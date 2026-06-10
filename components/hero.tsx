'use client'

import { useState } from 'react'
import { Utensils } from 'lucide-react'
import Image from 'next/image'
import RamenQuiz from '@/components/ramen-quiz'

interface Props {
  restaurantCount: number
  cityCount: number
  stateCount: number
}

export default function Hero({ restaurantCount, cityCount, stateCount }: Props) {
  const [quizOpen, setQuizOpen] = useState(false)

  return (
    <section className="relative z-30 h-[460px] sm:h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero-ramen-bowl.jpg"
        alt="A beautiful bowl of ramen"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-2xl mx-auto px-4 sm:px-6 text-center pt-16">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
          Find Ramen Near Me
        </h1>
        <p className="text-white/85 text-base sm:text-lg mb-7 max-w-md mx-auto drop-shadow">
          Answer a few quick questions and we’ll match you with the perfect bowl nearby.
        </p>

        {/* Order Ramen Now CTA */}
        <button
          onClick={() => setQuizOpen(true)}
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-base sm:text-lg font-bold shadow-xl shadow-black/30 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Utensils className="w-5 h-5" />
          Order Ramen Now
        </button>

        <p className="text-white/70 text-xs mt-5 drop-shadow">
          {restaurantCount.toLocaleString()}+ ramen spots · {cityCount.toLocaleString()} cities · {stateCount} states
        </p>
      </div>

      {/* Wave separator at bottom — fill matches the section below */}
      <div className="absolute bottom-0 left-0 right-0 z-10 leading-none pointer-events-none" style={{ marginBottom: '-2px' }}>
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 block"
        >
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="#F5F4F0"
          />
        </svg>
      </div>

      {/* Quiz overlay */}
      {quizOpen && <RamenQuiz onClose={() => setQuizOpen(false)} />}
    </section>
  )
}
