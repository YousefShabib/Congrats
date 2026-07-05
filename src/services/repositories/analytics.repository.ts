import { supabase } from '@/supabase/client'
import { TABLES } from '@/supabase/constants'
import { toSupabaseError } from '@/supabase/errors'
import { DEFAULT_ANALYTICS, type AnalyticsSummary } from '@/types'

interface AnalyticsRow {
  graduate_id: string
  total_visitors: number
  unique_visitors: number
  most_active_day: string
  most_shared_platform: string
  average_wishes_per_day: number
  images_uploaded: number
  share_counts: Record<string, number>
  updated_at: string
}

function rowToSummary(row: AnalyticsRow): AnalyticsSummary {
  return {
    totalVisitors: row.total_visitors,
    uniqueVisitors: row.unique_visitors,
    mostActiveDay: row.most_active_day,
    mostSharedPlatform: row.most_shared_platform,
    averageWishesPerDay: row.average_wishes_per_day,
    imagesUploaded: row.images_uploaded,
    shareCounts: row.share_counts ?? {},
  }
}

function summaryToRow(graduateId: string, summary: AnalyticsSummary) {
  return {
    graduate_id: graduateId,
    total_visitors: summary.totalVisitors,
    unique_visitors: summary.uniqueVisitors,
    most_active_day: summary.mostActiveDay,
    most_shared_platform: summary.mostSharedPlatform,
    average_wishes_per_day: summary.averageWishesPerDay,
    images_uploaded: summary.imagesUploaded,
    share_counts: summary.shareCounts,
    updated_at: new Date().toISOString(),
  }
}

export async function getAnalytics(graduateId: string): Promise<AnalyticsSummary> {
  const { data, error } = await supabase
    .from(TABLES.analytics)
    .select('*')
    .eq('graduate_id', graduateId)
    .maybeSingle()

  if (error) throw toSupabaseError(error)
  if (!data) return DEFAULT_ANALYTICS
  return rowToSummary(data as AnalyticsRow)
}

export async function upsertAnalytics(
  graduateId: string,
  updates: Partial<AnalyticsSummary>,
): Promise<void> {
  const current = await getAnalytics(graduateId)
  const merged = { ...current, ...updates }
  const row = summaryToRow(graduateId, merged)

  const { error } = await supabase.from(TABLES.analytics).upsert(row)
  if (error) throw toSupabaseError(error)
}

export async function recordSharePlatform(
  graduateId: string,
  platform: string,
): Promise<void> {
  const current = await getAnalytics(graduateId)
  const shareCounts = { ...current.shareCounts, [platform]: (current.shareCounts[platform] ?? 0) + 1 }
  const mostSharedPlatform =
    Object.entries(shareCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? platform

  await upsertAnalytics(graduateId, { shareCounts, mostSharedPlatform })
}

export function computeAnalyticsFromWishes(
  wishesCount: number,
  imagesCount: number,
  visitorCount: number,
): Partial<AnalyticsSummary> {
  const daysActive = Math.max(1, Math.ceil(wishesCount / 3))
  return {
    totalVisitors: visitorCount,
    uniqueVisitors: Math.round(visitorCount * 0.72),
    averageWishesPerDay: Math.round((wishesCount / daysActive) * 10) / 10,
    imagesUploaded: imagesCount,
    mostActiveDay: new Date().toLocaleDateString('ar-SA', { weekday: 'long' }),
  }
}
