import { supabase } from '@/supabase/client'
import { MAX_MESSAGE_LENGTH, MAX_NAME_LENGTH, TABLES, WISHES_PAGE_SIZE } from '@/supabase/constants'
import { toSupabaseError } from '@/supabase/errors'
import { rowToWishDoc, type WishRow } from '@/supabase/row-mappers'
import { sortWishes, wishToCongratulation } from '@/services/mappers'
import { getGraduateDoc } from '@/services/repositories/graduate.repository'
import { uploadImage } from '@/services/repositories/storage.repository'
import type { Congratulation, FirebaseErrorResponse, WishInput } from '@/types'

function validateWishInput(input: WishInput): void {
  const name = input.senderName?.trim()
  const message = input.message?.trim()

  if (!name) throw { code: 'validation/empty-name', message: 'الاسم مطلوب' }
  if (!message) throw { code: 'validation/empty-message', message: 'الرسالة مطلوبة' }
  if (name.length > MAX_NAME_LENGTH) {
    throw { code: 'validation/name-too-long', message: 'الاسم طويل جداً' }
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw { code: 'validation/message-too-long', message: 'الرسالة طويلة جداً' }
  }
}

function mapRowsToWishes(rows: WishRow[]): Congratulation[] {
  return sortWishes(rows.map((row) => wishToCongratulation(row.id, rowToWishDoc(row))))
}

async function fetchWishes(graduateId: string): Promise<Congratulation[]> {
  const { data, error } = await supabase
    .from(TABLES.wishes)
    .select('*')
    .eq('graduate_id', graduateId)
    .order('created_at', { ascending: false })
    .limit(WISHES_PAGE_SIZE)

  if (error) throw toSupabaseError(error)
  return mapRowsToWishes((data ?? []) as WishRow[])
}

export async function getWishes(graduateId: string): Promise<Congratulation[]> {
  return fetchWishes(graduateId)
}

export function listenToWishesRealTime(
  graduateId: string,
  onData: (wishes: Congratulation[]) => void,
  onError?: (error: FirebaseErrorResponse) => void,
): () => void {
  let cancelled = false

  async function load() {
    try {
      const wishes = await fetchWishes(graduateId)
      if (!cancelled) onData(wishes)
    } catch (err) {
      onError?.(toSupabaseError(err))
    }
  }

  load()

  const channel = supabase
    .channel(`wishes-${graduateId}-${crypto.randomUUID()}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.wishes,
        filter: `graduate_id=eq.${graduateId}`,
      },
      () => load(),
    )
    .subscribe()

  return () => {
    cancelled = true
    void supabase.removeChannel(channel)
  }
}

export async function addWish(
  graduateId: string,
  input: WishInput,
): Promise<Congratulation> {
  validateWishInput(input)

  const graduate = await getGraduateDoc(graduateId)
  if (!graduate) throw { code: 'not-found', message: 'صفحة التخرج غير موجودة' }
  if (!graduate.isOpen) throw { code: 'permission/wishes-closed', message: 'تم إغلاق التهاني مؤقتاً' }

  const wishId = crypto.randomUUID()
  let senderImage: string | undefined = input.senderImage

  if (input.imageFile) {
    senderImage = await uploadImage(
      input.imageFile,
      `graduates/${graduateId}/wishes/${wishId}/image.jpg`,
    )
  }

  const { error } = await supabase.from(TABLES.wishes).insert({
    id: wishId,
    graduate_id: graduateId,
    sender_name: input.senderName.trim(),
    message: input.message.trim(),
    sender_image: senderImage ?? null,
    likes: 0,
    is_pinned: false,
    mood: input.mood ?? null,
  })

  if (error) throw toSupabaseError(error)

  return {
    id: wishId,
    senderName: input.senderName.trim(),
    message: input.message.trim(),
    avatar: senderImage,
    createdAt: new Date(),
    likes: 0,
    isPinned: false,
    mood: input.mood,
  }
}

export async function likeWish(graduateId: string, wishId: string): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from(TABLES.wishes)
    .select('likes')
    .eq('id', wishId)
    .eq('graduate_id', graduateId)
    .single()

  if (fetchError) throw toSupabaseError(fetchError)

  const { error } = await supabase
    .from(TABLES.wishes)
    .update({ likes: (data.likes ?? 0) + 1 })
    .eq('id', wishId)
    .eq('graduate_id', graduateId)

  if (error) throw toSupabaseError(error)
}

export async function pinWish(
  graduateId: string,
  wishId: string,
  pinned = true,
): Promise<void> {
  const { error } = await supabase
    .from(TABLES.wishes)
    .update({ is_pinned: pinned })
    .eq('id', wishId)
    .eq('graduate_id', graduateId)

  if (error) throw toSupabaseError(error)
}

export async function deleteWish(graduateId: string, wishId: string): Promise<void> {
  const { error } = await supabase
    .from(TABLES.wishes)
    .delete()
    .eq('id', wishId)
    .eq('graduate_id', graduateId)

  if (error) throw toSupabaseError(error)
}
