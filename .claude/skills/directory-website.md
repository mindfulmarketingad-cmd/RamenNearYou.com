# Directory Website Skill

Use this skill when working on RamenNearYou.com. It provides full context on the stack, data layer, conventions, and key files so you can make changes correctly without re-exploring the codebase each session.

---

## Stack

- **Framework**: Next.js (App Router, Turbopack) — all pages are in `app/`
- **Language**: TypeScript
- **Styling**: Tailwind CSS with a dark theme (`#2F323A` body, `#1E2026` cards, `#77567A` brand purple)
- **Database**: Supabase (Postgres + Auth + Row Level Security)
- **Auth**: `@supabase/ssr` — server components use `createClient()` from `lib/supabase/server.ts`, client components use `lib/supabase/client.ts`
- **Admin bypass**: `lib/supabase-admin.ts` — uses `SUPABASE_SERVICE_ROLE_KEY` to skip RLS; always prefer this in API routes
- **Email**: Resend (`RESEND_API_KEY` env var) — notifications sent to `ADMIN_EMAIL`
- **Maps**: Leaflet via dynamic import (`ssr: false`) in `components/ramen-map.tsx`
- **Payments**: Stripe — payment links hardcoded per tier in `app/featured/apply/featured-form.tsx`
- **Hosting**: Vercel (Team ID: `team_jULpSbO6SwzmLMpMm18nLtQP`, Project ID: `prj_hmiQhv7yv3e6NKADgciXRbro9k5t`)
- **Git branch**: `claude/fix-account-creation-hang-OcZTE`
- **Push command**: `git push -u origin claude/fix-account-creation-hang-OcZTE` (uses HTTPS token from env or credential helper)

---

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel | Admin client — bypasses RLS |
| `RESEND_API_KEY` | Vercel | Email notifications |
| `ADMIN_EMAIL` | Vercel | Where notification emails go |

---

## Restaurant Data

- **Source**: Static JSON files in `data/restaurants/` — one file per state (e.g. `data/restaurants/fl.json`)
- **Type definition**: `lib/restaurants.ts` — `Restaurant` interface; nullable fields: `rating: number | null`, `reviewsPerScore: Record<string,number> | null`, `hours: Record<string, string[]> | null`
- **Loading**: `getRestaurants()` merges all JSON files; `getRestaurantBySlug(slug)` for single lookup
- **Static generation**: `[city]/[state]/[restaurant]/page.tsx` uses `generateStaticParams()` + `dynamicParams = false`
- **Critical null guards** (breaks FL/NY/NJ/LA restaurants if missing):
  - `r.reviewsPerScore ? Object.values(r.reviewsPerScore)... : 0`
  - `{r.hours && Object.keys(r.hours).length > 0 && ...}`
  - `restaurant.hours?.[day]` in claim form

---

## SEO Internal Linking Structure

Every page must fit into this hierarchy and link **downward** to the next level:

```
Homepage (/)
  └── Service Pages  (/[service])          e.g. /tonkotsu-ramen-near-me, /vegan-ramen-near-me
        └── Service/City Pages  (/[service]/[city])  e.g. /tonkotsu/houston/texas
```

### Rules

1. **Homepage → Service pages**: The homepage must link to all top-level service pages (broth types, diet filters, etc.).
2. **Service pages → Service/City pages**: Each service page must link to its city-level variants.
3. **Service/City pages → back up**: Each service/city page must link back to its parent service page and to the base city page (`/[city]/[state]`).
4. **No orphan pages**: Every new page added must be reachable from at least one page one level above it. Update `sitemap.ts` and add in-page cross-links before considering the task done.
5. **City pages as hubs**: `/[city]/[state]` pages must link to all service/city pages available for that city (the "Browse by Type" section already does this via `getCityFilterLinks()`).

### Existing service pages

