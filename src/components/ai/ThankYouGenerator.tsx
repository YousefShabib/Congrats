import { Copy, RefreshCw } from 'lucide-react'
import { MagneticButton } from '@/components/ui/MagneticButton'
import type { ThankYouTone } from '@/types/ai'

const TONES: { id: ThankYouTone; label: string }[] = [
  { id: 'emotional', label: 'عاطفي' },
  { id: 'professional', label: 'احترافي' },
  { id: 'formal', label: 'رسمي' },
  { id: 'short', label: 'قصير' },
]

interface ThankYouGeneratorProps {
  message: string
  tone: ThankYouTone
  loading: boolean
  onToneChange: (tone: ThankYouTone) => void
  onGenerate: (tone?: ThankYouTone) => void
  onCopy: () => void
}

export function ThankYouGenerator({
  message,
  tone,
  loading,
  onToneChange,
  onGenerate,
  onCopy,
}: ThankYouGeneratorProps) {
  return (
    <div className="rounded-2xl border border-luxury-gold/20 bg-white/70 p-6 backdrop-blur-xl">
      <h3 className="editorial-heading mb-4 text-lg text-charcoal">مولّد رسالة الشكر</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {TONES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onToneChange(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${
              tone === t.id
                ? 'bg-luxury-gold text-white'
                : 'bg-soft-beige/50 text-charcoal hover:bg-luxury-gold/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mb-4 min-h-[100px] rounded-xl border border-soft-beige bg-cream/50 p-4 text-sm leading-relaxed text-charcoal/85">
        {loading ? 'جاري التوليد...' : message || 'اضغط توليد لإنشاء رسالة شكر شخصية'}
      </div>
      <div className="flex flex-wrap gap-3">
        <MagneticButton
          onClick={() => onGenerate(tone)}
          disabled={loading}
          className="gap-2 bg-gradient-to-r from-luxury-gold-dark to-luxury-gold px-5 py-2 text-white"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {message ? 'إعادة التوليد' : 'توليد'}
        </MagneticButton>
        <MagneticButton
          onClick={onCopy}
          disabled={!message}
          className="gap-2 border border-soft-beige bg-white px-5 py-2 text-charcoal"
        >
          <Copy className="h-4 w-4" />
          نسخ
        </MagneticButton>
      </div>
    </div>
  )
}
