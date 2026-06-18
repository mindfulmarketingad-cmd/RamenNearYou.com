'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Copy, Check, X } from 'lucide-react'

interface Props {
  url: string
  title: string
}

export default function ShareButton({ url, title }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const enc = encodeURIComponent
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`
  const xUrl = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`

  function shareInstagram() {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {})
    } else {
      copyLink()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/10 text-[#1E2026] text-sm font-medium hover:border-[#B57F50] hover:text-[#B57F50] transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div ref={modalRef} className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4 text-[#1E2026]" />
            </button>

            <p className="font-bold text-[#B57F50] text-xl mb-1">Share This</p>
            <p className="text-[#6B6862] text-sm mb-6">Share this page with your family and friends</p>

            <div className="flex flex-col gap-3">
              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-semibold transition-colors"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.095 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.095 24 18.1 24 12.073z"/></svg>
                Facebook
              </a>

              {/* X */}
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-xl bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Share on X
              </a>

              {/* Instagram */}
              <button
                onClick={shareInstagram}
                className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-xl text-white text-sm font-semibold transition-colors"
                style={{ background: 'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' }}
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                Share on Instagram
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-black/10" />
                <span className="text-[#6B6862] text-xs">Or</span>
                <div className="flex-1 h-px bg-black/10" />
              </div>

              {/* Copy Link */}
              <button
                onClick={copyLink}
                className="flex items-center justify-center gap-3 w-full px-5 py-3 rounded-none bg-white border border-black/10 hover:border-[#B57F50] text-[#1E2026] text-sm font-medium transition-colors"
              >
                {copied ? (
                  <><Check className="w-4 h-4 text-green-500" /><span className="text-green-600">Copied!</span></>
                ) : (
                  <><Copy className="w-4 h-4" />Copy Link</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
