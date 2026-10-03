# Directory Monetization Platform Skill

Use this skill when building or extending the "claim your listing → verify → sell premium
placement" system on ANY directory-style site (RamenNearYou.com or a future sibling site:
TacosNearYou, etc.). It captures a proven, working architecture — not a plan — so a new
directory can stand the same system up in days instead of re-deriving it.

The core insight: **the product (claims, entitlements, gating) lives in the Next.js +
Supabase app. Marketing automation (drip emails, nurture sequences) can live in an
external tool, but claims/entitlements never should** — that's what turns "toggle a
premium feature" into a real button instead of a support ticket.

---

## The four tables that make the whole system work

| Table | Purpose | Key columns |
|---|---|---|
| `claims` | Ownership verification | `restaurant_slug`, `user_id`, `contact_email`, `status` (pending/approved/rejected), `admin_note`, `message` (JSON blob of submitted corrections) |
| `featured_listings` | Paid placement entitlement | `restaurant_slug`, `user_id`, `status` (pending/active/cancelled), `stripe_customer_id`, `stripe_subscription_id`, `featured_order` |
| `claim_subscriptions` | Alternate paid tier keyed by slug+email instead of a submission row | `restaurant_slug`, `customer_email`, `status`, `stripe_*` |
| `ramen_pass_subscriptions` (site-specific name) | A consumer-facing subscription, unrelated to listings | pattern-only reference, not reusable as-is |

**Rule of thumb for a new directory**: rename `ramen_pass` → your consumer product,
keep `claims` and `featured_listings` verbatim (the shape is domain-agnostic — it's just
"who owns this listing" and "who paid to be featured").

---

## The pattern: paid status must always flow into the read path

This is the mistake that shipped and sat unnoticed for a while on RamenNearYou: the
Stripe webhook was correctly writing `featured_listings.status = 'active'`, but nothing
on the live site ever *read* that column. The gold pin/featured badge was driven by a
separate, hand-edited file (`lib/featured-city.ts`) that nobody wired the DB into. A
customer could pay and see zero effect until a developer manually added their slug and
redeployed.

**The fix, generalized**: any function that decides "does this listing get the paid
treatment" must be async and must query the entitlement table directly — never a
hardcoded map, never a value cached only at build time with no invalidation path.

```ts
// lib/featured-city.ts — the reusable shape
const CACHE_TTL_MS = 5 * 60 * 1000
let _cache: { slugs: Set<string>; expiresAt: number } | null = null

export async function getAllFeaturedSlugs(): Promise<Set<string>> {
  if (_cache && _cache.expiresAt > Date.now()) return _cache.slugs
  const admin = createAdminClient()
  const { data } = await admin.from('featured_listings').select('restaurant_slug').eq('status', 'active')
  const slugs = new Set((data ?? []).map(r => r.restaurant_slug).filter(Boolean))
  _cache = { slugs, expiresAt: Date.now() + CACHE_TTL_MS }
  return slugs
}
```

- **In-process TTL cache** (a few minutes) if this function is called on a per-request
  route (search, AI queries) — bounds DB load without reintroducing the "requires a
  redeploy" problem.
- **`revalidatePath()` in the Stripe webhook** on the same event that flips the status
  column, for any route that's `force-static`/ISR-cached (e.g. a `/api/map-data` route
  cached for 24h via `stale-while-revalidate`). Without this, a paying customer waits out
  the cache window before seeing the effect — technically self-serve, but it doesn't
  *feel* self-serve.
- Audit every hardcoded "premium feature" list in a codebase before calling entitlements
  "done." Grep for the feature name (`featured`, `verified`, `spotlight`) across `lib/`
  and `components/` — if you find a literal array/object instead of a table read, that's
  the same bug.

---

## The claim → verify pipeline (already correct, reuse verbatim)

1. **Claim form** (`app/claim/[city]/[state]/[restaurant]/claim-form.tsx`) collects only:
   restaurant corrections (name/phone/website/description/hours), the claimant's name,
   email, and role (Owner / GM / Authorized Rep / Other), plus a confirmation checkbox.
   No document upload, no address change (address edits require admin review — surfaced
   as a read-only field with a note).
