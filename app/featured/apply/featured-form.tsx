'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, Trash2, Loader2, Crown } from 'lucide-react'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

export default function FeaturedApplyForm() {
  const router = useRouter()

  const [form, setForm] = useState({
    restaurant_name: '',
    city: '',
    state_code: 'GA',
    address: '',
    phone: '',
    website: '',
    description: '',
  })
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [step, setStep] = useState<'form' | 'submitting' | 'redirecting'>('form')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    const remaining = 8 - photos.length
    const newFiles = Array.from(files).slice(0, remaining)
    setPhotos(prev => [...prev, ...newFiles])
    newFiles.forEach(f => {
      const url = URL.createObjectURL(f)
      setPreviews(prev => [...prev, url])
    })
  }

  function removePhoto(i: number) {
    setPhotos(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.restaurant_name || !form.city || !form.address) {
      setError('Please fill in all required fields.')
      return
    }

    setStep('submitting')

    try {
      // 1. Upload photos
      let photoUrls: string[] = []
      if (photos.length > 0) {
        const fd = new FormData()
        photos.forEach(f => fd.append('files', f))
        const up = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!up.ok) {
          const { error: upErr } = await up.json()
          throw new Error(upErr || 'Photo upload failed')
        }
        const { urls } = await up.json()
        photoUrls = urls
      }

      // 2. Create pending listing
      const res = await fetch('/api/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photos: photoUrls }),
      })
      if (!res.ok) {
        const { error: err } = await res.json()
        throw new Error(err || 'Failed to save listing')
      }
      const { listing } = await res.json()

      // 3. Create Stripe checkout session
      setStep('redirecting')
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listing.id }),
      })
      if (!checkoutRes.ok) {
        const { error: err } = await checkoutRes.json()
        throw new Error(err || 'Failed to create checkout')
      }
      const { url } = await checkoutRes.json()
      if (url) {
        window.location.href = url
      } else {
        // Stripe not configured — go to success with pending state
        router.push(`/featured/success?listing_id=${listing.id}`)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('form')
    }
  }

  const isSubmitting = step === 'submitting' || step === 'redirecting'

  return (
    <form onSubmit={handleSubmit} className="bg-[#1E2026] rounded-2xl border border-white/5 p-6 sm:p-8 space-y-6">
      {/* Restaurant info */}
      <div className="space-y-4">
        <h2 className="text-white font-semibold">Restaurant Information</h2>

        <div>
          <label className="block text-[#B0B3BB] text-xs font-medium mb-1.5">Restaurant Name *</label>
          <input
            type="text"
            value={form.restaurant_name}
            onChange={e => set('restaurant_name', e.target.value)}
            placeholder="e.g. Okiboru Tsukemen & Ramen"
            required
            className="w-full bg-[#2F323A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#B0B3BB]/40 outline-none focus:border-[#77567A]/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#B0B3BB] text-xs font-medium mb-1.5">City *</label>
            <input
              type="text"
              value={form.city}
              onChange={e => set('city', e.target.value)}
              placeholder="e.g. Atlanta"
              required
              className="w-full bg-[#2F323A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#B0B3BB]/40 outline-none focus:border-[#77567A]/50"
            />
          </div>
          <div>
            <label className="block text-[#B0B3BB] text-xs font-medium mb-1.5">State *</label>
            <select
              value={form.state_code}
              onChange={e => set('state_code', e.target.value)}
              className="w-full bg-[#2F323A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#77567A]/50"
            >
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[#B0B3BB] text-xs font-medium mb-1.5">Full Address *</label>
          <input
            type="text"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="e.g. 123 Main St, Atlanta, GA 30301"
            required
            className="w-full bg-[#2F323A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#B0B3BB]/40 outline-none focus:border-[#77567A]/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#B0B3BB] text-xs font-medium mb-1.5">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              placeholder="+1 (404) 000-0000"
              className="w-full bg-[#2F323A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#B0B3BB]/40 outline-none focus:border-[#77567A]/50"
            />
          </div>
          <div>
            <label className="block text-[#B0B3BB] text-xs font-medium mb-1.5">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={e => set('website', e.target.value)}
              placeholder="https://yourrestaurant.com"
              className="w-full bg-[#2F323A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#B0B3BB]/40 outline-none focus:border-[#77567A]/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#B0B3BB] text-xs font-medium mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Tell customers what makes your ramen special — signature broth, sourcing, atmosphere…"
            rows={4}
            maxLength={500}
            className="w-full bg-[#2F323A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-[#B0B3BB]/40 outline-none focus:border-[#77567A]/50 resize-none"
          />
          <p className="text-white/30 text-xs text-right mt-1">{form.description.length}/500</p>
        </div>
      </div>

      {/* Photo upload */}
      <div>
        <h2 className="text-white font-semibold mb-1">Restaurant Photos</h2>
        <p className="text-[#B0B3BB] text-xs mb-3">Upload up to 8 photos. First photo will be your main listing image.</p>

        <div className="grid grid-cols-4 gap-2">
          {previews.map((src, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#2F323A] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-[#1E2026] text-[10px] font-bold">Main</div>
              )}
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
          {photos.length < 8 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-[#77567A]/50 flex flex-col items-center justify-center gap-1.5 text-[#B0B3BB] hover:text-[#77567A] transition-colors"
            >
              <ImagePlus className="w-6 h-6" />
              <span className="text-xs">{photos.length === 0 ? 'Add Photos' : 'Add More'}</span>
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        <p className="text-white/30 text-xs mt-2">{photos.length}/8 photos added</p>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
      )}

      {/* Submit */}
      <div className="pt-2 border-t border-white/5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#1E2026] font-bold text-base rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><Loader2 className="w-5 h-5 animate-spin" />
              {step === 'redirecting' ? 'Redirecting to checkout…' : 'Saving…'}
            </>
          ) : (
            <><Crown className="w-5 h-5" /> Continue to Payment — $29.99/mo</>
          )}
        </button>
        <p className="text-white/30 text-xs text-center mt-3">
          Secure payment via Stripe. Cancel anytime from your account.
        </p>
      </div>
    </form>
  )
}
