import { Check, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getGraduatePublicUrl } from '@/lib/urls'

interface PublicLinkBarProps {
  graduateId: string
}

export function PublicLinkBar({ graduateId }: PublicLinkBarProps) {
  const [copied, setCopied] = useState(false)
  const publicPath = `/graduate/${graduateId}`
  const fullUrl = getGraduatePublicUrl(graduateId)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-2xl border border-luxury-gold/25 bg-cream/60 p-4">
      <p className="mb-2 text-sm font-medium text-charcoal">الرابط العام للمشاركة</p>
      <div className="flex flex-wrap items-center gap-2">
        <code
          className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 text-xs text-charcoal ring-1 ring-soft-beige font-english"
          dir="ltr"
        >
          {fullUrl}
        </code>
        <button
          type="button"
          onClick={() => void copyLink()}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm text-charcoal ring-1 ring-soft-beige hover:bg-luxury-gold/10"
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          {copied ? 'تم النسخ' : 'نسخ'}
        </button>
        <Link
          to={publicPath}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-luxury-gold/15 px-3 py-2 text-sm text-charcoal hover:bg-luxury-gold/25"
        >
          <ExternalLink className="h-4 w-4" />
          معاينة
        </Link>
      </div>
    </div>
  )
}
