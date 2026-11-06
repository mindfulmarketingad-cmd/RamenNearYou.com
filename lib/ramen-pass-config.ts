// Ramen Pass constants, safe for server and client components.
// Stripe objects (live, acct_1MOoSILlgxXvIOfe): product prod_VZPEfXNWQaQTkd,
// prices price_1UYGQCLlgxXvIOfeP6P9UHDx (monthly) / price_1UYGQELlgxXvIOfeYFVTXUfa (yearly),
// payment links below (redirect to /account?session_id=…).

export const PASS_PRICES = {
  monthly: { label: '$4.99', per: 'month', amount: 4.99, checkoutUrl: 'https://buy.stripe.com/5kQ9AUeqCbx6d6S9pIfrW0y' },
  yearly: { label: '$39', per: 'year', amount: 39, checkoutUrl: 'https://buy.stripe.com/4gMfZi96i8kU5Eq0TcfrW0z' },
} as const
export type PassPlan = keyof typeof PASS_PRICES
export const FREE_SAVE_LIMIT = 5
export const PASS_LOGIN_URL = 'https://billing.stripe.com/p/login/fZu6oIbeqbx68QCeK2frW02'

/** Filter chips that need the Pass. Everything else stays free for everyone. */
export const ADVANCED_FILTER_KEYS = new Set([
  // broth & bowl styles
  'tonkotsu', 'spicy-miso', 'miso', 'shoyu', 'shio', 'tsukemen', 'mazemen', 'chicken-paitan', 'black-garlic', 'tantanmen',
  // diet
  'vegan', 'vegetarian', 'gluten-free', 'halal',
  // hours
  'open-now', 'open-late', 'open-midnight',
  // spice
  'extra-spicy', 'korean-style',
])
