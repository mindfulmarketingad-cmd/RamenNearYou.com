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
  metadataBase: new URL('https://www.ramennearyou.com'),
  title: {
    default: 'Ramen Near Me — Find the Best Local Ramen Restaurants',
    template: '%s | RamenNearYou',
  },
  description:
    'Find the best ramen near you. Browse top-rated ramen restaurants by city, broth type, or name. Tonkotsu, miso, shoyu, spicy & vegan options.',
  keywords: ['ramen near me', 'ramen restaurants', 'best ramen', 'tonkotsu ramen', 'miso ramen', 'shoyu ramen', 'ramen near me Atlanta', 'local ramen'],
  openGraph: {
    title: 'Ramen Near Me — Find the Best Local Ramen Restaurants',
    description: 'Find the best ramen near you. Browse top-rated ramen restaurants by city, broth type, or name.',
    type: 'website',
    url: 'https://www.ramennearyou.com',
    siteName: 'RamenNearYou',
    locale: 'en_US',
    images: [
      {
        url: '/images/hero-ramen.jpg',
        width: 1200,
        height: 630,
        alt: 'RamenNearYou — Find the Best Ramen Near You',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ramen Near Me — Find the Best Local Ramen Restaurants',
    description: 'Find the best ramen near you. Browse top-rated ramen restaurants by city, broth type, or name.',
    images: ['/images/hero-ramen.jpg'],
  },
  alternates: {
    canonical: 'https://www.ramennearyou.com',
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
