-- Congrats Platform — Supabase Schema
-- Run in Supabase Dashboard → SQL Editor → New query → Run

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Graduates ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS graduates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  university TEXT NOT NULL,
  major TEXT NOT NULL,
  graduation_year INT NOT NULL,
  profile_image TEXT NOT NULL,
  cover_image TEXT,
  is_open BOOLEAN NOT NULL DEFAULT true,
  name_en TEXT,
  university_en TEXT,
  major_en TEXT,
  visitor_count INT NOT NULL DEFAULT 0,
  today_visitor_count INT NOT NULL DEFAULT 0,
  last_visit_date TEXT,
  university_id TEXT,
  theme_id TEXT NOT NULL DEFAULT 'luxury-gold',
  plan TEXT NOT NULL DEFAULT 'free',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  visibility TEXT NOT NULL DEFAULT 'public',
  custom_colors JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  public_bio TEXT,
  public_gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_graduates_created_at ON graduates (created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_graduates_user_id ON graduates(user_id) WHERE user_id IS NOT NULL;

-- ─── Wishes ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  graduate_id TEXT NOT NULL REFERENCES graduates (id) ON DELETE CASCADE,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_image TEXT,
  likes INT NOT NULL DEFAULT 0,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  mood TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishes_graduate_created ON wishes (graduate_id, created_at DESC);

-- ─── Analytics ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS graduate_analytics (
  graduate_id TEXT PRIMARY KEY REFERENCES graduates (id) ON DELETE CASCADE,
  total_visitors INT NOT NULL DEFAULT 0,
  unique_visitors INT NOT NULL DEFAULT 0,
  most_active_day TEXT NOT NULL DEFAULT '—',
  most_shared_platform TEXT NOT NULL DEFAULT '—',
  average_wishes_per_day FLOAT NOT NULL DEFAULT 0,
  images_uploaded INT NOT NULL DEFAULT 0,
  share_counts JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── AI Insights Cache ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS graduate_ai_insights (
  graduate_id TEXT PRIMARY KEY REFERENCES graduates (id) ON DELETE CASCADE,
  wishes_hash TEXT NOT NULL,
  bundle JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Row Level Security (public MVP — tighten with Auth later) ───────────────
ALTER TABLE graduates ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduate_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE graduate_ai_insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "graduates_select" ON graduates;
DROP POLICY IF EXISTS "graduates_insert" ON graduates;
DROP POLICY IF EXISTS "graduates_update" ON graduates;
CREATE POLICY "graduates_select" ON graduates FOR SELECT USING (true);
CREATE POLICY "graduates_insert" ON graduates FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "graduates_update" ON graduates FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "wishes_select" ON wishes;
DROP POLICY IF EXISTS "wishes_insert" ON wishes;
DROP POLICY IF EXISTS "wishes_update" ON wishes;
DROP POLICY IF EXISTS "wishes_delete" ON wishes;
CREATE POLICY "wishes_select" ON wishes FOR SELECT USING (true);
CREATE POLICY "wishes_insert" ON wishes FOR INSERT WITH CHECK (true);
CREATE POLICY "wishes_update" ON wishes FOR UPDATE USING (true);
CREATE POLICY "wishes_delete" ON wishes FOR DELETE USING (true);

DROP POLICY IF EXISTS "analytics_all" ON graduate_analytics;
CREATE POLICY "analytics_all" ON graduate_analytics FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "ai_insights_all" ON graduate_ai_insights;
CREATE POLICY "ai_insights_all" ON graduate_ai_insights FOR ALL USING (true) WITH CHECK (true);

-- ─── Realtime (safe re-run) ───────────────────────────────────────────────────
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE wishes;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE graduates;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ─── Storage bucket for images ───────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "media_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "media_public_update" ON storage.objects;
CREATE POLICY "media_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media_public_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "media_public_update" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
