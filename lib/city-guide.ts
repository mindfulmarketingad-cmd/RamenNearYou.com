// ── Curated city ramen guide: checkout config ────────────────────────────────
//
// Fulfillment is human-in-the-loop, same as the review cards: the buyer's
// email + requested city are recorded before checkout, you confirm the payment
// in Stripe, then build and send that city's guide.
export const STRIPE_CITY_GUIDE_LINK = 'https://buy.stripe.com/eVq00k6Ya58Igj49pIfrW0m'

// What the guide covers, shown on the CTA. Keep in sync with what you
// actually send buyers.
export const CITY_GUIDE_INCLUDES = [
  'Every ramen spot in your city, ranked and reviewed',
  'What to order at each one, and what to skip',
  'Hours, price range, and the best time to go',
  'Hidden gems that never show up on the first page of Google',
]
