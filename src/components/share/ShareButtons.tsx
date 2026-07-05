import {
  Check,
  Copy,
  ExternalLink,
  Send,
  Share2,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  buildShareMessage,
  copyToClipboard,
  getShareLinks,
  nativeShare,
} from '@/utils/share'

interface ShareButtonsProps {
  url: string
  studentName: string
  compact?: boolean
}

export function ShareButtons({ url, studentName, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const message = buildShareMessage(studentName, url)
  const links = getShareLinks(url, message)

  const handleCopy = async () => {
    const ok = await copyToClipboard(url)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNative = async () => {
    await nativeShare(`تهنئة ${studentName}`, message, url)
  }

  const btnClass = compact
    ? 'h-10 w-10 rounded-full p-0'
    : 'gap-2 rounded-full'

  return (
    <div className={`flex flex-wrap items-center justify-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <Button variant="outline" size={compact ? 'icon' : 'sm'} className={btnClass} onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4 text-luxury-gold" /> : <Copy className="h-4 w-4" />}
        {!compact && (copied ? 'تم النسخ!' : 'نسخ الرابط')}
      </Button>

      {'share' in navigator && (
        <Button variant="outline" size={compact ? 'icon' : 'sm'} className={btnClass} onClick={handleNative}>
          <Share2 className="h-4 w-4" />
          {!compact && 'مشاركة'}
        </Button>
      )}

      <Button variant="outline" size={compact ? 'icon' : 'sm'} className={btnClass} asChild>
        <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          <Send className="h-4 w-4" />
          {!compact && 'WhatsApp'}
        </a>
      </Button>

      <Button variant="outline" size={compact ? 'icon' : 'sm'} className={btnClass} asChild>
        <a href={links.twitter} target="_blank" rel="noopener noreferrer" aria-label="X">
          <ExternalLink className="h-4 w-4" />
          {!compact && 'X'}
        </a>
      </Button>

      <Button variant="outline" size={compact ? 'icon' : 'sm'} className={btnClass} asChild>
        <a href={links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <Share2 className="h-4 w-4" />
          {!compact && 'Facebook'}
        </a>
      </Button>

      <Button variant="outline" size={compact ? 'icon' : 'sm'} className={btnClass} asChild>
        <a href={links.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
          <Send className="h-4 w-4 rotate-[-30deg]" />
          {!compact && 'Telegram'}
        </a>
      </Button>
    </div>
  )
}
