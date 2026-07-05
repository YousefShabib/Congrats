import { useEffect } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useFeatureFlags } from '@/providers/FeatureFlagsProvider'
import { useTheme } from '@/providers/ThemeProvider'
import { THEME_LIST } from '@/lib/themes'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { MagneticButton } from '@/components/ui/MagneticButton'
import type { Visibility } from '@/types'

export function SettingsPage() {
  const { doc, loading, updateProfile, graduateId } = useDashboard()
  const { setThemeId } = useTheme()
  const { canUse, plan } = useFeatureFlags()

  useEffect(() => {
    if (doc?.themeId) setThemeId(doc.themeId)
  }, [doc?.themeId, setThemeId])

  if (loading && !doc) return <LuxuryLoader />

  return (
    <div className="space-y-8">
      <h1 className="editorial-heading text-3xl text-charcoal">الإعدادات والتخصيص</h1>

      <section className="rounded-2xl border border-soft-beige/60 bg-white p-6 shadow-card">
        <h2 className="editorial-heading mb-4 text-xl">حالة التهاني</h2>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={doc?.isOpen ?? true}
            onChange={(e) => updateProfile({ isOpen: e.target.checked })}
          />
          <span>فتح استقبال التهاني</span>
        </label>
      </section>

      <section className="rounded-2xl border border-soft-beige/60 bg-white p-6 shadow-card">
        <h2 className="editorial-heading mb-4 text-xl">الظهور</h2>
        <select
          value={doc?.visibility ?? 'public'}
          onChange={(e) => updateProfile({ visibility: e.target.value as Visibility })}
          className="w-full rounded-xl border border-soft-beige px-4 py-3"
        >
          <option value="public">عام</option>
          <option value="unlisted">غير مدرج</option>
          <option value="private">خاص</option>
        </select>
      </section>

      <section className="rounded-2xl border border-soft-beige/60 bg-white p-6 shadow-card">
        <h2 className="editorial-heading mb-4 text-xl">الثيم</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {THEME_LIST.map((theme) => {
            const locked = theme.isPremium && !canUse('customTheme')
            return (
              <button
                key={theme.id}
                type="button"
                disabled={locked}
                onClick={() => {
                  setThemeId(theme.id)
                  updateProfile({ themeId: theme.id })
                }}
                className={`rounded-xl border p-4 text-right transition ${
                  doc?.themeId === theme.id
                    ? 'border-luxury-gold bg-luxury-gold/10'
                    : 'border-soft-beige hover:border-luxury-gold/40'
                } ${locked ? 'opacity-50' : ''}`}
              >
                <p className="editorial-heading">{theme.name}</p>
                <p className="text-xs text-muted">
                  {theme.isPremium ? 'بريميوم' : 'مجاني'}
                  {locked && ' — ترقية مطلوبة'}
                </p>
                <div className="mt-2 flex gap-1">
                  {[theme.colors.primary, theme.colors.accent, theme.colors.background].map((c) => (
                    <span key={c} className="h-4 w-4 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-soft-beige/60 bg-cream p-6 shadow-card">
        <h2 className="editorial-heading mb-2 text-xl">الخطة الحالية</h2>
        <p className="mb-4 text-muted capitalize">{plan} — الدفع غير مفعّل بعد</p>
        <MagneticButton disabled className="bg-luxury-gold/30 px-4 py-2 text-charcoal">
          ترقية (قريباً)
        </MagneticButton>
        <p className="mt-2 text-xs text-muted">معرّف الصفحة: {graduateId}</p>
      </section>
    </div>
  )
}
