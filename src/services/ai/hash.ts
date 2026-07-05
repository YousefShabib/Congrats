import type { AIWishInput } from '@/types/ai'

export function computeWishesHash(wishes: AIWishInput[]): string {
  const payload = wishes
    .map((w) => `${w.id}|${w.senderName}|${w.message}|${w.mood ?? ''}`)
    .sort()
    .join('\n')

  let hash = 5381
  for (let i = 0; i < payload.length; i++) {
    hash = (hash * 33) ^ payload.charCodeAt(i)
  }

  return `${wishes.length}-${(hash >>> 0).toString(36)}`
}
