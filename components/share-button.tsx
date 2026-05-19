'use client'

import { useState } from 'react'
import { Share2, Copy, Check, Twitter, Facebook, Link2 } from 'lucide-react'

interface Props {
  name: string
  url: string
}

export default function ShareButton({ name, url }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  async function nativeShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: name, text: `Check out ${name} on RamenNearYou`, url })
        setOpen(false)
        return
      } catch {}
    }
    setOpen(true)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => { setCopied(false); setOpen(false) }, 1800)
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${name} on RamenNearYou`)}&url=${encodeURIComponent(url)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  return (
    <div className="relative">
      <button
        onClick={nativeShare}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 text-[#B0B3BB] hover:border-white/25 hover:text-white transition-all text-sm font-medium"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-[#1E2026] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
            <p className="px-4 py-2.5 text-xs font-medium text-[#B0B3BB] border-b border-white/5">Share this restaurant</p>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#B0B3BB] hover:bg-white/5 hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
              Share on X / Twitter
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-[#B0B3BB] hover:bg-white/5 hover:text-white transition-colors border-t border-white/5"
            >
              <Facebook className="w-4 h-4" />
              Share on Facebook
            </a>
            <button
              onClick={copyLink}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#B0B3BB] hover:bg-white/5 hover:text-white transition-colors border-t border-white/5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Link2 className="w-4 h-4" />}
              {copied ? 'Link copied!' : 'Copy link'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
