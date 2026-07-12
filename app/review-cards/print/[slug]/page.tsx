import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import QRCode from 'qrcode'
import { getRestaurantBySlug } from '@/lib/restaurants'
import PrintButton from '../print-button'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const r = getRestaurantBySlug(slug)
  return {
    title: r ? `Review Card Kit — ${r.name}` : 'Review Card Kit',
    robots: { index: false, follow: false },
  }
}

// One review card unit — reused at table-tent, counter-card, and sticker sizes.
function Card({ qrSvg, name, size }: { qrSvg: string; name: string; size: 'large' | 'medium' | 'small' }) {
  const dims = {
    large:  { w: 'w-[3.5in]', qr: 'w-[2.2in] h-[2.2in]', title: 'text-2xl', sub: 'text-sm', pad: 'p-8' },
    medium: { w: 'w-[3in]',   qr: 'w-[1.7in] h-[1.7in]', title: 'text-xl',  sub: 'text-xs', pad: 'p-6' },
    small:  { w: 'w-[2in]',   qr: 'w-[1.2in] h-[1.2in]', title: 'text-sm',  sub: 'text-[9px]', pad: 'p-3' },
  }[size]

  return (
    <div className={`${dims.w} ${dims.pad} bg-white border-2 border-[#1E2026] rounded-2xl flex flex-col items-center text-center break-inside-avoid`}>
      <p className={`${dims.sub} font-semibold uppercase tracking-widest text-[#96602F] mb-1`}>Enjoyed your bowl?</p>
      <p className={`font-serif ${dims.title} font-bold text-[#1E2026] leading-tight mb-3`}>
        Review us on Google <span aria-hidden>⭐</span>
      </p>
      <div className={`${dims.qr} shrink-0`} dangerouslySetInnerHTML={{ __html: qrSvg }} />
      <p className={`${dims.sub} text-[#6B6862] mt-3 leading-snug`}>
        Scan with your phone camera —<br />it takes 20 seconds and means the world to us.
      </p>
      <p className={`${dims.sub} font-semibold text-[#1E2026] mt-2`}>{name}</p>
    </div>
  )
}

// Print-ready Google Review Card kit. Deliberately chrome-free (no navbar or
// footer) so "Print / Save as PDF" produces clean cards. The QR encodes our
// /r/{slug} redirect, not the raw Google URL — see app/r/[slug]/route.ts.
export default async function ReviewCardPrintPage({ params }: Props) {
  const { slug } = await params
  const r = getRestaurantBySlug(slug)
  if (!r) notFound()

  const qrTarget = `https://www.ramennearyou.com/r/${r.slug}`
  const qrSvg = await QRCode.toString(qrTarget, {
    type: 'svg',
    margin: 1,
    color: { dark: '#1E2026', light: '#FFFFFF' },
    errorCorrectionLevel: 'M',
  })
  // Make the SVG scale to its container.
  const qrSvgResponsive = qrSvg.replace('<svg ', '<svg style="width:100%;height:100%" ')

  return (
    <main className="min-h-screen bg-[#F5F4F0] print:bg-white">
      {/* Screen-only header */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6 text-center print:hidden">
        <p className="text-[#96602F] text-xs font-medium uppercase tracking-widest mb-2">Google Review Card Kit</p>
        <h1 className="font-serif text-3xl font-bold text-[#1E2026] mb-2">{r.name}</h1>
        <p className="text-[#6B6862] text-sm max-w-md mx-auto mb-5">
          Print this page (or save it as a PDF) on cardstock. Cut along the card edges — you get a
          table tent card, a counter card, and four takeout-bag stickers. The QR opens your Google
          review page instantly.
        </p>
        <PrintButton />
      </div>

      {/* The kit */}
      <div className="max-w-3xl mx-auto px-6 pb-16 print:px-0 print:pb-0 print:max-w-none">
        <div className="flex flex-wrap justify-center gap-6 print:gap-4">
          <Card qrSvg={qrSvgResponsive} name={r.name} size="large" />
          <Card qrSvg={qrSvgResponsive} name={r.name} size="medium" />
          <Card qrSvg={qrSvgResponsive} name={r.name} size="small" />
          <Card qrSvg={qrSvgResponsive} name={r.name} size="small" />
          <Card qrSvg={qrSvgResponsive} name={r.name} size="small" />
          <Card qrSvg={qrSvgResponsive} name={r.name} size="small" />
        </div>
      </div>
    </main>
  )
}
