import type {
  AIInsightsBundle,
  GenerateInsightsRequest,
  GenerateThankYouRequest,
  MemoryStoryRequest,
  SmartSearchRequest,
  AISearchResult,
} from '@/types/ai'

const AI_API_BASE = import.meta.env.VITE_AI_API_BASE ?? '/api'

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${AI_API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(errorBody || `AI API error: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchAIInsights(request: GenerateInsightsRequest): Promise<AIInsightsBundle> {
  return post<AIInsightsBundle>('/ai/insights', request)
}

export async function fetchThankYouMessage(request: GenerateThankYouRequest): Promise<{ message: string }> {
  return post<{ message: string }>('/ai/thank-you', request)
}

export async function fetchSmartSearch(request: SmartSearchRequest): Promise<AISearchResult> {
  return post<AISearchResult>('/ai/search', request)
}

export async function fetchMemoryStory(request: MemoryStoryRequest): Promise<{ story: string }> {
  return post<{ story: string }>('/ai/memory-story', request)
}

export function isAIAvailable(): boolean {
  return import.meta.env.VITE_AI_ENABLED !== 'false'
}