| Service | URL |
|---|---|
| Tonkotsu near me | `/tonkotsu-ramen-near-me` |
| Spicy near me | `/spicy-ramen-near-me` |
| Miso near me | `/miso-ramen-near-me` |
| Shoyu near me | `/shoyu-ramen-near-me` |
| Vegan near me | `/vegan-ramen-near-me` |
| Vegetarian near me | `/vegetarian-ramen-near-me` |
| Korean near me | `/korean-ramen-near-me` |
| Japanese near me | `/japanese-ramen-near-me` |
| Tonkotsu by city | `/tonkotsu/[city]/[state]` |
| City filter pages | `/[city]/[state]/[filter-slug]` |

### Checklist when adding a new page

- [ ] Page links to its parent (one level up)
- [ ] Parent page links down to this new page
- [ ] `sitemap.ts` includes the new URL(s)
- [ ] No dead-end — page has at least one outbound internal link to a sibling or child

---



| URL | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Homepage with featured restaurants |
| `/[city]/[state]` | `app/[city]/[state]/page.tsx` | City listing page |
| `/[city]/[state]/[restaurant]` | `app/[city]/[state]/[restaurant]/page.tsx` | Restaurant detail |
| `/searchmap` | `app/searchmap/page.tsx` | Interactive map with "Search this area" |
| `/profile` | `app/profile/page.tsx` | User profile — stats, saved, cities followed |
| `/saved` | `app/saved/page.tsx` | Redirects to `/profile` |
| `/cities` | `app/cities/page.tsx` | Browse cities |
| `/featured/apply` | `app/featured/apply/page.tsx` | 3-tier featured listing pricing |
| `/featured/success` | `app/featured/success/page.tsx` | Post-payment success |
| `/claim/[city]/[state]/[restaurant]` | `app/claim/.../page.tsx` | Claim a listing |
| `/ambassador` | `app/ambassador/page.tsx` | Ambassador application |
| `/add-restaurant` | `app/add-restaurant/page.tsx` | Submit new restaurant |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth callback — upserts user_profiles |

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/featured` | POST | Featured listing form → `listings` table + Resend email |
| `/api/claims` | POST | Claim form → `claims` table + Resend email |
| `/api/ambassador` | POST | Ambassador form → `ambassador_applications` table + Resend email |
| `/api/profile` | GET/PUT | Read/update `user_profiles` — uses admin client |
| `/api/city-follows` | GET/POST/DELETE | Follow/unfollow cities; GET with no params returns all follows for profile page |
| `/api/visits` | POST/GET | Record/count restaurant visits via `restaurant_visits` table |
| `/api/saves` | (legacy) | Saves are localStorage-only; this route may be unused |

**Rule**: Always use `createAdminClient()` in API routes, falling back to the session client only if admin client unavailable. Never write to Supabase from browser components directly.

---

## Supabase Tables

| Table | Purpose | RLS |
|---|---|---|
| `user_profiles` | Display name, bio, avatar, social links | Auth users only (admin client bypasses) |
| `listings` | Restaurant submissions | Anyone can INSERT; owner SELECT |
| `ambassador_applications` | Ambassador form | Anyone can INSERT |
| `catering_leads` | Catering inquiry form | Anyone can INSERT |
| `claims` | Restaurant claim requests | Anyone can INSERT; owner SELECT |
| `city_follows` | Cities a user follows | Authenticated users manage own rows |
| `reviews` | User reviews per restaurant | Public SELECT; auth INSERT/DELETE own |
| `restaurant_visits` | Visit tracking per (slug, visitor_token) | Public SELECT + INSERT |

**Schema file**: `supabase-setup-complete.sql` — safe to re-run, uses `IF NOT EXISTS`.

**Trigger**: `on_auth_user_created` auto-creates a `user_profiles` row on signup. The auth callback at `/auth/callback` also upserts it after email confirmation.

---

## Client-Side State (localStorage)

Saves and visits do **not** use Supabase from the browser — they use localStorage:

| Key | Managed by | Purpose |
|---|---|---|
| `ramennearyou:saves` | `lib/saves.ts` | Array of saved restaurant slugs |
| `ramennearyou:visits` | `lib/visits.ts` | Array of visited restaurant slugs |
| `ramennearyou:visitor-token` | `lib/visits.ts` | UUID stable per browser for anonymous visit tracking |

When visit is toggled ON, `lib/visits.ts` also POSTs to `/api/visits` to record in Supabase (for public counts). The count shown on restaurant pages is fetched server-side from `restaurant_visits`.

---

## Key Components

| File | Purpose |
|---|---|
| `components/ramen-map.tsx` | Leaflet map; exports `MapBounds` interface; `onUserMove` prop fires on `dragend`/`zoomend` only (not programmatic pans) |
| `components/visit-button.tsx` | "Mark Visited" toggle; reads localStorage, calls `/api/visits` |
| `components/save-button.tsx` | "Save" toggle; localStorage only |
| `components/share-button.tsx` | Native share / clipboard copy |
| `components/navbar.tsx` | Site nav |
| `components/footer.tsx` | Site footer |
| `app/profile/saved-section.tsx` | Client component — saved restaurants from localStorage |
| `app/profile/cities-section.tsx` | Client component — followed cities from `/api/city-follows` |

---

## Featured Listing Tiers

Three tiers at `app/featured/apply/featured-form.tsx`:

| Tier | Price | Stripe URL |
|---|---|---|
| City Featured | $29.99/mo | `stripeUrl` field in TIERS array |
| State Featured | $99.99/mo | `stripeUrl` field in TIERS array — **needs its own Stripe link** |
| Homepage Featured | $129.99/mo | `stripeUrl` field in TIERS array — **needs its own Stripe link** |

Current state: all three point to the same Stripe link. User needs to create 2 more products in Stripe and update the `stripeUrl` values.

---

## Common Patterns

### Adding a new form that writes to Supabase
1. Create an API route (`app/api/your-route/route.ts`)
2. Use `createAdminClient()` to bypass RLS
3. Return a 500 on DB error (don't swallow errors)
4. Send Resend notification email
5. Update `supabase-setup-complete.sql` with the new table

### Adding a new page
- Server component by default (no `'use client'`)
- Wrap with `<Navbar />` and `<Footer />`
- Use `bg-[#2F323A]` on the `<main>` element
- Cards use `bg-[#1E2026] border border-white/10 rounded-xl`

### Null safety for restaurant fields
Always guard `reviewsPerScore` and `hours` — they are `null` on newer restaurant imports (FL, NY, NJ, LA). Missing these guards causes runtime crashes on those pages.

### Deploying
1. Commit to branch `claude/fix-account-creation-hang-OcZTE`
2. Push using the HTTPS token URL above
3. Vercel auto-deploys on push
4. For env var changes: redeploy without build cache

---

## What NOT to do

- Do not write to Supabase tables directly from browser/client components — use API routes
- Do not use `Object.values(r.reviewsPerScore)` without null-checking first
- Do not use `Object.keys(r.hours)` without null-checking first
- Do not create a second admin client file — use `lib/supabase-admin.ts` only
- Do not push to `main` — always push to the feature branch above

---

## Google AdSense readiness (applies to EVERY site built)

Every site must pass AdSense review. Before launch (and after major changes), verify all of the following:

### Required infrastructure
- `public/ads.txt` with the publisher line: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
- `<meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">` in the root layout `<head>`
- AdSense loader script in the root layout `<head>` (use Next.js `<Script strategy="afterInteractive">`)
- `app/sitemap.ts` and `public/robots.txt` present; robots must not block content pages

### Required pages (all linked in the footer)
- Privacy Policy — must explicitly disclose Google AdSense, advertising cookies, and opt-out methods
- Terms of Service
- About page with real author/business info
- Contact page

### Content quality (most common rejection reason: "low value content")
- NO thin pages: every indexable page needs substantive, unique content (not just a map, address, or a bare list)
- NO orphan pages: every public page must be reachable through internal links (navbar, footer, or contextual links)
- NO placeholder, lorem-ipsum, or under-construction pages — delete them before launch
- NO deceptive content (fake phone numbers, fabricated credentials)
- Descriptive anchor text on internal links (e.g. "Tonkotsu Ramen Near Me", not "click here")
- Cookie consent banner with Google Consent Mode defaults (ad_storage denied until consent)

### Internal linking structure
- Footer links every major section: service pages, directories, legal pages, programs
- Service/category pages cross-link to sibling pages
- Hierarchy links up and down: Homepage > State > City > Filtered city pages
