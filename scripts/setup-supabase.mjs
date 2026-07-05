#!/usr/bin/env node
/**
 * Verifies Supabase connection and prints setup instructions if tables are missing.
 * Run: node scripts/setup-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const url = process.env.VITE_SUPABASE_URL ?? 'https://dyxtqnsrkzuqvuuimmgx.supabase.co'
const key =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  'sb_publishable_3ItbzffN5wZN6kfRiKKKEg_IS4vOyR2'

const supabase = createClient(url, key)

console.log('🔗 Supabase URL:', url)

const { error: gradError } = await supabase.from('graduates').select('id').limit(1)

if (gradError?.code === 'PGRST205') {
  console.log('\n❌ الجداول غير موجودة بعد.\n')
  console.log('📋 خطوات الإعداد (مرة واحدة):')
  console.log('1. افتح: https://supabase.com/dashboard/project/dyxtqnsrkzuqvuuimmgx/sql/new')
  console.log('2. انسخ محتوى الملف: supabase/schema.sql')
  console.log('3. الصق في SQL Editor واضغط Run\n')
  console.log('--- schema.sql preview (first 5 lines) ---')
  const sql = readFileSync(join(__dirname, '../supabase/schema.sql'), 'utf8')
  console.log(sql.split('\n').slice(0, 8).join('\n'))
  console.log('...\n')
  process.exit(1)
}

if (gradError) {
  console.error('❌ خطأ:', gradError.message)
  process.exit(1)
}

console.log('✅ جدول graduates موجود')

const { data: buckets } = await supabase.storage.listBuckets()
const mediaBucket = buckets?.find((b) => b.name === 'media' || b.id === 'media')
console.log(mediaBucket ? '✅ bucket media موجود' : '⚠️  bucket media — شغّل schema.sql لإنشائه')

// Seed demo if empty
const { count } = await supabase.from('graduates').select('*', { count: 'exact', head: true })
if (count === 0) {
  console.log('📦 لا يوجد خريجون — شغّل npm run dev وافتح /graduate/noura-2026 للبذر التلقائي')
} else {
  console.log(`✅ ${count} خريج(ين) في القاعدة`)
}

console.log('\n🎉 Supabase جاهز!')
