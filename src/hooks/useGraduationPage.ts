import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { initAnalytics } from '@/supabase/client'
import {
  addWish,
  computeStats,
  extractGalleryImages,
  getGraduateDoc,
  getShareUrl,
  graduateToStudent,
  incrementVisitorCount,
  listenToGraduateDoc,
  listenToWishesRealTime,
  pinWish,
  resolveGraduateId,
  toFirebaseError,
} from '@/services/firebase'
import { seedDemoGraduate } from '@/services/seed'
import type { FirebaseErrorResponse, WishMood, Congratulation, Stats, Student, WishSubmitPayload, GraduateThemeColors, PlanTier } from '@/types'
import { student as placeholderStudent } from '@/utils/mockData'

const LOAD_TIMEOUT_MS = 12_000
const DEFAULT_GRADUATE_ID = import.meta.env.VITE_DEFAULT_GRADUATE_ID ?? 'noura-2026'

interface GraduationPageState {
  graduateId: string
  student: Student
  congratulations: Congratulation[]
  stats: Stats
  galleryImages: string[]
  isOpen: boolean
  loading: boolean
  notFound: boolean
  error: FirebaseErrorResponse | null
  shareUrl: string
  themeId?: string
  customColors?: GraduateThemeColors
  plan?: PlanTier
  publicBio?: string
  publicGallery?: string[]
  submitWish: (payload: WishSubmitPayload) => Promise<void>
  togglePin: (wishId: string, pinned: boolean) => Promise<void>
}

export function useGraduationPage(routeGraduateId?: string): GraduationPageState {
  const graduateId = useMemo(
    () => resolveGraduateId(routeGraduateId),
    [routeGraduateId],
  )
  const [student, setStudent] = useState<Student>(placeholderStudent)
  const [congratulations, setCongratulations] = useState<Congratulation[]>([])
  const [visitorCount, setVisitorCount] = useState(0)
  const [todayVisitorCount, setTodayVisitorCount] = useState(0)
  const [coverImage, setCoverImage] = useState<string | undefined>()
  const [themeId, setThemeId] = useState<string | undefined>()
  const [customColors, setCustomColors] = useState<GraduateThemeColors | undefined>()
  const [plan, setPlan] = useState<PlanTier>('free')
  const [publicBio, setPublicBio] = useState<string | undefined>()
  const [publicGallery, setPublicGallery] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<FirebaseErrorResponse | null>(null)
  const visitorTracked = useRef(false)
  const profileReady = useRef(false)
  const wishesReady = useRef(false)

  const shareUrl = useMemo(() => getShareUrl(graduateId), [graduateId])

  const tryFinishLoading = useCallback(() => {
    if (profileReady.current && wishesReady.current) {
      setLoading(false)
    }
  }, [])

  const stats = useMemo(
    () => computeStats(congratulations, visitorCount, todayVisitorCount),
    [congratulations, visitorCount, todayVisitorCount],
  )

  const galleryImages = useMemo(
    () => extractGalleryImages(congratulations, coverImage),
    [congratulations, coverImage],
  )

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    let cancelled = false
    profileReady.current = false
    wishesReady.current = false
    setLoading(true)
    setNotFound(false)
    setError(null)
    visitorTracked.current = false
    let bootstrapComplete = false

    const finishWithError = (err: FirebaseErrorResponse) => {
      if (cancelled) return
      setError(err)
      profileReady.current = true
      wishesReady.current = true
      setLoading(false)
    }

    async function ensureGraduateExists() {
      try {
        const existing = await getGraduateDoc(graduateId)
        if (!existing) {
          const canSeed =
            !routeGraduateId || graduateId === DEFAULT_GRADUATE_ID
          if (canSeed) {
            await seedDemoGraduate(graduateId)
          } else {
            if (!cancelled) {
              setNotFound(true)
              profileReady.current = true
              wishesReady.current = true
              setLoading(false)
            }
            bootstrapComplete = true
            return
          }
        }

        if (!cancelled && !visitorTracked.current) {
          visitorTracked.current = true
          incrementVisitorCount(graduateId).catch(() => {})
        }
      } catch (err) {
        finishWithError(toFirebaseError(err))
      } finally {
        bootstrapComplete = true
      }
    }

    ensureGraduateExists()

    const unsubProfile = listenToGraduateDoc(
      graduateId,
      (doc) => {
        if (cancelled) return
        if (doc) {
          setStudent(graduateToStudent(graduateId, doc))
          setIsOpen(doc.isOpen)
          setVisitorCount(doc.visitorCount ?? 0)
          setTodayVisitorCount(doc.todayVisitorCount ?? 0)
          setCoverImage(doc.coverImage)
          setThemeId(doc.themeId)
          setCustomColors(doc.customColors)
          setPlan(doc.plan ?? 'free')
          setPublicBio(doc.publicBio)
          setPublicGallery(doc.publicGallery ?? [])
          setNotFound(false)
        } else if (routeGraduateId && bootstrapComplete) {
          setNotFound(true)
        }
        profileReady.current = true
        tryFinishLoading()
      },
      finishWithError,
    )

    const unsubWishes = listenToWishesRealTime(
      graduateId,
      (wishes) => {
        if (cancelled) return
        setCongratulations(wishes)
        wishesReady.current = true
        tryFinishLoading()
      },
      finishWithError,
    )

    const timeout = window.setTimeout(() => {
      if (!cancelled) setLoading(false)
    }, LOAD_TIMEOUT_MS)

    return () => {
      cancelled = true
      unsubProfile()
      unsubWishes()
      window.clearTimeout(timeout)
    }
  }, [graduateId, routeGraduateId, tryFinishLoading])

  const submitWish = useCallback(
    async (payload: WishSubmitPayload) => {
      setError(null)
      await addWish(graduateId, {
        senderName: payload.senderName,
        message: payload.message,
        imageFile: payload.imageFile,
        mood: payload.mood as WishMood | undefined,
      })
    },
    [graduateId],
  )

  const togglePin = useCallback(
    async (wishId: string, pinned: boolean) => {
      await pinWish(graduateId, wishId, pinned)
    },
    [graduateId],
  )

  return {
    graduateId,
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
    plan,
    publicBio,
    publicGallery,
    submitWish,
    togglePin,
  }
}
