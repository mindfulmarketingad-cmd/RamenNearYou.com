import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import SalePopup from '@/components/sale-popup'
import AnalyticsTracker from '@/components/analytics-tracker'
import { ThemeProvider } from '@/components/theme-provider'
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
    /* suppressHydrationWarning: next-themes writes the theme class onto
       <html> from an inline script before React hydrates, so server and client
       markup legitimately differ on this one element. */
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${dmSans.variable} bg-surface`}>
      <head>
        <meta name="google-adsense-account" content="ca-pub-9332749804326149" />
        <meta name="msvalidate.01" content="99617846F44D5C6A9420F9E39DE802A1" />
        {/* Crazy Egg */}
        <script type="text/javascript" src="//script.crazyegg.com/pages/scripts/0133/3789.js" async></script>
        {/* Google Consent Mode defaults, set before any tag runs.

            These have to be DENIED in the EEA, the UK and Switzerland. The
            consent signal a CMP produces is an *update* to these defaults, so
            defaulting everything to 'granted' declares consent the visitor
            never gave and lets tags fire in the window before the CMP has
            even asked — which is exactly the state AdSense flags as a missing
            TC string, CMP installed or not.

            Region-scoped so it costs nothing elsewhere: US traffic (almost
            all of this site's) still gets fully personalised ads immediately,
            while EEA/UK/CH waits for the CMP to answer. `wait_for_update`
            holds tags briefly so they don't fire before that answer lands. */}
        <Script id="gtag-consent-default" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500,
            region: [
              'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU',
              'IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES',
              'SE','IS','LI','NO','GB','CH'
            ],
          });
          gtag('consent', 'default', {
            ad_storage: 'granted',
            ad_user_data: 'granted',
            ad_personalization: 'granted',
            analytics_storage: 'granted',
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
        {/* AdSense (ca-pub-9332749804326149) — loaded site-wide via the root layout */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9332749804326149"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased bg-surface text-ink">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <AnalyticsTracker />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-contrast focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <div id="main-content">{children}</div>
        <SalePopup />
        <Toaster position="bottom-center" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
