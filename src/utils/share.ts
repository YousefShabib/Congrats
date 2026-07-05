export const CELEBRATION_MILESTONES = [10, 25, 50, 100, 250, 500] as const

export type SharePlatform =
  | 'copy'
  | 'native'
  | 'whatsapp'
  | 'twitter'
  | 'facebook'
  | 'telegram'

export function buildShareMessage(studentName: string, url: string): string {
  return `🎓 ${studentName} تخرّت! أرسل تهنئتك الآن:\n${url}`
}

export function getShareLinks(url: string, message: string) {
  const encoded = encodeURIComponent(url)
  const encodedMessage = encodeURIComponent(message)

  return {
    whatsapp: `https://wa.me/?text=${encodedMessage}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    telegram: `https://t.me/share/url?url=${encoded}&text=${encodedMessage}`,
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export async function nativeShare(title: string, text: string, url: string): Promise<boolean> {
  if (!navigator.share) return false
  try {
    await navigator.share({ title, text, url })
    return true
  } catch {
    return false
  }
}
