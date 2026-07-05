import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect } from 'react'

interface GalleryLightboxProps {
  images: string[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function GalleryLightbox({ images, index, onClose, onNavigate }: GalleryLightboxProps) {
  const goPrev = useCallback(() => {
    if (index === null) return
    onNavigate(index === 0 ? images.length - 1 : index - 1)
  }, [index, images.length, onNavigate])

  const goNext = useCallback(() => {
    if (index === null) return
    onNavigate(index === images.length - 1 ? 0 : index + 1)
  }, [index, images.length, onNavigate])

  useEffect(() => {
    if (index === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goNext()
      if (e.key === 'ArrowRight') goPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, onClose, goPrev, goNext])

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            className="absolute left-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>

          <button
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); goPrev() }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
            onClick={(e) => { e.stopPropagation(); goNext() }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <motion.img
            key={images[index]}
            src={images[index]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          />

          <p className="absolute bottom-6 text-sm text-white/70">
            {index + 1} / {images.length}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
