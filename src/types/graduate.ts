import type { PlanTier, Visibility } from './common'

export interface GraduateDoc {
  name: string
  university: string
  major: string
  graduationYear: number
  profileImage: string
  coverImage?: string
  createdAt: string
  isOpen: boolean
  nameEn?: string
  universityEn?: string
  majorEn?: string
  visitorCount?: number
  todayVisitorCount?: number
  lastVisitDate?: string
  universityId?: string
  themeId?: string
  plan?: PlanTier
  isFeatured?: boolean
  visibility?: Visibility
  customColors?: GraduateThemeColors
  userId?: string
  publicBio?: string
  publicGallery?: string[]
}

export interface GraduateThemeColors {
  primary?: string
  accent?: string
  background?: string
}

export interface GraduateInput {
  name: string
  university: string
  major: string
  graduationYear: number
  profileImage: string
  coverImage?: string
  isOpen?: boolean
  nameEn?: string
  universityEn?: string
  majorEn?: string
  universityId?: string
  themeId?: string
  plan?: PlanTier
  visibility?: Visibility
  customColors?: GraduateThemeColors
  publicBio?: string
  publicGallery?: string[]
  userId?: string
}

export interface Student {
  name: string
  nameEn: string
  university: string
  universityEn: string
  major: string
  majorEn: string
  graduationYear: number
  profileImage: string
}

export interface Stats {
  totalCongratulations: number
  totalVisitors: number
  photosShared: number
  todaysWishes: number
  todayVisitors: number
  activeVisitors: number
}
