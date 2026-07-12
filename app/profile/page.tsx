'use client'

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Camera, Heart, CheckCircle2, MapPin, BadgeCheck } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/client'
import { getSavedSlugs } from '@/lib/saves'
import { getVisitedSlugs } from '@/lib/visits'
import SavedSection from './saved-section'
import CitiesSection from './cities-section'
import type { User } from '@supabase/supabase-js'

const inputClass =
  'w-full px-4 py-3 bg-[#F5F4F0] border border-black/8 rounded-lg text-[#1E2026] text-sm outline-none focus:border-[#B57F50] transition-colors'

const brothOptions = ['Tonkotsu', 'Miso', 'Shoyu', 'Shio', 'Tsukemen', 'Chicken', 'All of them!']

interface Profile {
  display_name?: string
  bio?: string
  avatar_url?: string
  instagram?: string
  tiktok?: string
  twitter?: string
  favorite_broth?: string
  ramen_count?: number
}

function formatMemberSince(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<User | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [, setProfile] = useState<Profile | null>(null)
  const [savesCount, setSavesCount] = useState<number | null>(null)
  const [visitsCount, setVisitsCount] = useState<number | null>(null)
  const [followsCount, setFollowsCount] = useState<number | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [instagram, setInstagram] = useState('')
  const [tiktok, setTiktok] = useState('')
  const [twitter, setTwitter] = useState('')
  const [favoriteBroth, setFavoriteBroth] = useState('')
  const [ramenCount, setRamenCount] = useState<number | ''>('')

  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user
      setUser(u)
      setAuthChecked(true)
      if (!u) {
        router.push('/auth/login?redirectTo=/profile')
      }
    })
  }, [router])

  useEffect(() => {
    if (!user) return

    fetch('/api/profile')
      .then((r) => r.json())
      .then(({ profile: p }) => {
        if (p) {
          setProfile(p)
          setDisplayName(p.display_name ?? '')
          setBio(p.bio ?? '')
          setAvatarUrl(p.avatar_url ?? '')
          setInstagram(p.instagram ?? '')
          setTiktok(p.tiktok ?? '')
          setTwitter(p.twitter ?? '')
          setFavoriteBroth(p.favorite_broth ?? '')
          setRamenCount(p.ramen_count ?? '')
        }
      })

    getSavedSlugs().then((slugs) => setSavesCount(slugs.length))
    setVisitsCount(getVisitedSlugs().length)

    function onStorage(e: StorageEvent) {
      if (e.key === 'ramennearyou:visits') setVisitsCount(getVisitedSlugs().length)
    }
    window.addEventListener('storage', onStorage)

    fetch('/api/city-follows')
      .then(r => r.json())
      .then(({ follows }) => setFollowsCount(Array.isArray(follows) ? follows.length : 0))
      .catch(() => setFollowsCount(0))

    return () => window.removeEventListener('storage', onStorage)
  }, [user])

  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    setUploadError('')
    try {
      const form = new FormData()
      form.append('files', file)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error ?? 'Upload failed. Please try again.')
        return
      }
      const url = data.urls?.[0]
      if (!url) {
        setUploadError('Upload failed — no URL returned.')
        return
      }
      setAvatarUrl(url)
      // Auto-save avatar immediately so it persists without needing Save Profile
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar_url: url }),
      })
    } catch {
      setUploadError('Network error. Please try again.')
    } finally {
      setUploadingPhoto(false)
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    setSaveError('')

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          instagram,
          tiktok,
          twitter,
          favorite_broth: favoriteBroth,
          ramen_count: ramenCount === '' ? null : Number(ramenCount),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error ?? 'Failed to save.')
      } else {
        setProfile(data.profile)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch {
      setSaveError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const userInitial = user?.email ? user.email[0].toUpperCase() : '?'

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#6B6862] text-sm">Loading&hellip;</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-8">My Profile</h1>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-[#F5F4F0] border border-black/8 rounded-xl p-6">
              <h2 className="text-[#1E2026] font-semibold text-sm mb-4 uppercase tracking-wider">Photo</h2>
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Avatar"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-black/8"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#B57F50]/20 border-2 border-[#B57F50]/30 flex items-center justify-center text-2xl font-bold text-[#96602F]">
                      {userInitial}
                    </div>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5 border border-black/8 text-[#1E2026] text-sm hover:bg-black/8 transition-colors disabled:opacity-60"
                  >
                    <Camera className="w-4 h-4" />
                    {uploadingPhoto ? 'Uploading…' : 'Change photo'}
                  </button>
                  <p className="text-[#6B6862] text-xs mt-1.5">JPG, PNG or GIF, max 8 MB</p>
                  {uploadError && <p className="text-red-400 text-xs mt-1.5">{uploadError}</p>}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
            </div>

            <div className="bg-[#F5F4F0] border border-black/8 rounded-xl p-6 space-y-5">
              <h2 className="text-[#1E2026] font-semibold text-sm uppercase tracking-wider">Profile Info</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#1E2026] text-sm font-medium">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[#1E2026] text-sm font-medium">Bio</label>
                  <span className="text-[#6B6862] text-xs">{bio.length}/200</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A few words about you and your love of ramen…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#1E2026] text-sm font-medium">Favorite Broth</label>
                <select
                  value={favoriteBroth}
                  onChange={(e) => setFavoriteBroth(e.target.value)}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Select a broth…</option>
                  {brothOptions.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#1E2026] text-sm font-medium">Ramen Restaurants Visited</label>
                <input
                  type="number"
                  min={0}
                  value={ramenCount}
                  onChange={(e) => setRamenCount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="bg-[#F5F4F0] border border-black/8 rounded-xl p-6 space-y-5">
              <h2 className="text-[#1E2026] font-semibold text-sm uppercase tracking-wider">Social Links</h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#1E2026] text-sm font-medium">Instagram</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6862] text-sm select-none">@</span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="yourhandle"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#1E2026] text-sm font-medium">TikTok</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6862] text-sm select-none">T@</span>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="yourhandle"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#1E2026] text-sm font-medium">Twitter / X</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6862] text-sm select-none">@</span>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="yourhandle"
                    className={`${inputClass} pl-7`}
                  />
                </div>
              </div>
            </div>

            {saveError && <p className="text-red-400 text-sm">{saveError}</p>}
            {saveSuccess && <p className="text-green-400 text-sm">Profile saved successfully.</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 rounded-none bg-[#B57F50] text-white text-sm font-medium hover:bg-[#c8934f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>

          <div className="mt-6 bg-[#F5F4F0] border border-black/8 rounded-xl p-6">
            <h2 className="text-[#1E2026] font-semibold text-sm uppercase tracking-wider mb-4">Stats</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-[#1E2026]">{savesCount ?? '—'}</p>
                <p className="text-[#6B6862] text-xs mt-1">Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E2026]">{visitsCount ?? '—'}</p>
                <p className="text-[#6B6862] text-xs mt-1">Visited</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1E2026]">{followsCount ?? '—'}</p>
                <p className="text-[#6B6862] text-xs mt-1">Cities Followed</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1E2026] leading-snug pt-1.5">
                  {user.created_at ? formatMemberSince(user.created_at) : '—'}
                </p>
                <p className="text-[#6B6862] text-xs mt-1">Member Since</p>
              </div>
            </div>
          </div>

          <section className="mt-8">
            <Link
              href="/owner"
              className="flex items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-sky-500/15 via-sky-500/5 to-transparent border border-sky-500/30 hover:border-sky-500/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  <BadgeCheck className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-[#1E2026] font-semibold text-sm">Own a ramen shop?</p>
                  <p className="text-[#6B6862] text-xs">Manage your verified listings and edit content.</p>
                </div>
              </div>
              <span className="text-sky-400 text-sm font-semibold group-hover:underline">Owner Dashboard →</span>
            </Link>
          </section>

          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-[#1E2026] font-semibold text-sm uppercase tracking-wider mb-4">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              Saved Restaurants
            </h2>
            <SavedSection />
          </section>

          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-[#1E2026] font-semibold text-sm uppercase tracking-wider mb-4">
              <MapPin className="w-4 h-4 text-[#96602F]" />
              Cities You Follow
            </h2>
            <CitiesSection />
          </section>

          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-[#1E2026] font-semibold text-sm uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Visited Restaurants
            </h2>
            <p className="text-[#6B6862] text-xs mb-2">
              You&apos;ve marked <span className="text-[#1E2026] font-semibold">{visitsCount ?? 0}</span> restaurant{visitsCount === 1 ? '' : 's'} as visited.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
