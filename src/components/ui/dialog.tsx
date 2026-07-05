import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay asChild {...props}>
      <motion.div
        className={cn('fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-md', className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </DialogPrimitive.Overlay>
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none"
        {...props}
      >
        <motion.div
          className={cn(
            'relative w-full max-w-lg rounded-2xl border border-luxury-gold/25 bg-cream/95 p-6 shadow-2xl shadow-luxury-gold/10 backdrop-blur-2xl sm:p-8',
            className,
          )}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        >
          {children}
          <DialogPrimitive.Close className="absolute left-4 top-4 rounded-full p-1.5 text-muted transition-colors hover:bg-luxury-gold/10 hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-luxury-gold/30">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-6 flex flex-col gap-2 text-center', className)} {...props} />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('editorial-heading text-2xl text-charcoal', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('editorial-body text-sm text-muted', className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
}
