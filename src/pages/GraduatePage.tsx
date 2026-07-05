import { motion } from 'framer-motion'
import { lazy, Suspense, useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CelebrationOverlay } from '@/components/celebration/CelebrationOverlay'
import { HeroSection } from '@/components/hero/HeroSection'
import { BackgroundEffects } from '@/components/layout/BackgroundEffects'
import { SectionReveal } from '@/components/layout/SectionReveal'
import { MemoryBookExport } from '@/components/memory/MemoryBookExport'
import { CongratulationModal } from '@/components/modal/CongratulationModal'
import { ShareReminderDialog } from '@/components/modal/ShareReminderDialog'
import { OrbitSystem } from '@/components/orbit/OrbitSystem'
import { ShareSection } from '@/components/share/ShareSection'
import { StatsSection } from '@/components/stats/StatsSection'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { SoundToggle } from '@/components/ui/SoundToggle'
import { useCelebrationMilestones } from '@/hooks/useCelebrationMilestones'
import { useAIInsights } from '@/hooks/useAIInsights'
import { useGraduationPage } from '@/hooks/useGraduationPage'
import { useSetThemeFromGraduate } from '@/providers/ThemeProvider'
import { useSoundSettings } from '@/hooks/useSoundSettings'
import { NotFoundPage } from '@/pages/NotFoundPage'
import {
  getLiveEventUrl,
  getLiveWallUrl,
  toFirebaseError,
} from '@/services/firebase'
import type { WishSubmitPayload } from '@/types'

const GallerySection = lazy(() =>
  import('@/components/gallery/GallerySection').then((m) => ({ default: m.GallerySection })),
)
const AIInsightsSection = lazy(() =>
  import('@/components/ai/AIInsightsSection').then((m) => ({ default: m.AIInsightsSection })),
)

export function GraduatePage() {
  const { graduateId } = useParams<{ graduateId: string }>()
  const {
    student,
    congratulations,
    stats,
    galleryImages,
    isOpen,
    loading,
    notFound,
    error,
    shareUrl,
    themeId,
    customColors,
    submitWish,
    togglePin,
    graduateId: resolvedId,
  } = useGraduationPage(graduateId)

  useSetThemeFromGraduate(themeId, customColors)

  const { insights, loading: aiLoading, error: aiError, bestWishIds } = useAIInsights({
    graduateId: resolvedId,
    student,
    wishes: congratulations,
    enabled: !loading && !notFound,
  })

  const { enabled: soundEnabled, toggle: toggleSound, playClick } = useSoundSettings()
  const { milestone, dismiss: dismissCelebration } = useCelebrationMilestones(
    congratulations.length,
  )

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
        const fbError = toFirebaseError(err)
        setSubmitError(fbError.message)
        throw err
      }
    },
    [submitWish],
  )

  const handleCongratulate = useCallback(() => {
    playClick()
    if (!isOpen) {
      setSubmitError('تم إغلاق التهاني مؤقتاً')
      return
    }
    setSubmitError(null)
    setModalOpen(true)
  }, [isOpen, playClick])

  if (loading) {
    return (
      <>
        <BackgroundEffects />
        <LuxuryLoader />
      </>
    )
  }

  if (notFound) return <NotFoundPage />

  return (
    <div className="relative min-h-screen" dir="rtl">
      <BackgroundEffects />

      <CelebrationOverlay milestone={milestone} onDismiss={dismissCelebration} />

      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {(error || submitError) && (
          <motion.div
            className="fixed left-1/2 top-4 z-[100] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border border-red-200 bg-red-50/95 px-4 py-3 text-center text-sm text-red-700 backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {submitError ?? error?.message}
          </motion.div>
        )}

        <HeroSection student={student} onCongratulate={handleCongratulate} />

        <SectionReveal>
          <OrbitSystem
            congratulations={congratulations}
            student={student}
            bestWishIds={bestWishIds}
            onTogglePin={togglePin}
          />
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <StatsSection stats={stats} />
        </SectionReveal>

        <SectionReveal delay={0.08}>
          <ShareSection
            url={shareUrl}
            student={student}
            liveEventUrl={getLiveEventUrl(graduateId ?? '')}
            liveWallUrl={getLiveWallUrl(graduateId ?? '')}
          />
        </SectionReveal>

        <Suspense fallback={null}>
          {galleryImages.length > 0 && (
            <SectionReveal delay={0.1}>
              <GallerySection images={galleryImages} />
            </SectionReveal>
          )}

          <SectionReveal delay={0.12}>
            <AIInsightsSection insights={insights} loading={aiLoading} error={aiError} />
          </SectionReveal>

          <SectionReveal delay={0.14}>
            <MemoryBookExport
              student={student}
              wishes={congratulations}
              stats={stats}
            />
          </SectionReveal>
        </Suspense>
      </motion.div>

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

      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
    </div>
  )
}
