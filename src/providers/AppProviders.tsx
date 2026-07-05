import type { ReactNode } from 'react'
import { AuthProvider } from '@/providers/AuthProvider'
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
