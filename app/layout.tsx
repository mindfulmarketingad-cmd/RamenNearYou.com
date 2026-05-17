import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'Ramen Near Me — Find the Best Local Ramen Restaurants',
  description:
    'Discover top-rated ramen restaurants near you. Browse by city, neighborhood, or broth type. Starting in Atlanta, GA — expanding nationwide.',
  generator: 'v0.app',
  keywords: ['ramen', 'ramen near me', 'ramen restaurants', 'Atlanta ramen', 'tonkotsu', 'shoyu', 'miso ramen'],
  openGraph: {
    title: 'RamenNearYou — Find the Best Local Ramen',
    description: 'The #1 ramen directory, one city at a time.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} bg-jet-black`}>
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-S6L1KWFRC8" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-S6L1KWFRC8');
        `}</Script>
      </head>
      <body className="font-sans antialiased bg-jet-black text-white">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
