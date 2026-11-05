# Monetization

RamenNearYou is a static export (no API routes, no webhooks), so every paid
product is a **Stripe Payment Link** and activation is a **repo edit + deploy**.
All Stripe objects live in the Stripe account that already owns the homepage
billboard link (Letters2numbersconverter, `acct_1MOoSILlgxXvIOfe`, live mode).

| Product | Price | Payment Link | Where the code lives |
|---|---|---|---|
| Claim listing | Free | — (email via `/claim-your-listing`) | `lib/verified-listings.ts` |
| Featured listing | $29/month | https://buy.stripe.com/bJeeVegyKdFe3wi6dwfrW0s | `lib/paid-listings.ts` |
| Premium listing | $79/month | https://buy.stripe.com/8x2fZi3LY30Aff0bxQfrW0t | `lib/paid-listings.ts` |
| Homepage billboard (add-on) | $99/month | https://buy.stripe.com/5kQ8wQciu9oYd6SdFYfrW0n | `lib/homepage-billboard.ts` |
| **Ramen Pass** (diner membership) | $4.99/month or $39/year, 7-day trial | monthly https://buy.stripe.com/5kQ9AUeqCbx6d6S9pIfrW0y · yearly https://buy.stripe.com/4gMfZi96i8kU5Eq0TcfrW0z | `lib/ramen-pass*.ts`, `components/pass/`, see `docs/ramen-pass.md` — activates itself (no repo edit) |
| Tip ("Support RamenNearYou") | one-time, payer chooses ($5 preset, $3 min) | https://donate.stripe.com/bJe14ogyK7gQ8QCdFYfrW0u | `SUPPORT_TIP_URL` in `lib/paid-listings.ts` |
| Banners / sponsored posts | quoted by email | — (`/advertise`) | hand-placed |
| Amazon affiliate | commission | `lib/products.ts` | `components/products-carousel.tsx` |

## What each tier gets

- **Featured** – pinned to the top of its city page (`/find/<city>-<state>`),
  labelled "Featured"; gold crown pin on every map; Verified + Featured badges;
  ad-free listing page.
- **Premium** – everything in Featured, plus the top of its state page and a
  labelled "Featured partner" box on the city's blog ramen guide (both the
  auto-generated city listicles and hand-written posts whose cards are mostly
  in that city). Paid placement never changes the ranked "best" lists.

## Activating a paid listing

1. Stripe emails you about the new subscription. The checkout asks the buyer
   for **"Restaurant name and city"** (custom field). If they came from a link
   with `?restaurant=<slug>`, the slug is also in the session's
   `client_reference_id`.
2. Find the restaurant's slug (the last part of its listing URL).
3. Add a line to `PAID_LISTINGS` in `lib/paid-listings.ts`:
   ```ts
   { slug: 'shibuya-ramen-atlanta', tier: 'featured', since: '2026-11-02', stripeSubscription: 'sub_…' },
   ```
4. Commit, open a PR, deploy as usual. It goes live with the next deploy
   (there is no webhook).
5. Reply to the owner to confirm (the thank-you page tells them you will).

**Cancelling:** when Stripe reports a cancelled subscription, delete the line
and redeploy.

Billboard slots are managed separately in `lib/homepage-billboard.ts`.

## Owner monthly report (drafts only)

```
SUPABASE_SERVICE_ROLE_KEY=... node scripts/owner-monthly-report.mjs [YYYY-MM]
```

Reads approved `claims` + `PAID_LISTINGS`, counts last month's listing views
and call/directions/review taps from `ramennearyou_dashboard`, and writes
`reports/owner-reports/<month>/summary.csv` plus one draft email per listing.
**It never sends anything** — review and send the drafts yourself.
`reports/` is git-ignored (owner emails).

## Rules

- Always label paid placement ("Featured", "Sponsored", "Featured partner").
- No backend: don't add API routes/webhooks (`scripts/check-static-build.mjs`).
- Don't change prices in copy without changing them in Stripe, and vice versa.
