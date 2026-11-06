# Monetization

RamenNearYou is a static export (no API routes, no webhooks). Restaurant
owners pay with one **Stripe Payment Link**. Postgres verifies the Checkout
Session with the Vault secret `stripe_secret_key` and turns the listing on.
Nobody edits the repo when a customer pays.

There is one restaurant offer: **claim a listing for $49.99/month**. That
subscription includes Featured placement, labelled Featured / Sponsored:

- a larger gold crown pin on the homepage map (and every other map)
- the top of the restaurant’s city page
- the top of the restaurant’s state page

plus the owner dashboard, listing analytics, a verified badge, and listing edits.

The homepage billboard in `lib/homepage-billboard.ts` is not part of this
offer. Do not sell it, or the old $29 / $79 add-ons, on the site.

Ramen Pass is no longer sold. Do not put Pass checkout or trials back on the site.

| Product | Price | Payment Link |
|---|---|---|
| Claimed listing | $49.99/month, no trial | https://buy.stripe.com/5kQaEY3LY7gQ3wi6dwfrW0A — product `prod_Va2SyTAj3XBfep`, price `price_1UYsNILlgxXvIOfePjTxwMqP`, link `plink_1UYsNULlgxXvIOfeAIQZ8BV5` |
| Tip ("Support RamenNearYou") | one-time, payer chooses | https://donate.stripe.com/bJe14ogyK7gQ8QCdFYfrW0u |
| Banners / sponsored posts | quoted by email | `/advertise` |
| Amazon affiliate | commission | `lib/products.ts` |

## How activation works

1. The owner signs in at `/owner?claim=<slug>`.
2. Checkout gets `client_reference_id=<restaurant slug>` and `prefilled_email` of the signed-in account. The link returns to `https://www.ramennearyou.com/owner?session_id={CHECKOUT_SESSION_ID}`.
3. `listing_claim_session()` loads that session from Stripe, checks it is paid, the email matches, and the price is the $49.99 claim. It writes `listing_subscriptions` and approves the claim. There is no pending queue.
4. Opening `/owner` also runs `listing_sync_mine()`. `listing_sync_all()` runs hourly (pg_cron `rny-listing-sync`, minute 41) for renewals, cancellations, and checkouts nobody returned from.
5. The homepage map, city pages, and state pages read `listing_placements()`. A live claim is `tier: featured`, which is the gold pin and the top-of-page spot. `PAID_LISTINGS` in `lib/paid-listings.ts` is only a manual overlay. The demo row is `shibuya-ramen-atlanta` (not a Stripe subscription).

A lapsed claim subscription drops the dashboard and the live pin. Claims approved before subscriptions (`source` is null) keep the dashboard but do not get Featured placement.

## Email

- **Claim approved:** welcome from David / RamenNearYou with the dashboard link, analytics, and the Featured pin / city / state placement that the subscription includes.
- **Receipts, invoices, renewal notices:** Stripe’s own customer emails.
- Nothing is sent to David to review.

## Demo

`shibuya-ramen-atlanta` (Marietta, Georgia) is in `PAID_LISTINGS` so its pin is the gold crown on the homepage map and it sits at the top of the Marietta city page and the Georgia state page, labelled Featured. Its homepage billboard slot in `lib/homepage-billboard.ts` is unchanged and is not this offer.

## Rules

- Always label paid placement (“Featured”, “Sponsored”).
- No backend: don't add API routes or webhooks (`scripts/check-static-build.mjs`).
- Apply `supabase/listing-subscriptions.sql` after `supabase/owner-portal.sql`. Re-run the listing file if owner-portal.sql is applied again.
