import { Shield, Star, Trash2, Users } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { getWishes, deleteWish } from '@/services/firebase'
import { useState } from 'react'
import type { Congratulation } from '@/types'

export function AdminPage() {
  const { graduates, loading, error, refresh, toggleFeatured } = useAdmin()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [wishes, setWishes] = useState<Congratulation[]>([])
  const [wishesLoading, setWishesLoading] = useState(false)

  async function loadWishes(graduateId: string) {
    setSelectedId(graduateId)
    setWishesLoading(true)
    try {
      setWishes(await getWishes(graduateId))
    } finally {
      setWishesLoading(false)
    }
  }

  async function handleDeleteWish(wishId: string) {
    if (!selectedId || !confirm('حذف التهنئة؟')) return
    await deleteWish(selectedId, wishId)
    setWishes((prev) => prev.filter((w) => w.id !== wishId))
  }

  if (loading) return <LuxuryLoader />

  const totalVisitors = graduates.reduce((sum, g) => sum + (g.doc.visitorCount ?? 0), 0)
  const featuredCount = graduates.filter((g) => g.doc.isFeatured).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="editorial-heading flex items-center gap-2 text-3xl text-charcoal">
          <Shield className="h-7 w-7 text-luxury-gold" />
          لوحة الإدارة
        </h1>
        <MagneticButton onClick={refresh} className="bg-luxury-gold/20 px-4 py-2">
          تحديث
        </MagneticButton>
      </div>

      {error && <p className="text-red-600">{error.message}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="الخريجون" value={graduates.length} />
        <StatCard icon={Users} label="إجمالي الزيارات" value={totalVisitors} />
        <StatCard icon={Star} label="صفحات مميزة" value={featuredCount} />
      </div>

      <section className="rounded-2xl border border-soft-beige/60 bg-white p-6 shadow-card">
        <h2 className="editorial-heading mb-4 text-xl">الخريجون</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-soft-beige text-muted">
                <th className="py-2 text-right">الاسم</th>
                <th className="py-2 text-right">الجامعة</th>
                <th className="py-2 text-right">زوار</th>
                <th className="py-2 text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {graduates.map(({ id, doc }) => (
                <tr key={id} className="border-b border-soft-beige/40">
                  <td className="py-3">{doc.name}</td>
                  <td className="py-3">{doc.university}</td>
                  <td className="py-3">{doc.visitorCount ?? 0}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-2">
                      <MagneticButton
                        onClick={() => loadWishes(id)}
                        className="px-2 py-1 text-xs bg-soft-beige/50"
                      >
                        التهاني
                      </MagneticButton>
                      <MagneticButton
                        onClick={() => toggleFeatured(id, !doc.isFeatured)}
                        className="px-2 py-1 text-xs bg-luxury-gold/20"
                      >
                        {doc.isFeatured ? 'إلغاء تمييز' : 'تمييز'}
                      </MagneticButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedId && (
        <section className="rounded-2xl border border-soft-beige/60 bg-cream p-6 shadow-card">
          <h2 className="editorial-heading mb-4 text-xl">تهاني: {selectedId}</h2>
          {wishesLoading ? (
            <LuxuryLoader />
          ) : (
            <div className="space-y-2">
              {wishes.map((w) => (
                <div key={w.id} className="flex items-start justify-between gap-3 rounded-xl bg-white p-3">
                  <div>
                    <p className="font-medium">{w.senderName}</p>
                    <p className="text-sm text-muted">{w.message}</p>
                  </div>
                  <MagneticButton
                    onClick={() => handleDeleteWish(w.id)}
                    className="p-2 text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </MagneticButton>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-soft-beige/60 bg-white p-5 shadow-card">
      <Icon className="mb-2 h-5 w-5 text-luxury-gold" />
      <p className="editorial-label text-muted">{label}</p>
      <p className="editorial-heading text-2xl">{value}</p>
    </div>
  )
}
