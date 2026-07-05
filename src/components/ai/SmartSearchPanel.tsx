import { Search } from 'lucide-react'
import { MagneticButton } from '@/components/ui/MagneticButton'
import type { Congratulation } from '@/types'

interface SmartSearchPanelProps {
  query: string
  explanation: string
  resultIds: string[]
  wishes: Congratulation[]
  loading: boolean
  onQueryChange: (q: string) => void
  onSearch: () => void
}

export function SmartSearchPanel({
  query,
  explanation,
  resultIds,
  wishes,
  loading,
  onQueryChange,
  onSearch,
}: SmartSearchPanelProps) {
  const results = wishes.filter((w) => resultIds.includes(w.id))

  return (
    <div className="rounded-2xl border border-luxury-gold/20 bg-white/70 p-6 backdrop-blur-xl">
      <h3 className="editorial-heading mb-4 text-lg text-charcoal">بحث ذكي</h3>
      <div className="mb-4 flex gap-2">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          placeholder='مثال: "اعثر على التهاني العاطفية"'
          className="flex-1 rounded-xl border border-soft-beige bg-white px-4 py-3 text-sm"
        />
        <MagneticButton
          onClick={onSearch}
          disabled={loading || !query.trim()}
          className="gap-2 bg-luxury-gold/20 px-4 py-2 text-charcoal"
        >
          <Search className="h-4 w-4" />
          بحث
        </MagneticButton>
      </div>
      {explanation && <p className="mb-3 text-sm text-muted">{explanation}</p>}
      <div className="max-h-48 space-y-2 overflow-y-auto">
        {results.map((w) => (
          <div key={w.id} className="rounded-lg border border-soft-beige/60 bg-cream/40 p-3 text-sm">
            <p className="font-medium text-charcoal">{w.senderName}</p>
            <p className="text-muted">{w.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
