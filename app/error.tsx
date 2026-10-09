'use client'

import { useEffect } from 'react'
import Link from 'next/link'

// Route-segment error boundary — converts an unexpected render/server error into
// a friendly, recoverable screen instead of a hard "page couldn't load".
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 px-4 text-center bg-surface">
      <h1 className="font-serif text-2xl font-bold text-ink">Something went wrong</h1>
      <p className="text-ink-soft text-sm max-w-xs">
        That hiccup is on us. Try again, or head back to the ramen map.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-brand hover:bg-brand-hi text-white text-sm font-semibold transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-line/10 text-ink hover:border-line/20 text-sm font-medium rounded-lg transition-colors"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
