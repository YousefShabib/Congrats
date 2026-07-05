import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border border-luxury-gold/20 bg-white/60 px-4 py-2 text-sm text-charcoal backdrop-blur-sm transition-all placeholder:text-muted focus:border-luxury-gold/50 focus:bg-white/80 focus:outline-none focus:ring-2 focus:ring-luxury-gold/20',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
