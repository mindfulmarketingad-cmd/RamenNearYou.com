import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Site Analytics | RamenNearYou',
  description: 'Live traffic and lead-action analytics for the RamenNearYou directory.',
  // A public dashboard of our own numbers has no search value and shouldn't
  // compete with the directory's real pages.
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#F5F4F0]">{children}</div>
}
