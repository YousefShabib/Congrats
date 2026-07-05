import { supabase } from '@/supabase/client'
import { TABLES } from '@/supabase/constants'
import { toSupabaseError } from '@/supabase/errors'
import type { AIInsightsBundle } from '@/types/ai'

export async function getCachedInsights(
  graduateId: string,
  wishesHash: string,
): Promise<AIInsightsBundle | null> {
  const { data, error } = await supabase
    .from(TABLES.aiInsights)
    .select('wishes_hash, bundle')
    .eq('graduate_id', graduateId)
    .maybeSingle()

  if (error) throw toSupabaseError(error)
  if (!data || data.wishes_hash !== wishesHash) return null
  return data.bundle as AIInsightsBundle
}

export async function setCachedInsights(
  graduateId: string,
  wishesHash: string,
  bundle: AIInsightsBundle,
): Promise<void> {
  const { error } = await supabase.from(TABLES.aiInsights).upsert({
    graduate_id: graduateId,
    wishes_hash: wishesHash,
    bundle,
    updated_at: new Date().toISOString(),
  })

  if (error) throw toSupabaseError(error)
}
