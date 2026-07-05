import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-luxury-gold-dark via-luxury-gold to-luxury-gold-light text-white shadow-lg shadow-luxury-gold/25 hover:shadow-xl hover:shadow-luxury-gold/30',
        outline:
          'border border-luxury-gold/40 bg-white/60 text-charcoal backdrop-blur-sm hover:bg-luxury-gold/10',
        ghost: 'text-charcoal hover:bg-luxury-gold/10',
        glass: 'glass-gold text-charcoal hover:bg-white/70',
      },
      size: {
        default: 'h-12 px-8 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-14 px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  magnetic?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, magnetic = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    if (magnetic) {
      return (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          >
            {children}
          </Comp>
        </motion.div>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
