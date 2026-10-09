-- ──────────────────────────────────────────────────────────────────────────────
-- Curated city ramen guide orders
--
-- Run this in your Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste → Run
-- ──────────────────────────────────────────────────────────────────────────────

-- Email captured from the city-guide CTA, recorded before the buyer is sent to
-- Stripe. Fulfillment is human-in-the-loop: confirm the payment in Stripe, then
-- build that city's guide and email it to the buyer.
--
-- Rows land here whether or not the buyer completes checkout, so this doubles
-- as the email list — `status` separates paid buyers from people who bailed at
-- the Stripe page.
CREATE TABLE IF NOT EXISTS public.city_guide_orders (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text NOT NULL,
  city_slug    text,
  city_label   text,           -- "Ketchikan, AK" as shown on the page
  source_path  text,           -- page the request came from
  status       text NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid' | 'fulfilled' | 'cancelled'
  admin_note   text,
  created_at   timestamptz DEFAULT now(),
  fulfilled_at timestamptz
);

CREATE INDEX IF NOT EXISTS city_guide_orders_email_idx  ON public.city_guide_orders (email);
CREATE INDEX IF NOT EXISTS city_guide_orders_city_idx   ON public.city_guide_orders (city_slug);
CREATE INDEX IF NOT EXISTS city_guide_orders_status_idx ON public.city_guide_orders (status);

ALTER TABLE public.city_guide_orders ENABLE ROW LEVEL SECURITY;

-- Public CTA inserts requests (the server route uses the service-role key when
-- available; this policy is the fallback so captures are never lost).
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'city_guide_orders' AND policyname = 'Anyone can request a city guide'
  ) THEN
    CREATE POLICY "Anyone can request a city guide"
      ON public.city_guide_orders FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Admin reads + manages all requests (requires is_admin() from
-- admin-rls-policies.sql, or the service-role key which bypasses RLS).
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'city_guide_orders' AND policyname = 'Admin manages city guide orders'
  ) THEN
    CREATE POLICY "Admin manages city guide orders"
      ON public.city_guide_orders FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;
