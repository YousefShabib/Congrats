import { Link } from 'react-router-dom'
import { ExternalLink, Share2 } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useGraduationPage } from '@/hooks/useGraduationPage'
import { PublicLinkBar } from '@/components/profile/PublicLinkBar'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function DashboardHomePage() {
  const { graduateId, doc, loading } = useDashboard()
  const { stats, congratulations } = useGraduationPage(graduateId)

  if (loading) return <LuxuryLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="editorial-heading text-3xl text-charcoal">مرحباً، {doc?.name ?? 'خريج'}</h1>
        <p className="editorial-body text-muted">إدارة صفحة التخرج والمشاركة</p>
      </div>

      {graduateId && <PublicLinkBar graduateId={graduateId} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'إجمالي التهاني', value: stats.totalCongratulations },
          { label: 'الزوار', value: stats.totalVisitors },
          { label: 'تهاني اليوم', value: stats.todaysWishes },
          { label: 'الصور', value: stats.photosShared },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl border border-soft-beige/60 bg-white p-5 shadow-card">
            <p className="editorial-label mb-1 text-muted">{label}</p>
            <p className="editorial-heading text-3xl text-charcoal">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-soft-beige/60 bg-cream p-6 shadow-card">
        <h2 className="editorial-heading mb-4 flex items-center gap-2 text-xl">
          <Share2 className="h-5 w-5 text-luxury-gold" />
          أدوات المشاركة
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/graduate/${graduateId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-charcoal ring-1 ring-soft-beige transition hover:bg-luxury-gold/10"
          >
            <ExternalLink className="h-4 w-4" />
            الصفحة العامة
          </Link>
          <Link
            to={`/graduate/${graduateId}/live`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-white px-4 py-2 text-charcoal ring-1 ring-soft-beige transition hover:bg-luxury-gold/10"
          >
            Live Event
          </Link>
          <Link
            to={`/graduate/${graduateId}/wall`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full bg-white px-4 py-2 text-charcoal ring-1 ring-soft-beige transition hover:bg-luxury-gold/10"
          >
            Live Wall
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">
          آخر {congratulations.length} تهنئة محمّلة • الحالة: {doc?.isOpen ? 'مفتوحة' : 'مغلقة'}
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/dashboard/profile">
          <MagneticButton className="bg-luxury-gold/20 px-4 py-2 text-charcoal">تعديل الملف</MagneticButton>
        </Link>
        <Link to="/dashboard/wishes">
          <MagneticButton className="bg-luxury-gold/20 px-4 py-2 text-charcoal">إدارة التهاني</MagneticButton>
        </Link>
        <Link to="/dashboard/analytics">
          <MagneticButton className="bg-luxury-gold/20 px-4 py-2 text-charcoal">التحليلات</MagneticButton>
        </Link>
      </div>
    </div>
  )
}
