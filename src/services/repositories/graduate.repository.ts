import { supabase } from '@/supabase/client'
import { TABLES } from '@/supabase/constants'
import { toSupabaseError } from '@/supabase/errors'
import {
  graduateInputToRow,
  graduateUpdatesToRow,
  rowToGraduateDoc,
  type GraduateRow,
} from '@/supabase/row-mappers'
import { graduateToStudent } from '@/services/mappers'
import type {
  FirebaseErrorResponse,
  GraduateDoc,
  GraduateInput,
  Student,
} from '@/types'

export interface GraduateListItem {
  id: string
  doc: GraduateDoc
}

export async function getGraduateDocByUserId(userId: string): Promise<(GraduateDoc & { id: string }) | null> {
  const { data, error } = await supabase
    .from(TABLES.graduates)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw toSupabaseError(error)
  if (!data) return null
  return { id: (data as GraduateRow).id, ...rowToGraduateDoc(data as GraduateRow) }
}

export async function createGraduateProfile(
  graduateId: string,
  input: GraduateInput,
): Promise<Student> {
  const row = graduateInputToRow(graduateId, input)
  const { error } = await supabase.from(TABLES.graduates).upsert(row)
  if (error) throw toSupabaseError(error)

  const created = await getGraduateProfile(graduateId)
  if (!created) throw { code: 'not-found', message: 'فشل إنشاء الملف الشخصي' }
  return created
}

export async function getGraduateProfile(graduateId: string): Promise<Student | null> {
  const doc = await getGraduateDoc(graduateId)
  if (!doc) return null
  return graduateToStudent(graduateId, doc)
}

export async function getGraduateDoc(graduateId: string): Promise<GraduateDoc | null> {
  const { data, error } = await supabase
    .from(TABLES.graduates)
    .select('*')
    .eq('id', graduateId)
    .maybeSingle()

  if (error) throw toSupabaseError(error)
  if (!data) return null
  return rowToGraduateDoc(data as GraduateRow)
}

export async function updateGraduateProfile(
  graduateId: string,
  updates: Partial<GraduateInput>,
): Promise<Student> {
  const row = graduateUpdatesToRow(updates)
  const { data: authData } = await supabase.auth.getUser()
  const authUserId = authData.user?.id

  let { data, error } = await supabase
    .from(TABLES.graduates)
    .update(row)
    .eq('id', graduateId)
    .select('id')
    .maybeSingle()

  if (error) throw toSupabaseError(error)

  // RLS may block silently — retry by linking account to page
  if (!data && authUserId) {
    const retry = await supabase
      .from(TABLES.graduates)
      .update({ ...row, user_id: authUserId })
      .eq('id', graduateId)
      .is('user_id', null)
      .select('id')
      .maybeSingle()

    if (retry.error) throw toSupabaseError(retry.error)
    data = retry.data
  }

  if (!data) {
    throw {
      code: 'permission/denied',
      message: 'لا صلاحية لحفظ التغييرات — تأكد من تسجيل الدخول وربط حسابك بالصفحة',
    }
  }

  const updated = await getGraduateProfile(graduateId)
  if (!updated) throw { code: 'not-found', message: 'الملف الشخصي غير موجود' }
  return updated
}

export async function setGraduateFeatured(
  graduateId: string,
  featured: boolean,
): Promise<void> {
  const { error } = await supabase
    .from(TABLES.graduates)
    .update({ is_featured: featured })
    .eq('id', graduateId)
  if (error) throw toSupabaseError(error)
}

export async function listGraduates(max = 200): Promise<GraduateListItem[]> {
  const { data, error } = await supabase
    .from(TABLES.graduates)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(max)

  if (error) throw toSupabaseError(error)
  return (data as GraduateRow[]).map((row) => ({
    id: row.id,
    doc: rowToGraduateDoc(row),
  }))
}

export function listenToGraduateProfile(
  graduateId: string,
  onData: (student: Student | null) => void,
  onError?: (error: FirebaseErrorResponse) => void,
): () => void {
  return listenToGraduateDoc(
    graduateId,
    (doc) => onData(doc ? graduateToStudent(graduateId, doc) : null),
    onError,
  )
}

export function listenToGraduateDoc(
  graduateId: string,
  onData: (doc: GraduateDoc | null) => void,
  onError?: (error: FirebaseErrorResponse) => void,
): () => void {
  let cancelled = false

  async function load() {
    try {
      const doc = await getGraduateDoc(graduateId)
      if (!cancelled) onData(doc)
    } catch (err) {
      onError?.(toSupabaseError(err))
    }
  }

  load()

  const channel = supabase
    .channel(`graduate-${graduateId}-${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.graduates,
        filter: `id=eq.${graduateId}`,
      },
      () => load(),
    )
    .subscribe()

  return () => {
    cancelled = true
    void supabase.removeChannel(channel)
  }
}

export async function incrementVisitorCount(graduateId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0]!
  const existing = await getGraduateDoc(graduateId)
  if (!existing) return

  const todayCount =
    existing.lastVisitDate === today ? (existing.todayVisitorCount ?? 0) + 1 : 1

  const { error } = await supabase
    .from(TABLES.graduates)
    .update({
      visitor_count: (existing.visitorCount ?? 0) + 1,
      today_visitor_count: todayCount,
      last_visit_date: today,
    })
    .eq('id', graduateId)

  if (error) throw toSupabaseError(error)
}
