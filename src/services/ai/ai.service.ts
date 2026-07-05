import type { Congratulation } from '@/types'
import type {
  AIInsightsBundle,
  AIWishInput,
  AISearchResult,
  ThankYouTone,
} from '@/types/ai'
import { fetchAIInsights, fetchMemoryStory, fetchSmartSearch, fetchThankYouMessage, isAIAvailable } from '@/services/ai/ai.client'
import { getCachedInsights, setCachedInsights } from '@/services/ai/ai.cache.repository'
import {
  generateLocalInsights,
  generateLocalMemoryStory,
  generateLocalThankYou,
  localSmartSearch,
} from '@/services/ai/fallback.insights'
import { computeWishesHash } from '@/services/ai/hash'

function toWishInputs(wishes: Congratulation[]): AIWishInput[] {
  return wishes.map((w) => ({
    id: w.id,
    senderName: w.senderName,
    message: w.message,
    mood: w.mood,
  }))
}

export async function getAIInsights(
  graduateId: string,
  graduateName: string,
  wishes: Congratulation[],
): Promise<AIInsightsBundle> {
  const inputs = toWishInputs(wishes)
  const wishesHash = computeWishesHash(inputs)

  const cached = await getCachedInsights(graduateId, wishesHash)
  if (cached) return cached

  if (isAIAvailable() && wishes.length > 0) {
    try {
      const bundle = await fetchAIInsights({
        graduateId,
        graduateName,
        wishes: inputs,
        wishesHash,
      })
      await setCachedInsights(graduateId, wishesHash, bundle)
      return bundle
    } catch {
      /* fall through to local */
    }
  }

  const local = generateLocalInsights(wishes, graduateName)
  await setCachedInsights(graduateId, wishesHash, local).catch(() => {})
  return local
}

export async function generateThankYou(
  graduateId: string,
  graduateName: string,
  wishes: Congratulation[],
  tone: ThankYouTone,
): Promise<string> {
  const inputs = toWishInputs(wishes)

  if (isAIAvailable() && wishes.length > 0) {
    try {
      const { message } = await fetchThankYouMessage({
        graduateId,
        graduateName,
        wishes: inputs,
        tone,
      })
      return message
    } catch {
      /* fallback */
    }
  }

  return generateLocalThankYou(graduateName, tone, wishes.length)
}

export async function smartSearch(
  graduateId: string,
  query: string,
  wishes: Congratulation[],
): Promise<AISearchResult> {
  const inputs = toWishInputs(wishes)

  if (isAIAvailable() && query.trim()) {
    try {
      return await fetchSmartSearch({ graduateId, query, wishes: inputs })
    } catch {
      /* fallback */
    }
  }

  return localSmartSearch(query, inputs)
}

export async function generateMemoryStory(
  graduateId: string,
  graduateName: string,
  wishes: Congratulation[],
  university?: string,
  major?: string,
): Promise<string> {
  const inputs = toWishInputs(wishes)

  if (isAIAvailable() && wishes.length > 0) {
    try {
      const { story } = await fetchMemoryStory({
        graduateId,
        graduateName,
        university,
        major,
        wishes: inputs,
      })
      return story
    } catch {
      /* fallback */
    }
  }

  return generateLocalMemoryStory(wishes, graduateName, university)
}

export { computeWishesHash }
