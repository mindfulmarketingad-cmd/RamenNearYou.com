import { SUPPORT_TIP_URL } from '@/lib/paid-listings'

// Small, unobtrusive one-time tip link (Stripe Payment Link — no backend).
export default function SupportTip({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm text-ink-soft ${className}`}>
      Found this useful? RamenNearYou is free and independent —{' '}
      <a href={SUPPORT_TIP_URL} target="_blank" rel="noopener" className="text-brand-ink font-semibold hover:underline">
        leave a tip to support the site
      </a>{' '}
      (one-time, you pick the amount).
    </p>
  )
}
