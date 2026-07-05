import type {
  AIInsightsBundle,
  AIProvider,
  GenerateInsightsRequest,
  GenerateThankYouRequest,
  MemoryStoryRequest,
  SmartSearchRequest,
  AISearchResult,
} from './types'
import {
  buildInsightsPrompt,
  buildMemoryStoryPrompt,
  buildSearchPrompt,
  buildThankYouPrompt,
} from './prompts'

interface OpenAIConfig {
  apiKey: string
  model: string
}

async function callOpenAIJson<T>(config: OpenAIConfig, system: string, user: string): Promise<T> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.6,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenAI error ${response.status}: ${text}`)
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty OpenAI response')
  return JSON.parse(content) as T
}

const SYSTEM_PROMPT =
  'You are a graduation congratulations analyst. Always respond with valid JSON only. Use Arabic for user-facing text.'

export function createOpenAIProvider(config: OpenAIConfig): AIProvider {
  return {
    name: 'openai',

    async generateInsights(input: GenerateInsightsRequest): Promise<AIInsightsBundle> {
      const parsed = await callOpenAIJson<Omit<AIInsightsBundle, 'provider' | 'generatedAt'>>(
        config,
        SYSTEM_PROMPT,
        buildInsightsPrompt(input.graduateName, input.wishes),
      )

      return {
        ...parsed,
        provider: 'openai',
        generatedAt: new Date().toISOString(),
      }
    },

    async generateThankYou(input: GenerateThankYouRequest): Promise<string> {
      const parsed = await callOpenAIJson<{ message: string }>(
        config,
        SYSTEM_PROMPT,
        buildThankYouPrompt(input),
      )
      return parsed.message
    },

    async smartSearch(input: SmartSearchRequest): Promise<AISearchResult> {
      return callOpenAIJson<AISearchResult>(
        config,
        SYSTEM_PROMPT,
        buildSearchPrompt(input),
      )
    },

    async generateMemoryStory(input: MemoryStoryRequest): Promise<string> {
      const parsed = await callOpenAIJson<{ story: string }>(
        config,
        SYSTEM_PROMPT,
        buildMemoryStoryPrompt(input),
      )
      return parsed.story
    },
  }
}

export function createAIProvider(): AIProvider {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini'

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  return createOpenAIProvider({ apiKey, model })
}

// Future: switch via AI_PROVIDER=anthropic|openai
export function createProviderFromEnv(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'openai'
  if (provider === 'openai') return createAIProvider()
  throw new Error(`Unsupported AI provider: ${provider}`)
}
