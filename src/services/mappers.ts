import type { Congratulation, GraduateDoc, Stats, Student, WishDoc } from '@/types'

function timestampToDate(ts: string | Date | { toDate?: () => Date } | undefined): Date {
  if (!ts) return new Date()
  if (ts instanceof Date) return ts
  if (typeof ts === 'string') return new Date(ts)
  if (typeof ts.toDate === 'function') return ts.toDate()
  return new Date()
}

export function graduateToStudent(_id: string, data: GraduateDoc): Student {
  return {
    name: data.name,
    nameEn: data.nameEn ?? data.name,
    university: data.university,
    universityEn: data.universityEn ?? data.university,
    major: data.major,
    majorEn: data.majorEn ?? data.major,
    graduationYear: data.graduationYear,
    profileImage: data.profileImage,
  }
}

export function wishToCongratulation(wishId: string, data: WishDoc): Congratulation {
  return {
    id: wishId,
    senderName: data.senderName,
    message: data.message,
    avatar: data.senderImage,
    createdAt: timestampToDate(data.createdAt),
    likes: data.likes ?? 0,
    isPinned: data.isPinned ?? false,
    mood: data.mood,
  }
}

export function sortWishes(wishes: Congratulation[]): Congratulation[] {
  return [...wishes].sort((a, b) => {
    const pinA = a.isPinned ? 1 : 0
    const pinB = b.isPinned ? 1 : 0
    if (pinB !== pinA) return pinB - pinA
    return b.createdAt.getTime() - a.createdAt.getTime()
  })
}

export function computeStats(
  wishes: Congratulation[],
  visitorCount = 0,
  todayVisitorCount = 0,
): Stats {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaysWishes = wishes.filter((w) => {
    const d = new Date(w.createdAt)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  }).length

  const photosShared = wishes.filter((w) => Boolean(w.avatar)).length
  const totalVisitors = visitorCount > 0 ? visitorCount : wishes.length
  const todayVisitors = todayVisitorCount > 0 ? todayVisitorCount : todaysWishes
  const activeVisitors = Math.max(1, Math.min(12, Math.ceil(todayVisitors / 8) + 1))

  return {
    totalCongratulations: wishes.length,
    totalVisitors,
    photosShared,
    todaysWishes,
    todayVisitors,
    activeVisitors,
  }
}

export function extractGalleryImages(
  wishes: Congratulation[],
  coverImage?: string,
): string[] {
  const fromWishes = wishes.filter((w) => w.avatar).map((w) => w.avatar as string)
  return coverImage ? [coverImage, ...fromWishes] : fromWishes
}
