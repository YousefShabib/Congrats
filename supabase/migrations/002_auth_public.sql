-- Migration 002: Auth + public profile fields
-- Run in Supabase SQL Editor after schema.sql

ALTER TABLE graduates ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE graduates ADD COLUMN IF NOT EXISTS public_bio TEXT;
ALTER TABLE graduates ADD COLUMN IF NOT EXISTS public_gallery JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS idx_graduates_user_id ON graduates(user_id) WHERE user_id IS NOT NULL;

DROP POLICY IF EXISTS "graduates_update_owner" ON graduates;
DROP POLICY IF EXISTS "graduates_insert" ON graduates;
DROP POLICY IF EXISTS "graduates_update" ON graduates;

CREATE POLICY "graduates_insert" ON graduates
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "graduates_update" ON graduates
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
