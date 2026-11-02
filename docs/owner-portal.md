# Self-serve owner portal

Restaurant owners claim and manage their own listing at **/owner**; David
reviews the claims that can't be auto-verified at **/owner/admin**. The site
stays a static export (no Vercel functions): the pages run in the browser,
and every rule lives in Supabase (`supabase/owner-portal.sql`).

## How a claim works

1. The owner presses **Claim** on a listing page or on /claim-your-listing and
   lands on `/owner?claim=<slug>`.
2. They sign in with an emailed magic link or a 6-digit code, or with Google.
   Supabase only treats the email as verified once they've proven they own it.
3. They press **Claim this listing**. Then `claim_listing()` runs inside
   Postgres and compares the verified email domain with the listing's website
   host, which it reads from `listing_directory`, never from the browser:
   - **Approved instantly** when they match, e.g. `chef@okiboru.com` and
     `https://www.okiboru.com`. Subdomains on either side count too.
   - **Pending, so David reviews it**, in any of these cases:
     - a personal email (gmail, yahoo, outlook, icloud…)
     - no website on the listing
     - a website on a platform (facebook, instagram, yelp, toasttab,
       square.site, wix, linktree, doordash…)
     - a domain that doesn't match
4. A trigger on `claims` sends the emails through Resend:
   - **Approved:** the owner gets a welcome email with the dashboard link,
     what they can do, and the Featured/Premium offers.
   - **Pending:** David (`owner_portal_admins`) gets "Claim to review" with
     Approve/Reject links that open /owner/admin.
5. Approved owners can do the following on /owner:
   - edit the description, phone, website, menu link and hours. This goes
     through `save_listing_override()` into `restaurant_overrides`, which the
     build already applies.
   - see 30-day views, call taps, direction taps and review clicks from
     `ramennearyou_dashboard`.
   - upgrade through the Stripe links, with the slug passed as
     `client_reference_id`.

   Edits and the verified badge appear with the next production build. Daily
   is fine.

### Security

- The browser can't insert claims, change a claim's status or slug, or write
  `restaurant_overrides` directly. Guard triggers enforce this. They also close
  two older policy holes: anyone could insert an `approved` claim, and an owner
  could retarget their claim to another slug.
- The approve links in emails don't act by themselves. David still signs in
  and clicks Approve, so a mail scanner that pre-fetches links can't approve
  anything.
- A slug shared by locations with different websites (chains, generic names)
  gets no website in `listing_directory`, so its claims always go to review.

## One-time setup (Supabase dashboard)

Do these **in order**. Until step 4 the site falls back to the old email claim
automatically.

1. **Verify a sending domain in Resend.** Go to resend.com → Domains → Add
   `ramennearyou.com` and add the DNS records it shows. Then create an API key.
2. **Custom SMTP for sign-in emails.** Supabase's built-in mailer only delivers
   to your own team, so owners would never get their link. In Supabase →
   Authentication → Emails → SMTP settings, enter:
   - Host `smtp.resend.com`, port `465`
   - Username `resend`
   - Password = the Resend API key
   - Sender `hello@ramennearyou.com`, name `RamenNearYou`
3. **Redirect URLs.** In Authentication → URL Configuration:
   - Set Site URL to `https://www.ramennearyou.com`.
   - Add `https://www.ramennearyou.com/owner` and
     `https://www.ramennearyou.com/owner/admin` (or the wildcard
     `https://www.ramennearyou.com/owner**`).
   - Optional: add the magic link and OTP code to the email template. The code
     is `{{ .Token }}`.
4. **Run the SQL.** In SQL Editor, paste all of `supabase/owner-portal.sql`
   and run it. It's safe to re-run.
5. **Email secrets.** In SQL Editor:
   ```sql
   select vault.create_secret('re_YOUR_RESEND_KEY', 'resend_api_key');
   -- optional, defaults to this:
   select vault.create_secret('David at RamenNearYou <hello@ramennearyou.com>', 'rny_email_from');
   ```
6. **Fill the listing directory.** The next production build does it
   (`scripts/sync-listing-directory.mjs`). To do it now, run
   `SUPABASE_SERVICE_ROLE_KEY=… node scripts/sync-listing-directory.mjs --force`.

To add another reviewer, run:
`insert into owner_portal_admins(email) values ('someone@example.com');`