2. **Submit** → `POST /api/claims` inserts into `claims` with `status: 'pending'`,
   stores the corrections as a JSON string in `message`, emails the admin via Resend.
3. **Admin review** (`app/admin/claims/`) — approve/reject buttons call
   `PATCH /api/admin/claims/[id]`, gated by `session.user.email === process.env.ADMIN_EMAIL`
   (swap for a real roles table at scale). On decision, this route **already sends the
   approve/reject email** — don't rebuild this, it exists.
4. **Verification badge** — `app/[city]/[state]/[restaurant]/page.tsx` queries
   `claims` for a `status = 'approved'` row matching the slug, sets `isVerified`. If the
   logged-in visitor's `user_id` matches the claim, `isOwner = true`; if only their email
   matches (they claimed before creating an account, or the claim was pre-registered by
   an admin), `canSelfLink = true` and a self-link panel appears.
5. **Manual owner linking** — admin can paste a Supabase `user_id` into the claim row
   (`PUT /api/admin/claims/[id]`) to connect an approved claim to a specific account
   without waiting on email-match self-linking.

---

## What a new directory needs to change vs. keep

**Keep as-is** (domain-agnostic):
- `claims` table + claim form + admin approve/reject route + verification badge logic
- The async-entitlement-read pattern above
- `lib/supabase-admin.ts` (service-role client, bypasses RLS) — copy verbatim
- Stripe webhook skeleton: `checkout.session.completed` → mark entitlement active,
  `customer.subscription.deleted|paused` → mark cancelled, `invoice.payment_failed` →
  mark past_due + send an email

**Change per-directory**:
- Pricing tiers and Stripe product/price IDs (`app/featured/apply/featured-form.tsx`)
- The consumer-facing subscription product name/perks (`ramen_pass` → whatever this
  directory's equivalent is) — keep the *shape* (a `*_subscriptions` table keyed on
  `user_id`, synced via `customer.subscription.created/updated`), rename everything else
- Email copy (Resend templates) and the admin notification address
- What "featured" visually means on the map/list — it's whatever pin/badge treatment
  fits this directory's UI, but it must be reachable from a `status = 'active'` DB read

---

## Gaps still open on RamenNearYou (do these before calling the platform "done")

These match the user's original automation request and are the highest-leverage next
steps, roughly in build order:

1. **Give `/api/claims` a domain-match fast path**: if `contact_email` domain matches
   the restaurant's `website` domain, auto-approve instead of queuing for manual review.
   Cuts the 24-48h wait to zero for the easy majority of claims.
2. **Post-claim-submit redirect to a sales page** for the paid tier, instead of just
   showing a confirmation panel — the plan calls this "Site Spotlight," this codebase
   already has the equivalent at `/featured/apply`. Wire the claim form's success state
   to `router.push('/featured/apply?slug=' + restaurant.slug)` after a short delay.
3. **24-hour "still under review" reminder email** — nothing currently fires between
   claim submission and the approve/reject decision. A Supabase cron (`pg_cron` or a
   Vercel cron route) querying `claims where status = 'pending' and created_at < now() -
   interval '24 hours' and reminder_sent_at is null` covers this without a new email
   platform.
4. **Nurture sequence for approved-but-never-purchased** — same cron pattern, keyed on
   `claims.status = 'approved' AND NOT EXISTS (SELECT 1 FROM featured_listings WHERE
   restaurant_slug = claims.restaurant_slug AND status = 'active')` and `created_at`
   older than N days.
5. **Monthly stats email to active Featured subscribers** — the single highest-retention
   feature per the original brief; needs a `restaurant_visits`/analytics rollup (the
   `listing_analytics` table already exists — build the email off it) plus a monthly
   cron.
6. **AI claim triage** — score each pending claim (domain match, name similarity to the
   listing, phone match) with a single Claude API call and surface the score in
   `app/admin/claims/claims-list.tsx`; the admin still clicks approve/reject, but spends
   seconds instead of minutes per claim.

None of these require a new platform (GoHighLevel/HubSpot/Zapier) — they're all cron
routes + the existing Resend/Stripe/Supabase wiring. Only reach for an external
automation tool once the contact volume or sequence complexity genuinely outgrows what a
handful of cron routes can express clearly.
