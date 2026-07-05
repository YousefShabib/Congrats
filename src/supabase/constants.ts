export const TABLES = {
  graduates: 'graduates',
  wishes: 'wishes',
  analytics: 'graduate_analytics',
  aiInsights: 'graduate_ai_insights',
} as const

export const STORAGE_BUCKET = 'media'

export const WISHES_PAGE_SIZE = 100
export const MAX_MESSAGE_LENGTH = 1000
export const MAX_NAME_LENGTH = 100
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024
export const DEFAULT_GRADUATE_ID = import.meta.env.VITE_DEFAULT_GRADUATE_ID ?? 'noura-2026'
export const DEFAULT_THEME_ID = 'luxury-gold'

/** @deprecated use TABLES */
export const COLLECTIONS = {
  graduates: TABLES.graduates,
  wishes: TABLES.wishes,
  analytics: TABLES.analytics,
  universities: 'universities',
  themes: 'themes',
} as const
