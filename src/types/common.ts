export interface FirebaseErrorResponse {
  code: string
  message: string
}

export type PlanTier = 'free' | 'premium' | 'enterprise'
export type Visibility = 'public' | 'unlisted' | 'private'
