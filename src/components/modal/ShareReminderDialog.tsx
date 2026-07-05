import { motion } from 'framer-motion'
import { Share2, Sparkles } from 'lucide-react'
import { ShareButtons } from '@/components/share/ShareButtons'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ShareReminderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  studentName: string
}

export function ShareReminderDialog({
  open,
  onOpenChange,
  url,
  studentName,
}: ShareReminderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <DialogContent className="max-w-md">
          <DialogHeader>
            <motion.div
              className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-luxury-gold/15"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Share2 className="h-7 w-7 text-luxury-gold-dark" />
            </motion.div>
            <DialogTitle>شارك صفحة التخرج</DialogTitle>
            <DialogDescription>
              ادعُ أصدقاءك وعائلتك لإرسال تهنياتهم لـ {studentName}
            </DialogDescription>
          </DialogHeader>

          <ShareButtons url={url} studentName={studentName} compact />

          <motion.button
            className="mt-4 flex w-full items-center justify-center gap-2 text-sm text-muted transition-colors hover:text-charcoal"
            onClick={() => onOpenChange(false)}
            whileHover={{ scale: 1.02 }}
          >
            <Sparkles className="h-4 w-4" />
            ربما لاحقاً
          </motion.button>
        </DialogContent>
      )}
    </Dialog>
  )
}
