export type ThemeSlug = 'luxury-gold' | 'royal' | 'minimal' | 'dark' | 'classic'

export interface ThemeDoc {
  name: string
  slug: ThemeSlug
  description?: string
  isPremium: boolean
  colors: ThemeColors
  previewImage?: string
}

export interface ThemeColors {
  primary: string
  accent: string
  background: string
  surface: string
  text: string
  muted: string
}

export interface Theme {
  id: string
  name: string
  slug: ThemeSlug
  isPremium: boolean
  colors: ThemeColors
}
