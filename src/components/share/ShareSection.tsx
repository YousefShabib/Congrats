import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'
import { QRCodeCard } from '@/components/share/QRCodeCard'
import { ShareButtons } from '@/components/share/ShareButtons'
import type { Student } from '@/types'

interface ShareSectionProps {
  url: string
  student: Student
  liveEventUrl: string
  liveWallUrl: string
}

export function ShareSection({ url, student, liveEventUrl, liveWallUrl }: ShareSectionProps) {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="editorial-label mb-4 inline-flex items-center gap-2 rounded-full border border-luxury-gold/30 bg-white/50 px-4 py-1.5 text-xs text-luxury-gold-dark">
            <Share2 className="h-3.5 w-3.5" />
            شارك الفرح
          </span>
          <h2 className="editorial-heading mb-3 text-3xl text-charcoal sm:text-4xl">
            ادعُ أحبّاءك للتهنئة
          </h2>
          <p className="editorial-body mx-auto max-w-lg text-muted">
            كل مشاركة تجلب تهنئة جديدة — شارك الرابط أو امسح رمز QR
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            className="rounded-2xl border border-luxury-gold/15 bg-white/60 p-8 backdrop-blur-xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="editorial-label mb-4 text-center text-xs text-muted">رابط الصفحة</p>
            <div className="mb-6 rounded-xl border border-luxury-gold/20 bg-cream/80 px-4 py-3 text-center">
              <span className="font-english break-all text-sm text-charcoal" dir="ltr">
                {url}
              </span>
            </div>
            <ShareButtons url={url} studentName={student.name} />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={liveEventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-luxury-gold/30 bg-luxury-gold/10 px-6 py-2.5 text-sm font-medium text-luxury-gold-dark transition-colors hover:bg-luxury-gold/20"
              >
                🎬 وضع العرض المباشر
              </a>
              <a
                href={liveWallUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-luxury-gold/30 bg-luxury-gold/10 px-6 py-2.5 text-sm font-medium text-luxury-gold-dark transition-colors hover:bg-luxury-gold/20"
              >
                📺 جدار التهاني
              </a>
            </div>
          </motion.div>

          <QRCodeCard url={url} student={student} />
        </div>
      </div>
    </section>
  )
}
