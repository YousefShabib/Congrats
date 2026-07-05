export type {
  FirebaseErrorResponse,
  PlanTier,
  Visibility,
} from './common'

export type {
  GraduateDoc,
  GraduateInput,
  GraduateThemeColors,
  Student,
  Stats,
} from './graduate'

export type {
  WishDoc,
  WishInput,
  Congratulation,
  WishSubmitPayload,
  WishMood,
} from './wish'

export type {
  AnalyticsDoc,
  AnalyticsSummary,
} from './analytics'
export { DEFAULT_ANALYTICS } from './analytics'

export type { UniversityDoc, University } from './university'

export type { ThemeDoc, Theme, ThemeColors, ThemeSlug } from './theme'

export type {
  AIProviderName,
  SentimentCategory,
  ThankYouTone,
  AIWishTagCategory,
  AIWishInput,
  AIKeyword,
  AISentimentBucket,
  AIBestWish,
  AIInsightStats,
  AIWishTag,
  AIInsightsBundle,
  AIInsightsCacheDoc,
  AISearchResult,
  GenerateInsightsRequest,
  GenerateThankYouRequest,
  SmartSearchRequest,
  MemoryStoryRequest,
} from './ai'

export type {
  FeatureKey,
  FeatureMatrix,
  SubscriptionPlan,
} from './premium'
export { FEATURE_MATRIX, SUBSCRIPTION_PLANS } from './premium'

// Legacy re-exports from firebase.ts types file
export type { FirebaseErrorResponse as FirebaseError } from './common'
