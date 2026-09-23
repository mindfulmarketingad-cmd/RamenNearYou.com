'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-brand hover:bg-brand-hi text-white text-sm font-semibold transition-colors print:hidden"
    >
      <Printer className="w-4 h-4" />
      Print / Save as PDF
    </button>
  )
}
