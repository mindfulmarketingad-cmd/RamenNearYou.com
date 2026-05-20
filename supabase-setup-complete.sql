-- ============================================================
-- RamenNearYou.com — Complete Supabase Setup
-- Run this entire file in Supabase: Database > SQL Editor
-- It is safe to re-run (uses IF NOT EXISTS / OR REPLACE).
-- ============================================================


-- ─── user_profiles ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  bio          text,
  avatar_url   text,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.user_profiles FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.user_profiles FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON public.user_profiles FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Trigger: auto-create profile row on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── listings ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.listings (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name         text NOT NULL,
  address      text NOT NULL,
  city         text NOT NULL,
  state        text NOT NULL,
  zip          text,
  phone        text,
  website      text,
  description  text,
  broth_types  text[],
  hours        text,
  owner_name   text,
  owner_email  text,
  status       text NOT NULL DEFAULT 'pending',
  created_at   timestamptz DEFAULT now()
);

-- Add missing columns to existing table (safe if columns already exist)
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS broth_types text[];
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS hours text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS owner_name text;
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS owner_email text;

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Anyone can submit a listing'
  ) THEN
    CREATE POLICY "Anyone can submit a listing"
      ON public.listings FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Users can view their own listings'
  ) THEN
    CREATE POLICY "Users can view their own listings"
      ON public.listings FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;


-- ─── ambassador_applications ─────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ambassador_applications (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name         text NOT NULL,
  email        text NOT NULL,
  city         text,
  instagram    text,
  tiktok       text,
  why_apply    text,
  experience   text,
  status       text NOT NULL DEFAULT 'pending',
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.ambassador_applications ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.ambassador_applications ADD COLUMN IF NOT EXISTS why_apply text;
ALTER TABLE public.ambassador_applications ADD COLUMN IF NOT EXISTS experience text;

ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ambassador_applications' AND policyname = 'Anyone can submit ambassador application'
  ) THEN
    CREATE POLICY "Anyone can submit ambassador application"
      ON public.ambassador_applications FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;


-- ─── catering_leads ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.catering_leads (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name         text NOT NULL,
  email        text NOT NULL,
  phone        text,
  event_type   text,
  guest_count  text,
  event_date   text,
  location     text,
  budget       text,
  notes        text,
  status       text NOT NULL DEFAULT 'new',
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.catering_leads ADD COLUMN IF NOT EXISTS event_type text;
ALTER TABLE public.catering_leads ADD COLUMN IF NOT EXISTS guest_count text;
ALTER TABLE public.catering_leads ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.catering_leads ADD COLUMN IF NOT EXISTS budget text;
ALTER TABLE public.catering_leads ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.catering_leads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'catering_leads' AND policyname = 'Anyone can submit catering lead'
  ) THEN
    CREATE POLICY "Anyone can submit catering lead"
      ON public.catering_leads FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;


-- ─── claims ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.claims (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  restaurant_slug   text NOT NULL,
  restaurant_name   text,
  restaurant_city   text,
  contact_name      text,
  contact_email     text,
  contact_phone     text,
  message           text,
  status            text NOT NULL DEFAULT 'pending',
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE public.claims ADD COLUMN IF NOT EXISTS restaurant_city text;

ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'claims' AND policyname = 'Anyone can submit a claim'
  ) THEN
    CREATE POLICY "Anyone can submit a claim"
      ON public.claims FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'claims' AND policyname = 'Users can view own claims'
  ) THEN
    CREATE POLICY "Users can view own claims"
      ON public.claims FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;


-- ─── city_follows ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.city_follows (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  city_slug  text NOT NULL,
  state_slug text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, city_slug, state_slug)
);

ALTER TABLE public.city_follows ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'city_follows' AND policyname = 'Users can manage own city follows'
  ) THEN
    CREATE POLICY "Users can manage own city follows"
      ON public.city_follows FOR ALL
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;


-- ─── reviews ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.reviews (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_slug   text NOT NULL,
  user_id           uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_display_name text,
  rating            int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body              text,
  photos            text[] DEFAULT '{}',
  created_at        timestamptz DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Public reads reviews'
  ) THEN
    CREATE POLICY "Public reads reviews"
      ON public.reviews FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Auth users insert reviews'
  ) THEN
    CREATE POLICY "Auth users insert reviews"
      ON public.reviews FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Owners delete own reviews'
  ) THEN
    CREATE POLICY "Owners delete own reviews"
      ON public.reviews FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;


-- ─── restaurant_visits ──────────────────────────────────────
-- Tracks how many unique visitors have marked a restaurant as visited.
-- One row per (restaurant_slug, visitor_token) — token is a UUID stored in
-- the visitor's localStorage so anonymous users can also contribute.

CREATE TABLE IF NOT EXISTS public.restaurant_visits (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_slug text NOT NULL,
  visitor_token   text NOT NULL,
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (restaurant_slug, visitor_token)
);

CREATE INDEX IF NOT EXISTS restaurant_visits_slug_idx
  ON public.restaurant_visits (restaurant_slug);

ALTER TABLE public.restaurant_visits ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'restaurant_visits' AND policyname = 'Anyone can read visit counts'
  ) THEN
    CREATE POLICY "Anyone can read visit counts"
      ON public.restaurant_visits FOR SELECT
      USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'restaurant_visits' AND policyname = 'Anyone can record a visit'
  ) THEN
    CREATE POLICY "Anyone can record a visit"
      ON public.restaurant_visits FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;


-- ─── user_profiles extra columns ─────────────────────────────
-- The profile page edits these fields; ensure they all exist.

ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS instagram text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS tiktok text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS twitter text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS favorite_broth text;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS ramen_count int;
