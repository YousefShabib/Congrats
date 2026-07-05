import { AnimatePresence, motion } from 'framer-motion'
import { Maximize, Minimize, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { OrbitSystem } from '@/components/orbit/OrbitSystem'
import type { Congratulation, Student } from '@/types'

interface LiveEventModeProps {
  student: Student
  congratulations: Congratulation[]
}

export function LiveEventMode({ student, congratulations }: LiveEventModeProps) {
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const hideTimer = useRef<number | null>(null)

  const resetHideTimer = useCallback(() => {
    setControlsVisible(true)
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setControlsVisible(false), 4000)
  }, [])

  useEffect(() => {
    resetHideTimer()
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current)
    }
  }, [resetHideTimer])

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-warm-white"
      onMouseMove={resetHideTimer}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-champagne via-warm-white to-soft-beige" />

      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between bg-charcoal/60 px-6 py-4 backdrop-blur-md"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
          >
            <div className="text-white">
              <p className="text-sm font-semibold">{student.name}</p>
              <p className="text-xs text-white/70">وضع العرض المباشر — {congratulations.length} تهنئة</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleFullscreen}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              <button
                onClick={() => window.close()}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full items-center justify-center pt-16">
        <OrbitSystem congratulations={congratulations} student={student} />
      </div>
    </div>
  )
}
