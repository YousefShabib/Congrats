import type { Congratulation } from '@/types'
import type {
  AIInsightsBundle,
  AIInsightStats,
  AIKeyword,
  AISentimentBucket,
  AIWishInput,
  AIWishTag,
  AIBestWish,
  SentimentCategory,
  ThankYouTone,
} from '@/types/ai'
import {
  computeEmotions,
  computeKeywords,
  computeSummary,
} from '@/utils/computeInsights'

const SENTIMENT_COLORS: Record<string, string> = {
  positive: '#c9a962',
  emotional: '#8a8279',
  funny: '#e8d5a3',
  inspirational: '#a68b4b',
  proud: '#6b5344',
}

const EMOJI_REGEX = /\p{Extended_Pictographic}/gu

function computeInsightStats(wishes: Congratulation[]): AIInsightStats {
  if (wishes.length === 0) {
    return {
      mostSupportivePerson: { name: '—', wishCount: 0 },
      mostEmotionalWish: { wishId: '', senderName: '—', message: '—' },
      longestWish: { wishId: '', senderName: '—', message: '—', length: 0 },
      shortestWish: { wishId: '', senderName: '—', message: '—', length: 0 },
      mostRepeatedPhrase: '—',
      topEmojis: [],
    }
  }

  const senderCounts = new Map<string, number>()
  const emojiCounts = new Map<string, number>()
  const phraseCounts = new Map<string, number>()

  let longest = wishes[0]!
  let shortest = wishes[0]!
  let mostEmotional = wishes[0]!

  for (const wish of wishes) {
    senderCounts.set(wish.senderName, (senderCounts.get(wish.senderName) ?? 0) + 1)

    if (wish.message.length > longest.message.length) longest = wish
    if (wish.message.length < shortest.message.length) shortest = wish
    if (wish.mood === 'emotional') mostEmotional = wish

    const emojis = wish.message.match(EMOJI_REGEX) ?? []
    for (const emoji of emojis) {
      emojiCounts.set(emoji, (emojiCounts.get(emoji) ?? 0) + 1)
    }

    const phrases = wish.message.split(/[.!?،]/).map((p) => p.trim()).filter((p) => p.length > 8)
    for (const phrase of phrases) {
      phraseCounts.set(phrase, (phraseCounts.get(phrase) ?? 0) + 1)
    }
  }

  const topSender = [...senderCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  const topPhrase = [...phraseCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  const topEmojis = [...emojiCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([emoji, count]) => ({ emoji, count }))

  return {
    mostSupportivePerson: { name: topSender?.[0] ?? '—', wishCount: topSender?.[1] ?? 0 },
    mostEmotionalWish: {
      wishId: mostEmotional.id,
      senderName: mostEmotional.senderName,
      message: mostEmotional.message,
    },
    longestWish: {
      wishId: longest.id,
      senderName: longest.senderName,
      message: longest.message,
      length: longest.message.length,
    },
    shortestWish: {
      wishId: shortest.id,
      senderName: shortest.senderName,
      message: shortest.message,
      length: shortest.message.length,
    },
    mostRepeatedPhrase: topPhrase?.[0] ?? '—',
    topEmojis,
  }
}

function inferTags(wishes: Congratulation[]): AIWishTag[] {
  const rules: { pattern: RegExp; tag: string }[] = [
    { pattern: /صديق|رفيق|أخ|أخت|حبيب/i, tag: 'friend' },
    { pattern: /أم|أب|والد|والدة|عائلة|أسرة|أخو/i, tag: 'family' },
    { pattern: /دكتور|أستاذ|professor|dr\./i, tag: 'professor' },
    { pattern: /زميل|colleague|فريق/i, tag: 'colleague' },
    { pattern: /😂|🤣|ههه|ضحك|funny/i, tag: 'funny' },
    { pattern: /الله|دعاء|pray|بارك/i, tag: 'prayer' },
    { pattern: /عمل|career|مستقبل|وظيف/i, tag: 'career' },
  ]

  return wishes.map((wish) => {
    const tags = rules.filter((r) => r.pattern.test(wish.message)).map((r) => r.tag)
    if (wish.mood === 'fun') tags.push('funny')
    return { wishId: wish.id, tags: [...new Set(tags)] }
  })
}

function buildBestWishes(wishes: Congratulation[]): AIBestWish[] {
  return [...wishes]
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0) || b.message.length - a.message.length)
    .slice(0, 3)
    .map((w) => ({
      wishId: w.id,
      senderName: w.senderName,
      message: w.message,
      reason: 'رسالة مليئة بالدعم والمحبة',
    }))
}

