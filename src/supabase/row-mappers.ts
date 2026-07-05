import type { GraduateDoc, GraduateInput, WishDoc } from '@/types'
import type { PlanTier, Visibility } from '@/types/common'

export interface GraduateRow {
  id: string
  name: string
  university: string
  major: string
  graduation_year: number
  profile_image: string
  cover_image: string | null
  is_open: boolean
  name_en: string | null
  university_en: string | null
  major_en: string | null
  visitor_count: number
  today_visitor_count: number
  last_visit_date: string | null
  university_id: string | null
  theme_id: string
  plan: string
  is_featured: boolean
  visibility: string
  custom_colors: GraduateDoc['customColors'] | null
  user_id: string | null
  public_bio: string | null
  public_gallery: string[] | null
  created_at: string
}

export interface WishRow {
  id: string
  graduate_id: string
  sender_name: string
  message: string
  sender_image: string | null
  likes: number
  is_pinned: boolean
  mood: string | null
  created_at: string
}

export function rowToGraduateDoc(row: GraduateRow): GraduateDoc {
  return {
    name: row.name,
    university: row.university,
    major: row.major,
    graduationYear: row.graduation_year,
    profileImage: row.profile_image,
    coverImage: row.cover_image ?? undefined,
    createdAt: row.created_at,
    isOpen: row.is_open,
    nameEn: row.name_en ?? undefined,
    universityEn: row.university_en ?? undefined,
    majorEn: row.major_en ?? undefined,
    visitorCount: row.visitor_count,
    todayVisitorCount: row.today_visitor_count,
    lastVisitDate: row.last_visit_date ?? undefined,
    universityId: row.university_id ?? undefined,
    themeId: row.theme_id,
    plan: row.plan as PlanTier,
    isFeatured: row.is_featured,
    visibility: row.visibility as Visibility,
    customColors: row.custom_colors ?? undefined,
    userId: row.user_id ?? undefined,
    publicBio: row.public_bio ?? undefined,
    publicGallery: Array.isArray(row.public_gallery) ? row.public_gallery : [],
  }
}

export function rowToWishDoc(row: WishRow): WishDoc {
  return {
    senderName: row.sender_name,
    message: row.message,
    senderImage: row.sender_image ?? undefined,
    createdAt: row.created_at,
    likes: row.likes,
    isPinned: row.is_pinned,
    mood: (row.mood as WishDoc['mood']) ?? undefined,
  }
}

export function graduateInputToRow(id: string, input: GraduateInput): Partial<GraduateRow> {
  return {
    id,
    name: input.name,
    university: input.university,
    major: input.major,
    graduation_year: input.graduationYear,
    profile_image: input.profileImage,
    cover_image: input.coverImage ?? null,
    is_open: input.isOpen ?? true,
    name_en: input.nameEn ?? null,
    university_en: input.universityEn ?? null,
    major_en: input.majorEn ?? null,
    university_id: input.universityId ?? null,
    theme_id: input.themeId ?? 'luxury-gold',
    plan: input.plan ?? 'free',
    visibility: input.visibility ?? 'public',
    custom_colors: input.customColors ?? null,
    user_id: input.userId ?? null,
    public_bio: input.publicBio ?? null,
    public_gallery: input.publicGallery ?? [],
    is_featured: false,
    visitor_count: 0,
    today_visitor_count: 0,
  }
}

export function graduateUpdatesToRow(updates: Partial<GraduateInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (updates.name !== undefined) row.name = updates.name
  if (updates.university !== undefined) row.university = updates.university
  if (updates.major !== undefined) row.major = updates.major
  if (updates.graduationYear !== undefined) row.graduation_year = updates.graduationYear
  if (updates.profileImage !== undefined) row.profile_image = updates.profileImage
  if (updates.coverImage !== undefined) row.cover_image = updates.coverImage
  if (updates.isOpen !== undefined) row.is_open = updates.isOpen
  if (updates.nameEn !== undefined) row.name_en = updates.nameEn
  if (updates.universityEn !== undefined) row.university_en = updates.universityEn
  if (updates.majorEn !== undefined) row.major_en = updates.majorEn
  if (updates.universityId !== undefined) row.university_id = updates.universityId
  if (updates.themeId !== undefined) row.theme_id = updates.themeId
  if (updates.plan !== undefined) row.plan = updates.plan
  if (updates.visibility !== undefined) row.visibility = updates.visibility
  if (updates.customColors !== undefined) row.custom_colors = updates.customColors
  if (updates.publicBio !== undefined) row.public_bio = updates.publicBio
  if (updates.publicGallery !== undefined) row.public_gallery = updates.publicGallery
  if (updates.userId !== undefined) row.user_id = updates.userId
  return row
}
