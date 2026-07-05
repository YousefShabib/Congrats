import type { Congratulation } from '@/types'

const STOP_WORDS = new Set(['في', 'من', 'على', 'إلى', 'مع', 'يا', 'أن', 'كل', 'هذا', 'هذه', 'التي', 'الذي'])

export function computeBestMessages(wishes: Congratulation[], count = 3): string[] {
  return [...wishes]
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0) || b.message.length - a.message.length)
    .slice(0, count)
    .map((w) => w.message)
}

export function computeKeywords(wishes: Congratulation[]): { word: string; size: number }[] {
  const freq = new Map<string, number>()

  for (const wish of wishes) {
    const words = wish.message
      .replace(/[^\u0600-\u06FF\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))

    for (const word of words) {
      freq.set(word, (freq.get(word) ?? 0) + 1)
    }
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      size: Math.min(20 + count * 6, 42),
    }))
}

export function computeEmotions(wishes: Congratulation[]) {
  const moodMap: Record<string, { label: string; color: string }> = {
    happy: { label: 'فرح', color: '#c9a962' },
    proud: { label: 'فخر', color: '#a68b4b' },
    fun: { label: 'مرح', color: '#e8d5a3' },
    emotional: { label: 'عاطفة', color: '#8a8279' },
  }

  const counts: Record<string, number> = { happy: 0, proud: 0, fun: 0, emotional: 0 }
  for (const wish of wishes) {
    if (wish.mood && counts[wish.mood] !== undefined) {
      counts[wish.mood]++
    }
  }

  const total = wishes.length || 1
  const defaults = [
    { label: 'فرح', value: 78, color: '#c9a962' },
    { label: 'فخر', value: 65, color: '#a68b4b' },
    { label: 'إلهام', value: 52, color: '#e8d5a3' },
    { label: 'امتنان', value: 45, color: '#8a8279' },
  ]

  const fromMood = Object.entries(counts)
    .filter(([, c]) => c > 0)
    .map(([mood, count]) => ({
      label: moodMap[mood]?.label ?? mood,
      value: Math.round((count / total) * 100),
      color: moodMap[mood]?.color ?? '#c9a962',
    }))

  return fromMood.length > 0 ? fromMood : defaults
}

export function computeSummary(wishes: Congratulation[], studentName: string): string {
  if (wishes.length === 0) {
    return `صفحة تهاني ${studentName} — كن أول من يرسل رسالة احتفالية.`
  }

  const keywords = computeKeywords(wishes)
    .slice(0, 3)
    .map((k) => k.word)
    .join('، ')

  return `تلقت ${studentName} ${wishes.length} رسالة تهنئة مليئة بالمحبة.${
    keywords ? ` أبرز الكلمات: ${keywords}.` : ''
  } كل رسالة تعكس فخراً ودعماً حقيقياً.`
}
