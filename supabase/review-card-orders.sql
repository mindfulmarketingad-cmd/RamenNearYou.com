-- ──────────────────────────────────────────────────────────────────────────────
-- Google Review Card orders + QR scan tracking
--
-- Run this in your Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste → Run
-- ──────────────────────────────────────────────────────────────────────────────

-- Orders placed from /review-cards. Fulfillment is human-in-the-loop:
-- you confirm payment in Stripe, then mark the order fulfilled in
-- /admin/review-cards and send the buyer their print link.
CREATE TABLE IF NOT EXISTS public.review_card_orders (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_slug  text NOT NULL,
  restaurant_name  text NOT NULL,
  city             text,
  state_code       text,
  buyer_name       text,
  buyer_email      text NOT NULL,
  status           text NOT NULL DEFAULT 'pending',  -- 'pending' | 'fulfilled' | 'cancelled'
  admin_note       text,
  created_at       timestamptz DEFAULT now(),
  fulfilled_at     timestamptz
);

CREATE INDEX IF NOT EXISTS review_card_orders_slug_idx   ON public.review_card_orders (restaurant_slug);
CREATE INDEX IF NOT EXISTS review_card_orders_status_idx ON public.review_card_orders (status);

ALTER TABLE public.review_card_orders ENABLE ROW LEVEL SECURITY;

-- Public checkout form inserts orders (server route uses the service-role key
-- when available; this policy is the fallback so orders are never lost).
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'review_card_orders' AND policyname = 'Anyone can create review card orders'
  ) THEN
    CREATE POLICY "Anyone can create review card orders"
      ON public.review_card_orders FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Admin reads + manages all orders (requires is_admin() from admin-rls-policies.sql,
-- or the service-role key which bypasses RLS entirely).
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'review_card_orders' AND policyname = 'Admin manages review card orders'
  ) THEN
    CREATE POLICY "Admin manages review card orders"
      ON public.review_card_orders FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- One row per QR scan of /r/{slug} — powers per-restaurant scan analytics
-- (and is the future enforcement/value lever if the product goes recurring).
CREATE TABLE IF NOT EXISTS public.review_card_scans (
  id               bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  restaurant_slug  text NOT NULL,
  scanned_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS review_card_scans_slug_idx ON public.review_card_scans (restaurant_slug, scanned_at);

ALTER TABLE public.review_card_scans ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'review_card_scans' AND policyname = 'Anyone can record scans'
  ) THEN
    CREATE POLICY "Anyone can record scans"
      ON public.review_card_scans FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'review_card_scans' AND policyname = 'Admin reads scans'
  ) THEN
    CREATE POLICY "Admin reads scans"
      ON public.review_card_scans FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;
