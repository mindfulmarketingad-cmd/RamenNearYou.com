'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'

// Light/dark switch for the header.
//
// The theme only exists on the client — next-themes reads localStorage and the
// OS setting in an inline script — so until the component has mounted we don't
// know which icon is the right one. Rendering a fixed-size placeholder instead
// of guessing avoids both a hydration mismatch and the header jumping by a
// button's width on first paint.

interface Props {
  /** `icon` for the desktop header, `row` for the mobile menu's list. */
  variant?: 'icon' | 'row'
}

export default function ThemeToggle({ variant = 'icon' }: Props) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === 'dark'
  const next = isDark ? 'light' : 'dark'

  if (variant === 'row') {
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        className="py-2 text-sm text-ink-soft hover:text-ink transition-colors flex items-center gap-2 text-left"
      >
        {mounted && isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        {mounted ? (isDark ? 'Light mode' : 'Dark mode') : 'Theme'}
      </button>
    )
  }

  if (!mounted) {
    return <span className="w-9 h-9 shrink-0" aria-hidden="true" />
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-lg text-ink-soft hover:text-ink hover:bg-line/5 transition-colors"
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  )
}
