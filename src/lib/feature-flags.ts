import { FEATURE_MATRIX, type FeatureKey, type PlanTier } from '@/types'

export function canUseFeature(tier: PlanTier, feature: FeatureKey): boolean {
  return FEATURE_MATRIX[feature][tier] ?? false
}

export function getPlanFeatures(tier: PlanTier): FeatureKey[] {
  return (Object.keys(FEATURE_MATRIX) as FeatureKey[]).filter((f) =>
    FEATURE_MATRIX[f][tier],
  )
}

export const DASHBOARD_GRADUATE_KEY = 'congrats-dashboard-graduate-id'
