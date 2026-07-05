import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Loader2, Send, Sparkles } from 'lucide-react'
import { useCallback, useState } from 'react'
import Confetti from 'react-confetti'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSoundSettings } from '@/hooks/useSoundSettings'
import type { WishSubmitPayload } from '@/types'

interface CongratulationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: WishSubmitPayload) => Promise<void>
  disabled?: boolean
}

export function CongratulationModal({
  open,
  onOpenChange,
  onSubmit,
  disabled = false,
}: CongratulationModalProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const { playSuccess } = useSoundSettings()

  const reset = useCallback(() => {
    setName('')
    setMessage('')
    setImagePreview(null)
    setImageFile(null)
    setShowSuccess(false)
    setShowConfetti(false)
    setIsSubmitting(false)
    setError(null)
    setRipples([])
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !message.trim() || disabled || isSubmitting) return

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit({
        senderName: name.trim(),
        message: message.trim(),
        imageFile: imageFile ?? undefined,
      })

      setShowSuccess(true)
      setShowConfetti(true)
      playSuccess()

      setTimeout(() => {
        onOpenChange(false)
        reset()
      }, 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل إرسال التهنئة')
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) reset()
    onOpenChange(value)
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={350}
          gravity={0.35}
          colors={['#c9a962', '#e8d5a3', '#a68b4b', '#f7f3ed', '#fffdf9']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        />
      )}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        {open && (
          <DialogContent>
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center py-8"
                  initial={{ opacity: 0, scale: 0.75, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  <motion.div
                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-luxury-gold/30 to-luxury-gold-light/40"
                    animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 0.7 }}
                  >
                    <Sparkles className="h-10 w-10 text-luxury-gold-dark" />
                  </motion.div>
                  <h3 className="editorial-heading mb-2 text-2xl text-charcoal">تم إرسال تهنئتك!</h3>
                  <p className="editorial-body text-muted">ستظهر رسالتك الآن في مدار التهاني</p>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <DialogHeader>
                    <DialogTitle>أرسل تهنئة</DialogTitle>
                    <DialogDescription>
                      شارك فرحتك مع الخريجة في رسالة خاصة
                    </DialogDescription>
                  </DialogHeader>

                  {error && (
                    <motion.p
                      className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-600"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.p>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="editorial-label mb-2 block text-sm text-charcoal">
                        اسمك <span className="text-luxury-gold">*</span>
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="اكتب اسمك هنا"
                        required
                        disabled={isSubmitting || disabled}
                      />
                    </div>

                    <div>
                      <label className="editorial-label mb-2 block text-sm text-charcoal">
                        رسالتك <span className="text-luxury-gold">*</span>
                      </label>
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="اكتب رسالة تهنئة من القلب..."
                        required
                        disabled={isSubmitting || disabled}
                      />
                    </div>

                    <div>
                      <label className="editorial-label mb-2 block text-sm text-charcoal">
                        صورة (اختياري)
                      </label>
                      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-luxury-gold/25 bg-white/40 p-6 transition-all duration-300 hover:border-luxury-gold/40 hover:bg-white/60 hover:shadow-lg hover:shadow-luxury-gold/10">
                        {imagePreview ? (
                          <motion.img
                            src={imagePreview}
                            alt="Preview"
                            className="h-24 w-24 rounded-full object-cover"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          />
                        ) : (
                          <>
                            <ImagePlus className="mb-2 h-8 w-8 text-luxury-gold/60" />
                            <span className="text-sm text-muted">اضغط لرفع صورة</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                          disabled={isSubmitting || disabled}
                        />
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="relative w-full overflow-hidden"
                      size="lg"
                      disabled={isSubmitting || disabled}
                      onClick={addRipple}
                    >
                      {ripples.map((r) => (
                        <motion.span
                          key={r.id}
                          className="pointer-events-none absolute rounded-full bg-white/40"
                          style={{ left: r.x, top: r.y, width: 4, height: 4, marginLeft: -2, marginTop: -2 }}
                          initial={{ scale: 0, opacity: 0.8 }}
                          animate={{ scale: 40, opacity: 0 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      ))}
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      {isSubmitting ? 'جاري الإرسال...' : 'إرسال التهنئة'}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
