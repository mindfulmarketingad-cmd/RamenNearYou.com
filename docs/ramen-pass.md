# Ramen Pass — removed from the site

The diner membership is no longer offered. Do not add checkout links, the
`/ramen-pass` page, upgrade prompts, trials, or welcome mail for it.

`/ramen-pass` and `/pass` redirect to `/`. Free accounts can still save
spots, check in, and make lists. Those are not a paid product.

Stripe products `prod_VZPEfXNWQaQTkd` (and the older unused Pass products)
can stay in the Stripe account. The Pass payment links are being deactivated
separately. `supabase/ramen-pass-membership.sql` is the historical schema;
`supabase/listing-subscriptions.sql` removes the save cap and the Pass
requirement on lists.
