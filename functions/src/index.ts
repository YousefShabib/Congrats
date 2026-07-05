import { onRequest, type Request } from 'firebase-functions/v2/https'
import type { Response } from 'express'
import { createProviderFromEnv } from './ai/provider.factory'
import type {
  GenerateInsightsRequest,
  GenerateThankYouRequest,
  SmartSearchRequest,
  MemoryStoryRequest,
} from './ai/types'

function setCors(res: Response) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
}

function parseBody<T>(req: Request): T {
  if (typeof req.body === 'string') return JSON.parse(req.body) as T
  return req.body as T
}

function resolveRoute(req: Request): string {
  return `${req.path ?? ''}${req.url ?? ''}`.toLowerCase()
}

async function handleRoute(req: Request, res: Response) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const provider = createProviderFromEnv()
    const route = resolveRoute(req)

    if (route.includes('/ai/insights')) {
      const body = parseBody<GenerateInsightsRequest>(req)
      const bundle = await provider.generateInsights(body)
      res.json(bundle)
      return
    }

    if (route.includes('/ai/thank-you')) {
      const body = parseBody<GenerateThankYouRequest>(req)
      const message = await provider.generateThankYou(body)
      res.json({ message })
      return
    }

    if (route.includes('/ai/search')) {
      const body = parseBody<SmartSearchRequest>(req)
      const result = await provider.smartSearch(body)
      res.json(result)
      return
    }

    if (route.includes('/ai/memory-story')) {
      const body = parseBody<MemoryStoryRequest>(req)
      const story = await provider.generateMemoryStory(body)
      res.json({ story })
      return
    }

    res.status(404).json({ error: 'Not found' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
}

export const aiApi = onRequest(
  {
    cors: true,
    secrets: ['OPENAI_API_KEY'],
    timeoutSeconds: 120,
    memory: '512MiB',
  },
  async (req, res) => {
    await handleRoute(req, res)
  },
)
