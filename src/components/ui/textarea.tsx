import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[120px] w-full resize-none rounded-xl border border-luxury-gold/20 bg-white/60 px-4 py-3 text-sm text-charcoal backdrop-blur-sm transition-all placeholder:text-muted focus:border-luxury-gold/50 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-luxury-gold/20',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
