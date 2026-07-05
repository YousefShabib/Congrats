import type { Theme, ThemeSlug } from '@/types'

export const BUILT_IN_THEMES: Record<ThemeSlug, Theme> = {
  'luxury-gold': {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    slug: 'luxury-gold',
    isPremium: false,
    colors: {
      primary: '#c9a962',
      accent: '#a68b4b',
      background: '#faf8f5',
      surface: '#fffdf9',
      text: '#2c2825',
      muted: '#8a8279',
    },
  },
  royal: {
    id: 'royal',
    name: 'Royal',
    slug: 'royal',
    isPremium: true,
    colors: {
      primary: '#6b4c9a',
      accent: '#4a3270',
      background: '#f8f6fc',
      surface: '#ffffff',
      text: '#1e1630',
      muted: '#7a6b8a',
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    slug: 'minimal',
    isPremium: false,
    colors: {
      primary: '#2c2825',
      accent: '#5a534c',
      background: '#ffffff',
      surface: '#f9f9f9',
      text: '#1a1a1a',
      muted: '#888888',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    slug: 'dark',
    isPremium: true,
    colors: {
      primary: '#c9a962',
      accent: '#e8d5a3',
      background: '#1a1816',
      surface: '#2c2825',
      text: '#faf8f5',
      muted: '#8a8279',
    },
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    slug: 'classic',
    isPremium: false,
    colors: {
      primary: '#1e3a5f',
      accent: '#c9a962',
      background: '#f5f0e8',
      surface: '#fffef9',
      text: '#1e3a5f',
      muted: '#6b7280',
    },
  },
}

export const THEME_LIST = Object.values(BUILT_IN_THEMES)

export function getThemeById(id?: string): Theme {
  const slug = (id ?? 'luxury-gold') as ThemeSlug
  return BUILT_IN_THEMES[slug] ?? BUILT_IN_THEMES['luxury-gold']
}

export function applyThemeVariables(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--theme-primary', theme.colors.primary)
  root.style.setProperty('--theme-accent', theme.colors.accent)
  root.style.setProperty('--theme-bg', theme.colors.background)
  root.style.setProperty('--theme-surface', theme.colors.surface)
  root.style.setProperty('--theme-text', theme.colors.text)
  root.style.setProperty('--theme-muted', theme.colors.muted)
}
