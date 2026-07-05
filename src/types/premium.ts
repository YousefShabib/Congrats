import type { PlanTier } from './common'

export type FeatureKey =
  | 'liveWall'
  | 'liveEvent'
  | 'customTheme'
  | 'advancedAnalytics'
  | 'memoryBook'
  | 'removeBranding'
  | 'featuredListing'
  | 'multiplePages'

export type FeatureMatrix = Record<FeatureKey, Record<PlanTier, boolean>>

export const FEATURE_MATRIX: FeatureMatrix = {
  liveWall: { free: true, premium: true, enterprise: true },
  liveEvent: { free: true, premium: true, enterprise: true },
  customTheme: { free: false, premium: true, enterprise: true },
  advancedAnalytics: { free: false, premium: true, enterprise: true },
  memoryBook: { free: true, premium: true, enterprise: true },
  removeBranding: { free: false, premium: true, enterprise: true },
  featuredListing: { free: false, premium: false, enterprise: true },
  multiplePages: { free: false, premium: true, enterprise: true },
}

export interface SubscriptionPlan {
  tier: PlanTier
  label: string
  priceLabel: string
  features: FeatureKey[]
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: 'free',
    label: 'مجاني',
    priceLabel: '0 ر.س',
    features: ['liveWall', 'liveEvent', 'memoryBook'],
  },
  {
    tier: 'premium',
    label: 'بريميوم',
    priceLabel: '49 ر.س/شهر',
    features: ['liveWall', 'liveEvent', 'memoryBook', 'customTheme', 'advancedAnalytics', 'removeBranding', 'multiplePages'],
  },
  {
    tier: 'enterprise',
    label: 'مؤسسات',
    priceLabel: 'تواصل معنا',
    features: ['liveWall', 'liveEvent', 'memoryBook', 'customTheme', 'advancedAnalytics', 'removeBranding', 'multiplePages', 'featuredListing'],
  },
]
