import type { Metadata } from 'next'

// Both auth pages are client components, so their metadata has to live here.
//
// robots.txt already disallows /auth/, but Disallow only asks crawlers not to
// fetch — it does not remove a URL from the index, and a page linked from
// anywhere can still be listed. `noindex` is what actually keeps the sign-in
// form out of search results, which is one of the ways scanners assemble
// lists of login endpoints to probe. It does nothing about bots that hit the
// URL directly; those are handled at the auth provider, not here.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
