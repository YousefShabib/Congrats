import { motion } from 'framer-motion'
import { GraduationCap, Quote, Send } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BackgroundEffects } from '@/components/layout/BackgroundEffects'
import { CongratulationModal } from '@/components/modal/CongratulationModal'
import { ShareReminderDialog } from '@/components/modal/ShareReminderDialog'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useGraduationPage } from '@/hooks/useGraduationPage'
import { useSetThemeFromGraduate } from '@/providers/ThemeProvider'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { toFirebaseError } from '@/services/firebase'
import type { WishSubmitPayload } from '@/types'

/** Public share page — profile, bio, mini gallery, send wish only */
export function PublicGraduatePage() {
  const { graduateId } = useParams<{ graduateId: string }>()
  const {
    student,
    isOpen,
    loading,
    notFound,
    error,
    shareUrl,
    themeId,
    customColors,
    publicBio,
    publicGallery,
    submitWish,
    graduateId: resolvedId,
  } = useGraduationPage(graduateId)

  useSetThemeFromGraduate(themeId, customColors)

  const [modalOpen, setModalOpen] = useState(false)
  const [shareReminderOpen, setShareReminderOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = useCallback(
    async (payload: WishSubmitPayload) => {
      setSubmitError(null)
      try {
        await submitWish(payload)
        setShareReminderOpen(true)
      } catch (err) {
        setSubmitError(toFirebaseError(err).message)
        throw err
      }
    },
    [submitWish],
  )

  if (loading) {
    return (
      <>
        <BackgroundEffects />
        <LuxuryLoader />
      </>
    )
  }

  if (notFound) return <NotFoundPage />

  const displayGallery = (publicGallery ?? []).slice(0, 3)

  return (
    <div className="relative min-h-screen bg-warm-white" dir="rtl">
      <BackgroundEffects />

      {(error || submitError) && (
        <div className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {submitError ?? error?.message}
        </div>
      )}

      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-12">
        <motion.div
          className="w-full text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative mx-auto mb-6 h-36 w-36">
            <div className="absolute -inset-2 rounded-full bg-luxury-gold/20 blur-xl" />
            <img
              src={student.profileImage}
              alt={student.name}
              className="relative h-full w-full rounded-full border-4 border-white object-cover shadow-2xl shadow-luxury-gold/20"
            />
          </div>

          <h1 className="editorial-heading mb-1 text-3xl text-charcoal">{student.name}</h1>
          <p className="mb-1 text-muted">{student.university}</p>
          <p className="mb-6 text-sm text-muted">
            {student.major} · {student.graduationYear}
          </p>

          {publicBio && (
            <div className="mb-8 rounded-2xl border border-luxury-gold/20 bg-cream/80 p-5 text-right shadow-card">
              <Quote className="mb-2 h-5 w-5 text-luxury-gold/60" />
              <p className="editorial-body leading-relaxed text-charcoal/85">{publicBio}</p>
            </div>
          )}

          {displayGallery.length > 0 && (
            <div className="mb-8 grid grid-cols-3 gap-2">
              {displayGallery.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="aspect-square rounded-xl object-cover shadow-md"
                />
              ))}
            </div>
          )}

          <MagneticButton
            onClick={() => {
              if (!isOpen) {
                setSubmitError('تم إغلاق التهاني مؤقتاً')
                return
              }
              setModalOpen(true)
            }}
            className="mx-auto gap-2 bg-gradient-to-r from-luxury-gold-dark to-luxury-gold px-10 py-4 text-lg text-white"
          >
            <Send className="h-5 w-5" />
            أرسل تهنئة
          </MagneticButton>

          <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted">
            <GraduationCap className="h-3.5 w-3.5" />
            Congrats · {resolvedId}
          </p>
        </motion.div>
      </main>

      <CongratulationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        disabled={!isOpen}
      />

      <ShareReminderDialog
        open={shareReminderOpen}
        onOpenChange={setShareReminderOpen}
        url={shareUrl}
        studentName={student.name}
      />
    </div>
  )
}
