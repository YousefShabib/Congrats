import { supabase } from '@/supabase/client'
import { TABLES, DEFAULT_THEME_ID } from '@/supabase/constants'
import { toSupabaseError } from '@/supabase/errors'
import { graduateInputToRow } from '@/supabase/row-mappers'
import type { GraduateInput } from '@/types'
import { student, initialCongratulations } from '@/utils/mockData'

export async function seedDemoGraduate(graduateId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from(TABLES.graduates)
    .select('id')
    .eq('id', graduateId)
    .maybeSingle()

  if (existing) return false

  const graduateInput: GraduateInput = {
    name: student.name,
    university: student.university,
    major: student.major,
    graduationYear: student.graduationYear,
    profileImage: student.profileImage,
    isOpen: true,
    nameEn: student.nameEn,
    universityEn: student.universityEn,
    majorEn: student.majorEn,
    themeId: DEFAULT_THEME_ID,
    plan: 'free',
    visibility: 'public',
  }

  const row = graduateInputToRow(graduateId, graduateInput)
  const { error: gradError } = await supabase.from(TABLES.graduates).insert(row)
  if (gradError) throw toSupabaseError(gradError)

  const wishes = initialCongratulations.map((wish) => ({
    graduate_id: graduateId,
    sender_name: wish.senderName,
    message: wish.message,
    sender_image: wish.avatar ?? null,
    likes: 0,
    is_pinned: false,
    mood: null,
  }))

  const { error: wishesError } = await supabase.from(TABLES.wishes).insert(wishes)
  if (wishesError) throw toSupabaseError(wishesError)

  return true
}
