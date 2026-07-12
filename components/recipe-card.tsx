'use client'

import { useState } from 'react'
import { Star, Printer, Clock, Users } from 'lucide-react'
import RestaurantImage from '@/components/restaurant-image'
import type { Recipe } from '@/lib/recipes'

const SCALE_OPTIONS = [
  { label: '1/2x', factor: 0.5 },
  { label: '1x', factor: 1 },
  { label: '2x', factor: 2 },
] as const

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.63 7.86 6.35 9.32-.09-.79-.16-2.01.03-2.87.18-.78 1.16-4.97 1.16-4.97s-.3-.6-.3-1.48c0-1.39.8-2.42 1.8-2.42.85 0 1.26.64 1.26 1.4 0 .85-.55 2.13-.83 3.31-.24 1 .5 1.81 1.48 1.81 1.78 0 3.15-1.87 3.15-4.58 0-2.39-1.72-4.07-4.18-4.07-2.85 0-4.52 2.13-4.52 4.34 0 .86.33 1.78.75 2.28a.3.3 0 0 1 .07.29c-.08.32-.25 1-.29 1.14-.05.19-.15.23-.35.14-1.3-.61-2.12-2.5-2.12-4.03 0-3.28 2.38-6.29 6.87-6.29 3.6 0 6.4 2.57 6.4 6 0 3.58-2.26 6.46-5.4 6.46-1.05 0-2.05-.55-2.38-1.19l-.65 2.47c-.24.9-.87 2.04-1.3 2.73.98.3 2.02.47 3.1.47 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>
  )
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.4
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i <= full ? 'text-amber-400 fill-amber-400' : i === full + 1 && half ? 'text-amber-400 fill-amber-400/50' : 'text-white/25'
          }`}
        />
      ))}
    </span>
  )
}

// Converts a scaled decimal into a friendly fraction string, e.g. 1.5 -> "1½".
function toFraction(n: number): string {
  const whole = Math.floor(n)
  const frac = n - whole
  const map: [number, string][] = [
    [0.125, '⅛'], [0.25, '¼'], [0.333, '⅓'], [0.375, '⅜'], [0.5, '½'],
    [0.625, '⅝'], [0.667, '⅔'], [0.75, '¾'], [0.875, '⅞'],
  ]
  if (frac < 0.05) return String(whole)
  const match = map.find(([v]) => Math.abs(v - frac) < 0.03)
  const fracStr = match ? match[1] : `.${Math.round(frac * 100)}`
  return whole > 0 ? `${whole}${fracStr}` : fracStr
}

function scaleAmount(raw: string, factor: number): string {
  const num = parseFloat(raw)
  if (isNaN(num)) return raw
  return toFraction(num * factor)
}

export default function RecipeCard({ recipe, pageUrl }: { recipe: Recipe; pageUrl: string }) {
  const [scale, setScale] = useState<number>(1)
  const [units, setUnits] = useState<'us' | 'metric'>('us')
  const [checked, setChecked] = useState<Set<number>>(new Set())

  function toggleChecked(i: number) {
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const imageUrl = recipe.image.startsWith('http') ? recipe.image : `https://www.ramennearyou.com${recipe.image}`
  const pinUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(recipe.cardTitle)}`
  const scaledServings = toFraction(recipe.baseServings * scale)

  return (
    <div id="recipe-card" className="rounded-2xl overflow-hidden border border-black/10 shadow-sm bg-white max-w-2xl mx-auto print:shadow-none print:border-black/20">
      {/* Header */}
      <div className="relative bg-[#1E2026] pt-16 pb-8 px-6 text-center">
        <div className="absolute left-6 top-4 flex flex-col gap-1">
          <span className="block w-1 h-5 bg-[#B57F50] rounded-full" />
        </div>
        <div className="absolute left-24 sm:left-32 top-8 w-1.5 h-1.5 bg-amber-400 rounded-full" />

        <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-28 h-28 rounded-full overflow-hidden border-4 border-[#1E2026] shadow-lg bg-[#F5F4F0]">
          <RestaurantImage src={recipe.image} alt={recipe.cardTitle} fill className="object-cover" sizes="112px" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-16 mb-3">{recipe.cardTitle}</h2>

        <div className="flex items-center justify-center gap-2 mb-1">
          <StarRating rating={recipe.rating} />
        </div>
        <p className="text-white/70 text-xs">{recipe.rating.toFixed(1)} from {recipe.reviewCount.toLocaleString()} reviews</p>

        <div className="flex items-center justify-center gap-6 mt-5 pt-5 border-t border-white/15 text-xs text-white/80">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#96602F]" />
            <span className="font-semibold">Total Time:</span> {recipe.totalTime}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#96602F]" />
            <span className="font-semibold">Yield:</span> makes {scaledServings} {recipe.servingsLabel}
            <span className="ml-1 px-1.5 py-0.5 rounded border border-white/25 text-[10px] font-bold">{scale}x</span>
          </span>
        </div>
      </div>

      {/* Print / Pin */}
      <div className="grid grid-cols-2 gap-3 p-5 border-b border-black/8 print:hidden">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#F5F4F0] hover:bg-[#eae9e5] text-[#1E2026] text-sm font-semibold transition-colors"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
        <a
          href={pinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#F5F4F0] hover:bg-[#eae9e5] text-[#1E2026] text-sm font-semibold transition-colors"
        >
          <PinterestIcon className="w-4 h-4 text-[#E60023]" /> Pin
        </a>
      </div>

      {/* Description */}
      <div className="px-6 py-5 border-b border-black/8">
        <p className="text-[#4B4845] text-sm leading-relaxed">{recipe.description}</p>
      </div>

      {/* Ingredients */}
      <div className="px-6 py-5 border-b border-black/8">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h3 className="font-serif text-lg font-bold text-[#1E2026]">Ingredients</h3>
          <div className="flex items-center gap-3 print:hidden">
            <div className="flex items-center rounded-full border border-black/12 overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setUnits('us')}
                className={`px-3 py-1.5 transition-colors ${units === 'us' ? 'bg-[#1E2026] text-white' : 'bg-white text-[#6B6862] hover:bg-black/5'}`}
              >
                US
              </button>
              <button
                onClick={() => setUnits('metric')}
                className={`px-3 py-1.5 transition-colors ${units === 'metric' ? 'bg-[#1E2026] text-white' : 'bg-white text-[#6B6862] hover:bg-black/5'}`}
              >
                Metric
              </button>
            </div>
            <div className="flex items-center rounded-full border border-black/12 overflow-hidden text-xs font-semibold">
              {SCALE_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => setScale(opt.factor)}
                  className={`px-3 py-1.5 transition-colors ${scale === opt.factor ? 'bg-[#B57F50] text-white' : 'bg-white text-[#6B6862] hover:bg-black/5'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="space-y-2.5">
          {recipe.ingredients.map((ing, i) => {
            const amount = units === 'us' ? ing.amount : (ing.metricAmount ?? ing.amount)
            const unit = units === 'us' ? ing.unit : (ing.metricUnit ?? ing.unit)
            const displayAmount = scaleAmount(amount, scale)
            return (
              <li key={i} className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={checked.has(i)}
                  onChange={() => toggleChecked(i)}
                  className="mt-0.5 w-4 h-4 shrink-0 accent-[#B57F50] print:hidden"
                />
                <span className={`leading-snug ${checked.has(i) ? 'line-through text-[#6B6862]' : 'text-[#1E2026]'}`}>
                  {displayAmount && <strong>{displayAmount} </strong>}
                  {unit && <strong>{unit} </strong>}
                  {ing.item}
                  {ing.note && <span className="italic text-[#6B6862]"> ({ing.note})</span>}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Instructions */}
      <div className="px-6 py-5 border-b border-black/8">
        <h3 className="font-serif text-lg font-bold text-[#1E2026] mb-4">Instructions</h3>
        <ol className="space-y-3.5">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-[#1E2026] leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#B57F50]/15 text-[#96602F] text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span>{step.text}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Nutrition facts */}
      <div className="px-6 py-5">
        <h3 className="font-serif text-lg font-bold text-[#1E2026] mb-3">Nutrition Facts</h3>
        <div className="rounded-xl border-2 border-[#1E2026] overflow-hidden">
          <p className="px-4 py-2 bg-[#1E2026] text-white text-xs font-bold uppercase tracking-wide">Per Serving</p>
          <div className="px-4 py-3 flex items-baseline justify-between border-b border-black/10">
            <span className="font-bold text-[#1E2026]">Calories</span>
            <span className="font-bold text-2xl text-[#1E2026]">{recipe.nutrition.calories}</span>
          </div>
          <div className="divide-y divide-black/8">
            {[
              ['Protein', recipe.nutrition.protein],
              ['Carbohydrates', recipe.nutrition.carbs],
              ['Fat', recipe.nutrition.fat],
              ['Fiber', recipe.nutrition.fiber],
              ['Sugar', recipe.nutrition.sugar],
              ['Sodium', recipe.nutrition.sodium],
            ].map(([label, value]) => (
              <div key={label} className="px-4 py-2 flex items-center justify-between text-sm">
                <span className="text-[#4B4845]">{label}</span>
                <span className="font-semibold text-[#1E2026]">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-[#6B6862] mt-2">Nutrition is an estimate and will vary based on the exact ingredients and brands used.</p>
      </div>
    </div>
  )
}
