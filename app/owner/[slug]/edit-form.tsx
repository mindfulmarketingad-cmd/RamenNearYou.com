'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

interface Props {
  slug: string
  restaurantName: string
  initial: {
    description: string
    phone: string
    website: string
    menu_link: string
    hours: Record<string, string[] | string>
  }
}

function hoursToString(slots: string[] | string | undefined): string {
  if (!slots) return ''
  if (typeof slots === 'string') return slots
  if (Array.isArray(slots)) {
    if (slots[0] === 'Closed') return 'Closed'
    return slots.join(' · ')
  }
  return ''
}

function stringToSlots(s: string): string[] {
  const trimmed = s.trim()
  if (!trimmed) return []
  if (trimmed.toLowerCase() === 'closed') return ['Closed']
  return trimmed.split(/\s*[·,|]\s*/).filter(Boolean)
}

export default function OwnerEditForm({ slug, restaurantName, initial }: Props) {
  const initHours: Record<string, string> = Object.fromEntries(
    DAY_ORDER.map(d => [d, hoursToString(initial.hours[d])])
  )

  const [description, setDescription] = useState(initial.description)
  const [phone, setPhone] = useState(initial.phone)
  const [website, setWebsite] = useState(initial.website)
  const [menuLink, setMenuLink] = useState(initial.menu_link)
  const [hours, setHours] = useState<Record<string, string>>(initHours)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    const hoursPayload: Record<string, string[]> = {}
    for (const day of DAY_ORDER) {
      const slots = stringToSlots(hours[day] ?? '')
      if (slots.length > 0) hoursPayload[day] = slots
    }

    try {
      const res = await fetch('/api/owner/restaurant', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          restaurant_name: restaurantName,
          description: description.trim(),
          phone: phone.trim(),
          website: website.trim(),
          menu_link: menuLink.trim(),
          hours: hoursPayload,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to save')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>
      )}
      {saved && (
        <div className="px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Saved. Your listing has been updated.
        </div>
      )}

      <div className="bg-[#1E2026] rounded-xl border border-white/5 p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-white">Listing Content</h2>

        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Tell customers what makes your ramen special…"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-sky-500 transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 555-123-4567"
              className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Website</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://yourrestaurant.com"
              className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#B0B3BB] mb-1.5 uppercase tracking-wide">Menu Link</label>
          <input
            type="url"
            value={menuLink}
            onChange={e => setMenuLink(e.target.value)}
            placeholder="https://yourrestaurant.com/menu"
            className="w-full px-4 py-3 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/60 text-sm outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-[#1E2026] rounded-xl border border-white/5 p-6 space-y-3">
        <h2 className="font-serif text-lg font-bold text-white">Business Hours</h2>
        <p className="text-[#B0B3BB] text-xs">Format: <span className="text-white">11AM-10PM</span> or use <span className="text-white">Closed</span>. Separate multiple shifts with <span className="text-white">·</span></p>
        <div className="space-y-2 pt-1">
          {DAY_ORDER.map(day => (
            <div key={day} className="flex items-center gap-3">
              <span className="text-[#B0B3BB] text-sm w-24 flex-shrink-0">{day}</span>
              <input
                value={hours[day]}
                onChange={e => setHours(prev => ({ ...prev, [day]: e.target.value }))}
                placeholder="11AM-10PM"
                className="flex-1 px-3 py-2 bg-[#2F323A] border border-white/10 rounded-lg text-white placeholder-[#B0B3BB]/40 text-sm outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full px-4 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
