'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Heart } from 'lucide-react'
import { useCurrentUser } from '@/lib/use-current-user'
import { getSavedRecipeSlugs, toggleSavedRecipe } from '@/lib/recipe-saves'
import LoginGateModal from '@/components/login-gate-modal'

export default function SaveRecipeButton({ slug }: { slug: string }) {
  const pathname = usePathname()
  const { user, authChecked } = useCurrentUser()
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)

  useEffect(() => {
    getSavedRecipeSlugs().then((slugs) => setSaved(slugs.includes(slug)))
  }, [slug])

  async function handleClick() {
    if (!authChecked) return
    if (!user) { setGateOpen(true); return }
    if (busy) return
    setBusy(true)
    const result = await toggleSavedRecipe(slug, saved)
    setBusy(false)
    if (result.unauthorized) { setGateOpen(true); return }
    setSaved(result.saved)
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={busy}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-colors disabled:opacity-60 ${
          saved
            ? 'bg-[#B57F50]/10 border-[#B57F50]/40 text-[#96602F]'
            : 'bg-white border-black/12 text-[#1E2026] hover:border-[#B57F50]/50'
        }`}
      >
        <Heart className={`w-4 h-4 transition-all ${saved ? 'fill-[#B57F50] text-[#96602F]' : ''}`} />
        {saved ? 'Saved' : 'Save Recipe'}
      </button>
      <LoginGateModal open={gateOpen} onClose={() => setGateOpen(false)} redirectTo={pathname} />
    </>
  )
}
