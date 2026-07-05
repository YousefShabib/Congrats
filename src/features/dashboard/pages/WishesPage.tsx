import { Pin, Trash2 } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashboard'
import { useGraduationPage } from '@/hooks/useGraduationPage'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { deleteWish } from '@/services/firebase'

export function WishesPage() {
  const { graduateId } = useDashboard()
  const { congratulations, loading, togglePin } = useGraduationPage(graduateId)

  if (loading) return <LuxuryLoader />

  async function handleDelete(wishId: string) {
    if (!confirm('حذف هذه التهنئة؟')) return
    await deleteWish(graduateId, wishId)
  }

  return (
    <div className="space-y-6">
      <h1 className="editorial-heading text-3xl text-charcoal">إدارة التهاني</h1>
      <p className="text-muted">{congratulations.length} تهنئة</p>

      <div className="space-y-3">
        {congratulations.map((wish) => (
          <div
            key={wish.id}
            className={`rounded-2xl border bg-white p-4 shadow-card ${
              wish.isPinned ? 'border-luxury-gold' : 'border-soft-beige/60'
            }`}
          >
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="editorial-heading text-charcoal">{wish.senderName}</p>
                <p className="editorial-body text-sm text-muted">{wish.message}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <MagneticButton
                  onClick={() => togglePin(wish.id, !wish.isPinned)}
                  className="p-2 text-luxury-gold"
                  title="تثبيت"
                >
                  <Pin className="h-4 w-4" />
                </MagneticButton>
                <MagneticButton
                  onClick={() => handleDelete(wish.id)}
                  className="p-2 text-red-500"
                  title="حذف"
                >
                  <Trash2 className="h-4 w-4" />
                </MagneticButton>
              </div>
            </div>
          </div>
        ))}
        {congratulations.length === 0 && (
          <p className="text-center text-muted">لا توجد تهاني بعد</p>
        )}
      </div>
    </div>
  )
}
