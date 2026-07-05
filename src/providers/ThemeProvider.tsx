import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { applyThemeVariables, getThemeById } from '@/lib/themes'
import type { GraduateThemeColors, Theme } from '@/types'

interface ThemeContextValue {
  theme: Theme
  themeId: string
  customColors?: GraduateThemeColors
  setThemeId: (id: string) => void
  setCustomColors: (colors: GraduateThemeColors | undefined) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
  initialThemeId?: string
  initialCustomColors?: GraduateThemeColors
}

export function ThemeProvider({
  children,
  initialThemeId = 'luxury-gold',
  initialCustomColors,
}: ThemeProviderProps) {
  const [themeId, setThemeId] = useState(initialThemeId)
  const [customColors, setCustomColors] = useState<GraduateThemeColors | undefined>(
    initialCustomColors,
  )

  const theme = useMemo(() => {
    const base = getThemeById(themeId)
    if (!customColors) return base
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: customColors.primary ?? base.colors.primary,
        accent: customColors.accent ?? base.colors.accent,
        background: customColors.background ?? base.colors.background,
      },
    }
  }, [themeId, customColors])

  useEffect(() => {
    applyThemeVariables(theme)
  }, [theme])

  const value = useMemo(
    () => ({ theme, themeId, customColors, setThemeId, setCustomColors }),
    [theme, themeId, customColors],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider')
  return ctx
}

export function useTheme() {
  return useThemeContext()
}

export function useSetThemeFromGraduate(themeId?: string, customColors?: GraduateThemeColors) {
  const { setThemeId, setCustomColors } = useThemeContext()

  useEffect(() => {
    if (themeId) setThemeId(themeId)
    setCustomColors(customColors)
  }, [themeId, customColors, setThemeId, setCustomColors])
}
