# Ramen Pass (free accounts + diner membership)

The one product that activates itself. The site is still a static export with
no functions: the browser talks to Supabase (auth + RLS), and Postgres talks
to Stripe.

## Tiers

| | Free account | Ramen Pass |
|---|---|---|
| Price | $0 | $4.99/mo or $39/yr |
| Saves | 5 (enforced by a trigger) | unlimited |
| Check-ins & passport badges | ✓ | ✓ |
| Stats map (cities/states) | — | ✓ |
| Advanced filters (broth styles, vegan/veg/GF/halal, open now/late/midnight, extra spicy, Korean-style) | — | ✓ (`ADVANCED_FILTER_KEYS`) |
| Lists & trip planner | — | ✓ (RLS requires the Pass) |
| Member deals at claimed shops | teaser only | ✓ |
| Ad-free | — | ✓ |
| Monthly new-openings email | — | ✓ (opt-in; drafts only) |

Static SEO filter pages (/broth, /find/…) stay open to everyone — only the
interactive chips on the homepage map/feed are gated.

## Stripe (live, acct_1MOoSILlgxXvIOfe)

- Product `prod_VZPEfXNWQaQTkd` "Ramen Pass"
- Prices `price_1UYGQCLlgxXvIOfeP6P9UHDx` ($4.99/mo, lookup `ramen_pass_monthly`),
  `price_1UYGQELlgxXvIOfeYFVTXUfa` ($39/yr, lookup `ramen_pass_yearly`)
- Payment Links `plink_1UYGQMLlgxXvIOfeQYOJhnpB` (monthly) and
  `plink_1UYGQPLlgxXvIOfeORZqVl0f` (yearly): promo codes on,
  card always collected, redirect to `/account?session_id={CHECKOUT_SESSION_ID}`.
  The site appends `client_reference_id=<supabase user id>&prefilled_email=…`.
- Customer portal configuration `bpc_1UYGQWLlgxXvIOfeNr9DnXzh` (cancel at
  period end, update card, invoices; returns to /account).
  Login page: https://billing.stripe.com/p/login/fZu6oIbeqbx68QCeK2frW02
- Older products `prod_Uiy55MU6Oxx72f` / `prod_UjiZ7N4Aqrwea1` are legacy and
  unused — archive them in Stripe when convenient.

## How activation works (no webhook)

`supabase/ramen-pass-membership.sql` (applied live 2026-11-04):

1. After checkout Stripe redirects to `/account?session_id=cs_…`; the page calls
   `pass_claim_session()`. Postgres fetches the session from Stripe with the
   `http` extension and the secret key in Vault (`stripe_secret_key`), checks it
   came from one of our two links, is complete, and belongs to this user
   (`client_reference_id` = user id, or same verified email), then writes
   `pass_members`.
2. `my_pass()` re-syncs a member's subscription lazily when the row is >12h old
   or the period has ended.
3. pg_cron job `rny-pass-sync` (hourly at :17) runs `pass_sync_all()` for
   renewals, cancellations and failed payments.
4. Membership counts as active for `active`, `trialing`, `past_due` until
   `current_period_end` + 2 days.

Browser roles can't write `pass_members`; every table has RLS. Ad-free is a
localStorage flag (`rny_pass_until`, 3-day TTL, refreshed while signed in) read
by an inline script before AdSense; the AdSense snippet itself stays in the
HTML for review.

If the Stripe secret key is rotated: update the Vault secret
`stripe_secret_key` (Supabase → Project settings → Vault).

## Monthly new-openings email

`SUPABASE_SERVICE_ROLE_KEY=… node scripts/pass-monthly-openings.mjs` writes
drafts to `reports/pass-openings/<YYYY-MM>/`. It never sends. The first run
only records a baseline snapshot.

## Auth email dependency

Accounts use the owner-portal sign-in (email code / magic link / Google).
Email sign-in only reaches the public once Supabase custom SMTP is configured
(Auth → SMTP: smtp.resend.com:465, user `resend`, password = Resend API key,
sender hello@ramennearyou.com) and Auth → URL configuration has Site URL
https://www.ramennearyou.com plus redirect URLs …/account and …/owner.
