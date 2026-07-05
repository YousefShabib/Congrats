import { motion } from 'framer-motion'
import { GraduationCap, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-warm-white px-4" dir="rtl">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <GraduationCap className="mx-auto mb-6 h-16 w-16 text-luxury-gold/60" />
        <h1 className="editorial-heading mb-3 text-6xl text-charcoal">404</h1>
        <p className="editorial-heading mb-2 text-2xl text-charcoal">صفحة التخرج غير موجودة</p>
        <p className="editorial-body mb-8 text-muted">
          الرابط غير صحيح أو تم حذف الصفحة
        </p>
        <Link to="/">
          <MagneticButton className="gap-2 bg-gradient-to-r from-luxury-gold-dark to-luxury-gold px-8 py-3 text-white">
            <Home className="h-5 w-5" />
            <span>العودة للرئيسية</span>
          </MagneticButton>
        </Link>
      </motion.div>
    </div>
  )
}
