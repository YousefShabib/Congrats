import { motion } from 'framer-motion'
import { Camera, Eye, Heart, MessageCircle, Users } from 'lucide-react'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'
import type { Stats } from '@/types'

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  delay: number
}

function StatCard({ label, value, icon, delay }: StatCardProps) {
  const { count, ref } = useAnimatedCounter(value)

  return (
    <motion.div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-luxury-gold/15 bg-white/60 p-6 backdrop-blur-xl transition-all hover:border-luxury-gold/30 hover:shadow-lg hover:shadow-luxury-gold/10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-luxury-gold/5 transition-transform group-hover:scale-150" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/15 to-luxury-gold-light/20 text-luxury-gold-dark">
          {icon}
        </div>
        <p className="font-english mb-1 text-3xl font-bold text-charcoal sm:text-4xl">
          {count.toLocaleString('ar-SA')}
        </p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </motion.div>
  )
}

interface StatsSectionProps {
  stats: Stats
}

export function StatsSection({ stats }: StatsSectionProps) {
  const items = [
    { label: 'إجمالي التهاني', value: stats.totalCongratulations, icon: <MessageCircle className="h-6 w-6" /> },
    { label: 'إجمالي الزيارات', value: stats.totalVisitors, icon: <Users className="h-6 w-6" /> },
    { label: 'زيارات اليوم', value: stats.todayVisitors, icon: <Eye className="h-6 w-6" /> },
    { label: 'نشط الآن', value: stats.activeVisitors, icon: <Heart className="h-6 w-6" /> },
    { label: 'الصور المشاركة', value: stats.photosShared, icon: <Camera className="h-6 w-6" /> },
    { label: 'تهاني اليوم', value: stats.todaysWishes, icon: <Heart className="h-6 w-6" /> },
  ]

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="editorial-heading mb-3 text-3xl text-charcoal sm:text-4xl">إحصائيات الاحتفال</h2>
          <p className="editorial-body text-muted">أرقام تعكس حجم الحب والدعم — محدّثة لحظياً</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 md:gap-6">
          {items.map((item, i) => (
            <StatCard key={item.label} {...item} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
