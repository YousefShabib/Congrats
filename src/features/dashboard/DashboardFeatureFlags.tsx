import type { ReactNode } from 'react'
import { FeatureFlagsProvider } from '@/providers/FeatureFlagsProvider'
import { useDashboard } from '@/hooks/useDashboard'

export function DashboardFeatureFlags({ children }: { children: ReactNode }) {
  const { doc } = useDashboard()
  return <FeatureFlagsProvider plan={doc?.plan ?? 'free'}>{children}</FeatureFlagsProvider>
}
