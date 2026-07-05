import { BookOpen, RefreshCw } from 'lucide-react'
import { MagneticButton } from '@/components/ui/MagneticButton'

interface MemoryStoryPanelProps {
  story: string
  loading: boolean
  onGenerate: () => void
}

export function MemoryStoryPanel({ story, loading, onGenerate }: MemoryStoryPanelProps) {
  return (
    <div className="rounded-2xl border border-luxury-gold/20 bg-gradient-to-br from-cream/80 to-white/60 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-luxury-gold" />
          <h3 className="editorial-heading text-lg text-charcoal">قصة ذاكرة التخرج</h3>
        </div>
        <MagneticButton
          onClick={onGenerate}
          disabled={loading}
          className="gap-2 bg-luxury-gold/20 px-3 py-1.5 text-sm text-charcoal"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          توليد
        </MagneticButton>
      </div>
      <p className="editorial-body whitespace-pre-line text-sm leading-relaxed text-charcoal/85">
        {loading ? 'جاري كتابة قصتك...' : story || 'اضغط توليد لإنشاء سرد جميل لتهاني تخرجك.'}
      </p>
    </div>
  )
}
