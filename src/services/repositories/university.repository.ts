import { BUILT_IN_THEMES } from '@/lib/themes'
import type { Theme, University } from '@/types'

export async function getUniversity(_universityId: string): Promise<University | null> {
  return null
}

export async function listUniversities(_max = 100): Promise<University[]> {
  return []
}

export async function getThemeFromFirestore(_themeId: string): Promise<Theme | null> {
  return null
}

export async function listThemes(): Promise<Theme[]> {
  return Object.values(BUILT_IN_THEMES)
}
