import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { canUseFeature } from '@/lib/feature-flags'
import { FEATURE_MATRIX, type FeatureKey, type PlanTier } from '@/types'

interface FeatureFlagsContextValue {
  plan: PlanTier
  canUse: (feature: FeatureKey) => boolean
  features: FeatureKey[]
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | null>(null)

interface FeatureFlagsProviderProps {
  children: ReactNode
  plan?: PlanTier
}

export function FeatureFlagsProvider({ children, plan = 'free' }: FeatureFlagsProviderProps) {
  const canUse = useCallback((feature: FeatureKey) => canUseFeature(plan, feature), [plan])

  const features = useMemo(
    () => (Object.keys(FEATURE_MATRIX) as FeatureKey[]).filter((f) => canUse(f)),
    [canUse],
  )

  const value = useMemo(() => ({ plan, canUse, features }), [plan, canUse, features])

  return (
    <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>
  )
}

export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagsContext)
  if (!ctx) throw new Error('useFeatureFlags must be used within FeatureFlagsProvider')
  return ctx
}
