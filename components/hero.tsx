'use client'

import { useState } from 'react'
import { Utensils, ChefHat } from 'lucide-react'
import Image from 'next/image'
import RamenQuiz from '@/components/ramen-quiz'
import CateringQuiz from '@/components/catering-quiz'

interface Props {
  restaurantCount: number
  cityCount: number
  stateCount: number
}

export default function Hero({ restaurantCount, cityCount, stateCount }: Props) {
  const [quizOpen, setQuizOpen] = useState(false)
  const [cateringOpen, setCateringOpen] = useState(false)

  return (
    <>
      {/* Fixed parallax backdrop — stays in place while the page scrolls over it */}
      <div className="fixed inset-x-0 top-0 z-0 h-[460px] sm:h-[500px] overflow-hidden">
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
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 text-center pt-16">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">
              Find Ramen Near Me
            </h1>

            {/* Primary CTA */}
            <button
              onClick={() => setQuizOpen(true)}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#B57F50] hover:bg-[#c8934f] text-white text-base sm:text-lg font-bold shadow-xl shadow-black/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Utensils className="w-5 h-5" />
              Order Ramen Now
            </button>

            {/* Secondary catering CTA */}
            <div className="mt-3">
              <button
                onClick={() => setCateringOpen(true)}
                className="inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium transition-colors group"
              >
                <ChefHat className="w-4 h-4 text-[#B57F50] group-hover:text-white transition-colors" />
                Order Catering
              </button>
            </div>

            <p className="text-white/70 text-xs mt-4 drop-shadow">
              {restaurantCount.toLocaleString()}+ ramen spots · {cityCount.toLocaleString()} cities · {stateCount} states
            </p>
          </div>
        </div>
      </div>

      {/* In-flow spacer reserving the hero's height in the layout */}
      <div aria-hidden className="h-[460px] sm:h-[500px]" />

      {/* Overlays */}
      {quizOpen && <RamenQuiz onClose={() => setQuizOpen(false)} />}
      {cateringOpen && <CateringQuiz onClose={() => setCateringOpen(false)} />}
    </>
  )
}
