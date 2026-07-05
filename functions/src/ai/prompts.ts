import type { AIWishInput } from './types'

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

export const INSIGHTS_JSON_SCHEMA = `{
  "summary": "string emotional summary in Arabic",
  "keywords": [{ "word": "string", "count": number, "rank": number, "size": number }],
  "sentiment": [{ "category": "positive|emotional|funny|inspirational|proud", "label": "Arabic label", "percentage": number, "color": "hex" }],
  "bestWishes": [{ "wishId": "string", "senderName": "string", "message": "string", "reason": "string" }],
  "insights": {
    "mostSupportivePerson": { "name": "string", "wishCount": number },
    "mostEmotionalWish": { "wishId": "string", "senderName": "string", "message": "string" },
    "longestWish": { "wishId": "string", "senderName": "string", "message": "string", "length": number },
    "shortestWish": { "wishId": "string", "senderName": "string", "message": "string", "length": number },
    "mostRepeatedPhrase": "string",
    "topEmojis": [{ "emoji": "string", "count": number }]
  },
  "tags": [{ "wishId": "string", "tags": ["friend|family|professor|colleague|funny|prayer|career"] }]
}`

export function buildInsightsPrompt(graduateName: string, wishes: AIWishInput[]): string {
  const wishLines = wishes
    .slice(0, 120)
    .map((w) => `- [${w.id}] ${w.senderName}: ${w.message}`)
    .join('\n')

  return `Graduate name: ${graduateName}
Total wishes: ${wishes.length}

Wishes:
${wishLines}

Return JSON matching this schema:
${INSIGHTS_JSON_SCHEMA}

Rules:
- Write summary in warm Arabic (1-2 sentences)
- keywords: top 10 Arabic words, size 20-42 based on frequency
- sentiment percentages should sum ~100
- bestWishes: pick 3 most meaningful wishIds from the list
- tags: infer from message content
- Use exact wishIds from input`
}

export function buildThankYouPrompt(input: {
  graduateName: string
  tone: string
  wishes: AIWishInput[]
}): string {
  return `Write a ${input.tone} thank-you message in Arabic for graduate ${input.graduateName} responding to ${input.wishes.length} congratulations. Return JSON: { "message": "..." }`
}

export function buildSearchPrompt(input: { query: string; wishes: AIWishInput[] }): string {
  const wishLines = input.wishes
    .slice(0, 100)
    .map((w) => `[${w.id}] ${w.senderName}: ${w.message}`)
    .join('\n')

  return `Natural language search query: "${input.query}"

Wishes:
${wishLines}

Return JSON: { "wishIds": ["id1"], "explanation": "Arabic explanation" }
Only include wishIds that match the query.`
}

export function buildMemoryStoryPrompt(input: {
  graduateName: string
  university?: string
  major?: string
  wishes: AIWishInput[]
}): string {
  return `Write a beautiful graduation memory story in Arabic for ${input.graduateName}${
    input.university ? ` from ${input.university}` : ''
  }${input.major ? ` (${input.major})` : ''} based on ${input.wishes.length} wishes.
Return JSON: { "story": "3-5 paragraph narrative" }`
}
