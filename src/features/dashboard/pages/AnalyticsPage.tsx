import { RefreshCw } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function AnalyticsPage() {
  const { summary, loading, syncFromLiveData } = useAnalytics()
  const { canUse } = useFeatureFlags()

  if (loading) return <LuxuryLoader />

  const metrics = [
    { label: 'الزوار', value: summary.totalVisitors },
    { label: 'زوار فريدون', value: summary.uniqueVisitors },
    { label: 'أكثر يوم نشاطاً', value: summary.mostActiveDay },
    { label: 'أكثر منصة مشاركة', value: summary.mostSharedPlatform },
    { label: 'متوسط التهاني/يوم', value: summary.averageWishesPerDay },
    { label: 'الصور المرفوعة', value: summary.imagesUploaded },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="editorial-heading text-3xl text-charcoal">التحليلات</h1>
          {!canUse('advancedAnalytics') && (
            <p className="text-sm text-muted">التحليلات الأساسية متاحة — التحليلات المتقدمة للبريميوم</p>
          )}
        </div>
        <MagneticButton
          onClick={() => syncFromLiveData()}
          className="gap-2 bg-luxury-gold/20 px-4 py-2 text-charcoal"
        >
          <RefreshCw className="h-4 w-4" />
          تحديث
        </MagneticButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-soft-beige/60 bg-white p-5 shadow-card">
            <p className="editorial-label mb-1 text-muted">{label}</p>
            <p className="editorial-heading text-2xl text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      {Object.keys(summary.shareCounts).length > 0 && (
        <section className="rounded-2xl border border-soft-beige/60 bg-cream p-6 shadow-card">
          <h2 className="editorial-heading mb-4 text-xl">المشاركات حسب المنصة</h2>
          <ul className="space-y-2">
            {Object.entries(summary.shareCounts).map(([platform, count]) => (
              <li key={platform} className="flex justify-between text-sm">
                <span>{platform}</span>
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
