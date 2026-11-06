# Monetization

RamenNearYou is a static export (no API routes, no webhooks). Restaurant
owners pay with **Stripe Payment Links**. Postgres verifies the Checkout
Session with the Vault secret `stripe_secret_key` and turns the perk on.
Nobody edits the repo when a customer pays.

Ramen Pass (the diner membership) is no longer sold on the site. The Stripe
products can stay in the account; the payment links are being deactivated
separately. Do not put Pass checkout, trials, or upgrade prompts back on
the site.

| Product | Price | Payment Link | How it turns on |
|---|---|---|---|
| Claim listing | $49.99/month | https://buy.stripe.com/5kQaEY3LY7gQ3wi6dwfrW0A | `listing_claim_session()` — product `prod_Va2SyTAj3XBfep`, price `price_1UYsNILlgxXvIOfePjTxwMqP`, link `plink_1UYsNULlgxXvIOfeAIQZ8BV5`. No trial. |
| Featured add-on | $29/month ($78.99 with claim) | https://buy.stripe.com/bJeeVegyKdFe3wi6dwfrW0s | same session check, from the owner dashboard |
| Premium add-on | $79/month ($128.99 with claim) | https://buy.stripe.com/8x2fZi3LY30Aff0bxQfrW0t | same session check, from the owner dashboard |
| Homepage billboard (add-on) | $99/month | https://buy.stripe.com/5kQ8wQciu9oYd6SdFYfrW0n | subscription is recorded; the hero itself is still the slots in `lib/homepage-billboard.ts` |
| Tip ("Support RamenNearYou") | one-time, payer chooses ($5 preset, $3 min) | https://donate.stripe.com/bJe14ogyK7gQ8QCdFYfrW0u | Stripe only |
| Banners / sponsored posts | quoted by email | — (`/advertise`) | hand-placed |
| Amazon affiliate | commission | `lib/products.ts` | `components/products-carousel.tsx` |

## What each paid listing gets

- **Claim** — verified badge, owner dashboard, listing analytics (views, calls, directions, review taps), edits to description / phone / website / menu / hours, ad-free listing page.
- **Featured** — add-on on a claimed listing. Top of the city page labelled “Featured”, gold crown pin on every map, Featured badge.
- **Premium** — everything in Featured, plus the top of the state page and a labelled “Featured partner” box on that city’s ramen guide. Paid placement never changes the ranked “best” lists.

Featured and Premium are not substitutes for claiming. The owner buys them from `/owner` after the claim is active.

## How activation works

1. The owner signs in at `/owner?claim=<slug>`.
2. Checkout gets `client_reference_id=<restaurant slug>` and `prefilled_email` of the signed-in account. The claim link returns to `https://www.ramennearyou.com/owner?session_id={CHECKOUT_SESSION_ID}`.
3. `listing_claim_session()` loads that session from Stripe, checks it is paid (not a trial), the email matches the signed-in user, and the slug is a real listing. It writes `listing_subscriptions` and approves the claim. There is no pending queue.
4. Featured, Premium and the billboard use the same return. Opening `/owner` also runs `listing_sync_mine()`, which scans recent Checkout Sessions for that email, so a Payment Link whose success URL is not `/owner` still activates.
5. `listing_sync_all()` runs hourly (pg_cron `rny-listing-sync`, minute 41) for renewals, cancellations and checkouts nobody returned from.
6. City pages, state pages, maps, listing badges and the ramen-guide partner box read `listing_placements()` in the browser. `PAID_LISTINGS` in `lib/paid-listings.ts` is only a manual overlay.

A lapsed claim subscription drops the dashboard and the live badge. Claims approved before this change (no `source = 'stripe'`) keep working.

## Email

- **Claim approved:** welcome from David / RamenNearYou with the dashboard link, what they can edit, the analytics, and the Featured / Premium prices. Trigger: `rny_claim_emails` on `claims`.
- **Featured, Premium, or billboard first recorded:** a short confirmation to the same address.
- **Receipts, invoices, renewal notices:** Stripe’s own customer emails. The site does not send a second renewal. Owners cancel from those emails or **Manage billing** on `/owner` (`listing_portal_url()`).
- Nothing is sent to David to review. Auth magic-link / code mail still needs Supabase custom SMTP (see `docs/owner-portal.md`).

## Owner monthly report (drafts only)

```
SUPABASE_SERVICE_ROLE_KEY=... node scripts/owner-monthly-report.mjs [YYYY-MM]
```

Reads approved `claims` + `PAID_LISTINGS`, counts last month's listing views
and call/directions/review taps from `ramennearyou_dashboard`, and writes
`reports/owner-reports/<month>/summary.csv` plus one draft email per listing.
**It never sends anything.** `reports/` is git-ignored.

## Rules

- Always label paid placement (“Featured”, “Sponsored”, “Featured partner”).
- No backend: don't add API routes or webhooks (`scripts/check-static-build.mjs`).
- Don't change prices in copy without changing them in Stripe, and vice versa.
- Apply `supabase/listing-subscriptions.sql` on the live project after `supabase/owner-portal.sql`. Re-run it if owner-portal.sql is ever applied again — that file’s older claim function is replaced by the listing file.
