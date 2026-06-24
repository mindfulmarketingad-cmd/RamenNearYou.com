import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import LocationPrompt from '@/components/location-prompt'
import PromoBanner from '@/components/promo-banner'
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
    default: 'Best Ramen Near Me — Find Top-Rated Ramen Restaurants Near You',
    template: '%s | Ramen Near You',
  },
  description:
    'Looking for the best ramen near me? Browse top-rated ramen restaurants near you by city, broth type, or name. Tonkotsu, miso, shoyu, shio, spicy & vegan ramen.',
  keywords: ['ramen near me', 'ramen restaurants', 'best ramen', 'tonkotsu ramen', 'miso ramen', 'shoyu ramen', 'ramen near me Atlanta', 'local ramen'],
  openGraph: {
    title: 'Best Ramen Near Me — Find Top-Rated Ramen Restaurants Near You',
    description: 'Looking for the best ramen near me? Browse top-rated ramen restaurants near you by city, broth type, or name.',
    type: 'website',
    url: 'https://www.ramennearyou.com',
    siteName: 'Ramen Near You',
    locale: 'en_US',
    images: [
      {
        url: '/images/hero-ramen.jpg',
        width: 1200,
        height: 630,
        alt: 'Ramen Near You — Find the Best Ramen Near You',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Ramen Near Me — Find Top-Rated Ramen Restaurants Near You',
    description: 'Looking for the best ramen near me? Browse top-rated ramen restaurants near you by city, broth type, or name.',
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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} bg-white`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-2173008413459742" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2173008413459742" crossOrigin="anonymous" strategy="afterInteractive" />
        <meta name="msvalidate.01" content="99617846F44D5C6A9420F9E39DE802A1" />
        <Script id="gtag-consent-default" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
          });
        `}</Script>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-S6L1KWFRC8" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          gtag('js', new Date());
          gtag('config', 'G-S6L1KWFRC8');
        `}</Script>
        {/* Google Ads (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-18266125976" strategy="afterInteractive" />
        <Script id="gtag-aw-init" strategy="afterInteractive">{`
          gtag('js', new Date());
          gtag('config', 'AW-18266125976');
        `}</Script>
      </head>
      <body className="font-sans antialiased bg-white text-[#1E2026]">
        {children}
        <PromoBanner />
        <LocationPrompt />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
