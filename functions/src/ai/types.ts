export type AIProviderName = 'openai' | 'local' | 'anthropic'

export type SentimentCategory = 'positive' | 'emotional' | 'funny' | 'inspirational' | 'proud'
export type ThankYouTone = 'professional' | 'emotional' | 'formal' | 'short'

export interface AIWishInput {
  id: string
  senderName: string
  message: string
  mood?: string
}

export interface AIKeyword {
  word: string
  count: number
  rank: number
  size: number
}

export interface AISentimentBucket {
  category: SentimentCategory
  label: string
  percentage: number
  color: string
}

export interface AIBestWish {
  wishId: string
  senderName: string
  message: string
  reason: string
}

export interface AIInsightStats {
  mostSupportivePerson: { name: string; wishCount: number }
  mostEmotionalWish: { wishId: string; senderName: string; message: string }
  longestWish: { wishId: string; senderName: string; message: string; length: number }
  shortestWish: { wishId: string; senderName: string; message: string; length: number }
  mostRepeatedPhrase: string
  topEmojis: { emoji: string; count: number }[]
}

export interface AIWishTag {
  wishId: string
  tags: string[]
}

export interface AIInsightsBundle {
  summary: string
  keywords: AIKeyword[]
  sentiment: AISentimentBucket[]
  bestWishes: AIBestWish[]
  insights: AIInsightStats
  tags: AIWishTag[]
  memoryStory?: string
  provider: AIProviderName
  generatedAt: string
}

export interface AISearchResult {
  wishIds: string[]
  explanation: string
}

export interface GenerateInsightsRequest {
  graduateId: string
  graduateName: string
  wishes: AIWishInput[]
  wishesHash: string
}

export interface GenerateThankYouRequest {
  graduateId: string
  graduateName: string
  wishes: AIWishInput[]
  tone: ThankYouTone
}

export interface SmartSearchRequest {
  graduateId: string
  query: string
  wishes: AIWishInput[]
}

export interface MemoryStoryRequest {
  graduateId: string
  graduateName: string
  university?: string
  major?: string
  wishes: AIWishInput[]
}

export interface AIProvider {
  name: AIProviderName
  generateInsights(input: GenerateInsightsRequest): Promise<AIInsightsBundle>
  generateThankYou(input: GenerateThankYouRequest): Promise<string>
  smartSearch(input: SmartSearchRequest): Promise<AISearchResult>
  generateMemoryStory(input: MemoryStoryRequest): Promise<string>
}
