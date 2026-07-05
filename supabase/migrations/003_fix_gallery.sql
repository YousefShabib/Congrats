-- Migration 003: Gallery + account linking fix
-- Run once in Supabase SQL Editor

ALTER TABLE graduates ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE graduates ADD COLUMN IF NOT EXISTS public_bio TEXT;
ALTER TABLE graduates ADD COLUMN IF NOT EXISTS public_gallery JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Storage bucket (required for all image uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
DROP POLICY IF EXISTS "media_public_upload" ON storage.objects;
DROP POLICY IF EXISTS "media_public_update" ON storage.objects;
CREATE POLICY "media_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media_public_upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "media_public_update" ON storage.objects FOR UPDATE USING (bucket_id = 'media');

-- Allow graduates to update their own page (or claim unlinked pages)
DROP POLICY IF EXISTS "graduates_update" ON graduates;
CREATE POLICY "graduates_update" ON graduates
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Link YOUR page to YOUR email (edit these two values):
-- UPDATE graduates g
-- SET user_id = u.id
-- FROM auth.users u
-- WHERE u.email = 'yousefshubib@gmail.com'
--   AND g.id = 'burqa';