function buildSentiment(wishes: Congratulation[]): AISentimentBucket[] {
  const emotions = computeEmotions(wishes)
  const categoryMap: Record<string, SentimentCategory> = {
    فرح: 'positive',
    فخر: 'proud',
    مرح: 'funny',
    عاطفة: 'emotional',
    إلهام: 'inspirational',
    امتنان: 'positive',
  }

  return emotions.map((e) => {
    const category = categoryMap[e.label] ?? 'positive'
    return {
      category,
      label: e.label,
      percentage: e.value,
      color: SENTIMENT_COLORS[category] ?? e.color,
    }
  })
}

function buildKeywords(wishes: Congratulation[]): AIKeyword[] {
  return computeKeywords(wishes).map((kw, i) => ({
    word: kw.word,
    count: Math.round((kw.size - 20) / 6) || 1,
    rank: i + 1,
    size: kw.size,
  }))
}

export function generateLocalInsights(
  wishes: Congratulation[],
  graduateName: string,
): AIInsightsBundle {
  const summary = computeSummary(wishes, graduateName)
  const bestWishes = buildBestWishes(wishes)

  return {
    summary,
    keywords: buildKeywords(wishes),
    sentiment: buildSentiment(wishes),
    bestWishes,
    insights: computeInsightStats(wishes),
    tags: inferTags(wishes),
    provider: 'local',
    generatedAt: new Date().toISOString(),
  }
}

export function generateLocalMemoryStory(
  wishes: Congratulation[],
  graduateName: string,
  university?: string,
): string {
  if (wishes.length === 0) {
    return `رحلة ${graduateName} في ${university ?? 'الجامعة'} بدأت بخطوة، وصفحة التهاني تنتظر أول رسالة.`
  }

  const count = wishes.length
  const topNames = [...new Set(wishes.slice(0, 5).map((w) => w.senderName))].join('، ')

  return `في يوم التخرج، وقف ${graduateName} محاطاً بـ ${count} رسالة دافئة من أحبائه${
    university ? ` بعد رحلة في ${university}` : ''
  }. من ${topNames} وغيرهم، كل كلمة كانت فصلاً في قصة نجاح. هذه التهاني ليست مجرد رسائل — إنها ذاكرة حية ليوم لن ينسى.`
}

export function localSmartSearch(query: string, wishes: AIWishInput[]): { wishIds: string[]; explanation: string } {
  const q = query.toLowerCase()
  const matched = wishes.filter((w) => {
    const haystack = `${w.senderName} ${w.message} ${w.mood ?? ''}`.toLowerCase()
    if (q.includes('جام') || q.includes('university')) return /جامعة|university|كلية/i.test(w.message)
    if (q.includes('عاط') || q.includes('emotional')) return w.mood === 'emotional' || /قلب|دموع|love|محبة/i.test(w.message)
    if (q.includes('أحمد') || q.includes('ahmed')) return /أحمد|ahmed/i.test(haystack)
    return haystack.includes(q.replace(/show wishes mentioning |find |from /gi, '').trim())
  })

  return {
    wishIds: matched.map((w) => w.id),
    explanation: matched.length
      ? `تم العثور على ${matched.length} تهنئة مطابقة لبحثك.`
      : 'لم يتم العثور على تهاني مطابقة.',
  }
}

export function generateLocalThankYou(
  graduateName: string,
  tone: ThankYouTone,
  wishCount: number,
): string {
  const templates: Record<ThankYouTone, string> = {
    professional: `أتقدم بخالص الشكر لكل من أرسل ${wishCount} رسالة تهنئة. دعمكم كان محفزاً حقيقياً في محطة التخرج.`,
    emotional: `${graduateName} — قلبي ممتلئ بامتنانكم. كل رسالة منكم أضاءت يوم تخرجي. شكراً من أعماق قلبي.`,
    formal: `يتشرف ${graduateName} بأن يعبر عن خالص الشكر والتقدير لكل من أرسل ${wishCount} رسالة تهنئة، سائلاً المولى دوام التوفيق للجميع.`,
    short: `شكراً لكم على ${wishCount} تهنئة جميلة! ❤️`,
  }
  return templates[tone]
}
