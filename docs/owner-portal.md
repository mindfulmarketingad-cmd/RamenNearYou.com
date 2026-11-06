# Self-serve owner portal

Restaurant owners claim and manage their listing at **/owner**. The site
stays a static export (no Vercel functions): the pages run in the browser,
and every rule lives in Supabase. Run `supabase/owner-portal.sql`, then
`supabase/listing-subscriptions.sql`. The second file is the one that makes
claiming paid and automatic. If you re-run the first file, run the second
again afterwards.

## How a claim works

1. The owner presses **Claim** on a listing page or on /claim-your-listing and
   lands on `/owner?claim=<slug>`.
2. They sign in with an emailed magic link or a 6-digit code, or with Google.
   Supabase only treats the email as verified once they've proven they own it.
   **Auth email only reaches the public after custom SMTP is set** (below).
   That setup is separate from the claim and welcome mail.
3. They subscribe at **$49.99/month**
   (https://buy.stripe.com/5kQaEY3LY7gQ3wi6dwfrW0A, no trial). The link sends
   `client_reference_id` as the restaurant slug and prefills their sign-in
   email. Stripe returns them to `/owner?session_id={CHECKOUT_SESSION_ID}`.
4. `listing_claim_session()` checks the session in Stripe and **approves the
   claim immediately**. There is no pending review and no email asking David
   to approve anyone.
5. A trigger on `claims` sends the welcome email through Resend (vault secret
   `resend_api_key`): dashboard link, what they can edit, analytics, and the
   Featured ($29) and Premium ($79) add-ons. It is signed David / RamenNearYou.
6. Approved owners on /owner can:
   - edit the description, phone, website, menu link and hours
     (`save_listing_override()` → `restaurant_overrides`; the build applies them)
   - see 30-day views, call taps, direction taps and review clicks
   - add Featured or Premium. Those checkout links also return to `/owner`,
     and the perk shows on the site from `listing_placements()` without a deploy
   - open Stripe billing to cancel

   Listing-detail edits appear with the next production build. The verified
   badge, Featured pin and Premium box do not wait on that build.

Claims that were already approved before subscriptions (`source` is null)
keep the dashboard. New claims are `source = 'stripe'` and lose the
dashboard when the subscription lapses. A second owner cannot take a listing
that is already approved.

### Security

- The browser can't insert claims, change a claim's status or slug, or write
  `restaurant_overrides` or `listing_subscriptions` directly.
- The signed-in email must match the email on the Stripe Checkout Session.
- A slug shared by locations with different websites gets no website in
  `listing_directory`. That no longer blocks a claim; payment is the check.

## One-time setup (Supabase dashboard)

Do these **in order**.

1. **Verify a sending domain in Resend.** Go to resend.com → Domains → Add
   `ramennearyou.com` and add the DNS records it shows. Then create an API key.
   The vault secret `resend_api_key` is already stored. Welcome mail uses it.
2. **Custom SMTP for sign-in emails.** Supabase's built-in mailer only delivers
   to the team, so owners do not get magic links until this is set. In
   Supabase → Authentication → Emails → SMTP settings:
   - Host `smtp.resend.com`, port `465`
   - Username `resend`
   - Password = the Resend API key
   - Sender `hello@ramennearyou.com`, name `RamenNearYou`
3. **Redirect URLs.** In Authentication → URL Configuration:
   - Site URL `https://www.ramennearyou.com`
   - Add `https://www.ramennearyou.com/owner` and
     `https://www.ramennearyou.com/owner/admin` (or
     `https://www.ramennearyou.com/owner**`)
   - The email code is `{{ .Token }}`
4. **Run the SQL.** In the SQL editor, run `supabase/owner-portal.sql`, then
   `supabase/listing-subscriptions.sql`. Both are safe to re-run. Run the
   listing file last.
5. **Stripe secret.** `stripe_secret_key` is already in Vault. If it is
   rotated, update that secret. Do not put it in the site.
6. **Email from-address** (optional, this is the default):
   ```sql
   select vault.create_secret('David at RamenNearYou <hello@ramennearyou.com>', 'rny_email_from');
   ```
7. **Fill the listing directory.** The next production build does it
   (`scripts/sync-listing-directory.mjs`).

`/owner/admin` can still list claims. New claims do not wait there.

## Featured and Premium payment links

Point their success URL at
`https://www.ramennearyou.com/owner?session_id={CHECKOUT_SESSION_ID}`
if it is not already. The dashboard also scans recent Checkout Sessions for
the signed-in email, so placement still turns on when the owner opens
`/owner` after paying.
