'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  className?: string
  children?: React.ReactNode
}

export default function RamenPassCheckoutButton({ className, children }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)

  useEffect(() => {
    // Pick up ?ref= from the URL (set when arriving via a referral link).
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    if (ref) {
      setReferralCode(ref)
      try { localStorage.setItem('ramen_pass_ref', ref) } catch {}
    } else {
      try { setReferralCode(localStorage.getItem('ramen_pass_ref')) } catch {}
    }
  }, [])

  async function subscribe() {
    setLoading(true)
    setError(null)

    // Require sign-in first.
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login?redirectTo=/ramen-pass')
      return
    }

    try {
      const res = await fetch('/api/ramen-pass/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralCode }),
      })
      let data: { url?: string; error?: string } = {}
      try { data = await res.json() } catch { /* non-JSON response */ }
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button onClick={subscribe} disabled={loading} className={className}>
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children ?? 'Get Ramen Pass'}
      </button>
      {error && <p className="text-red-600 text-xs">{error}</p>}
    </div>
  )
}
