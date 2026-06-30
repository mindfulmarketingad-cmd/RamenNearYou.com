-- ──────────────────────────────────────────────────────────────────────────────
-- Admin RLS Policies & Owner Self-Link
--
-- Run this in your Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → paste → Run
--
-- REQUIRED: First set is_admin on your admin Supabase user:
--   Dashboard → Authentication → Users → click your admin user → Edit
--   Set "app_metadata" to: { "is_admin": true }
--   Save.
-- ──────────────────────────────────────────────────────────────────────────────

-- Helper function: returns true for users with is_admin = true in app_metadata
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean,
    false
  );
$$;

-- ── claims ────────────────────────────────────────────────────────────────────

-- Admin can read and manage all claims
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'claims' AND policyname = 'Admin manages all claims'
  ) THEN
    CREATE POLICY "Admin manages all claims"
      ON public.claims FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- Owner self-link: if an approved claim's contact_email matches the signed-in
-- user's email, they can update user_id to their own ID so they can edit the listing.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'claims' AND policyname = 'Owner email self-link'
  ) THEN
    CREATE POLICY "Owner email self-link"
      ON public.claims FOR UPDATE
      USING (contact_email = auth.email() AND status = 'approved')
      WITH CHECK (contact_email = auth.email() AND status = 'approved' AND user_id = auth.uid());
  END IF;
END $$;

-- ── listing_edit_requests ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.listing_edit_requests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_slug  text NOT NULL,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type             text NOT NULL,  -- 'info' | 'photo' | 'review_response'
  payload          jsonb NOT NULL DEFAULT '{}',
  status           text NOT NULL DEFAULT 'pending',  -- 'pending' | 'approved' | 'rejected'
  admin_note       text,
  created_at       timestamptz DEFAULT now(),
  reviewed_at      timestamptz
);

CREATE INDEX IF NOT EXISTS listing_edit_requests_slug_idx   ON public.listing_edit_requests (restaurant_slug);
CREATE INDEX IF NOT EXISTS listing_edit_requests_user_idx   ON public.listing_edit_requests (user_id);
CREATE INDEX IF NOT EXISTS listing_edit_requests_status_idx ON public.listing_edit_requests (status);

ALTER TABLE public.listing_edit_requests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'listing_edit_requests' AND policyname = 'Owners insert edit requests'
  ) THEN
    CREATE POLICY "Owners insert edit requests"
      ON public.listing_edit_requests FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'listing_edit_requests' AND policyname = 'Owners read own edit requests'
  ) THEN
    CREATE POLICY "Owners read own edit requests"
      ON public.listing_edit_requests FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'listing_edit_requests' AND policyname = 'Admin manages all edit requests'
  ) THEN
    CREATE POLICY "Admin manages all edit requests"
      ON public.listing_edit_requests FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- ── review_responses ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.review_responses (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id        uuid NOT NULL,
  restaurant_slug  text NOT NULL,
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response         text NOT NULL,
  created_at       timestamptz DEFAULT now(),
  UNIQUE(review_id)
);

CREATE INDEX IF NOT EXISTS review_responses_review_idx ON public.review_responses (review_id);
CREATE INDEX IF NOT EXISTS review_responses_slug_idx   ON public.review_responses (restaurant_slug);

ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'review_responses' AND policyname = 'Public reads review responses'
  ) THEN
    CREATE POLICY "Public reads review responses"
      ON public.review_responses FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'review_responses' AND policyname = 'Admin manages review responses'
  ) THEN
    CREATE POLICY "Admin manages review responses"
      ON public.review_responses FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

-- ── restaurant_overrides ──────────────────────────────────────────────────────

-- Admin can manage all overrides (needed for approving listing edits without service role key)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'restaurant_overrides' AND policyname = 'Admin manages all overrides'
  ) THEN
    CREATE POLICY "Admin manages all overrides"
      ON public.restaurant_overrides FOR ALL
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;
