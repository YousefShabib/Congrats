export interface AnalyticsDoc {
  totalVisitors: number
  uniqueVisitors: number
  mostActiveDay: string
  mostSharedPlatform: string
  averageWishesPerDay: number
  imagesUploaded: number
  shareCounts?: Record<string, number>
  updatedAt?: string
}

export interface AnalyticsSummary {
  totalVisitors: number
  uniqueVisitors: number
  mostActiveDay: string
  mostSharedPlatform: string
  averageWishesPerDay: number
  imagesUploaded: number
  shareCounts: Record<string, number>
}

export const DEFAULT_ANALYTICS: AnalyticsSummary = {
  totalVisitors: 0,
  uniqueVisitors: 0,
  mostActiveDay: '—',
  mostSharedPlatform: '—',
  averageWishesPerDay: 0,
  imagesUploaded: 0,
  shareCounts: {},
}
