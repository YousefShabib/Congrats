import type { FirebaseErrorResponse } from '@/types'

const ERROR_MESSAGES: Record<string, string> = {
  'permission-denied': 'صلاحيات قاعدة البيانات غير مفعّلة. راجع Supabase RLS.',
  PGRST301: 'صلاحيات قاعدة البيانات غير مفعّلة. راجع Supabase RLS.',
  '42501': 'صلاحيات قاعدة البيانات غير مفعّلة. راجع Supabase RLS.',
  PGRST205: 'الجداول غير موجودة. شغّل supabase/schema.sql في SQL Editor.',
  'failed-precondition': 'فهرس قاعدة البيانات مطلوب.',
  unavailable: 'تعذّر الاتصال بقاعدة البيانات. تحقق من الإنترنت و Supabase.',
  'not-found': 'صفحة التخرج غير موجودة.',
}

export function toSupabaseError(error: unknown): FirebaseErrorResponse {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    const code = String((error as { code: string }).code)
    return {
      code,
      message: ERROR_MESSAGES[code] ?? String((error as { message: string }).message),
    }
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return { code: 'unknown', message: String((error as { message: string }).message) }
  }
  if (error instanceof Error) {
    return { code: 'unknown', message: error.message }
  }
  return { code: 'unknown', message: 'حدث خطأ غير متوقع' }
}

/** @deprecated alias for compatibility */
export const toFirebaseError = toSupabaseError

export function slugifyId(text: string): string {
  return (
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0600-\u06FF-]/g, '')
      .slice(0, 48) || `graduate-${Date.now()}`
  )
}
