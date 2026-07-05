import { motion } from 'framer-motion'
import { Copy, GraduationCap, QrCode, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function Footer({ shareUrl }: { shareUrl?: string }) {
  const [copied, setCopied] = useState(false)
  const link = shareUrl ?? window.location.href

  const handleCopy = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="relative border-t border-luxury-gold/15 bg-white/40 py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-12 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold to-luxury-gold-dark text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal">Congrats</h3>
                <p className="text-xs text-muted">منصة التهاني الفاخرة</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">
              احتفل بلحظات التخرج بطريقة استثنائية. شارك الفرح مع من تحب.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="mb-4 text-sm font-semibold text-charcoal">شارك الرابط</h4>
            <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-luxury-gold/20 bg-white/60 p-2">
              <Share2 className="mr-1 h-4 w-4 shrink-0 text-luxury-gold" />
              <span className="font-english flex-1 truncate text-xs text-muted" dir="ltr">
                {link}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="shrink-0"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? 'تم!' : 'نسخ'}
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col items-center md:items-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="mb-4 text-sm font-semibold text-charcoal">رمز QR</h4>
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-luxury-gold/20 bg-white/80">
              <div className="grid grid-cols-5 gap-0.5 p-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 rounded-sm ${
                      [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 20, 22, 23, 24].includes(i)
                        ? 'bg-charcoal'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted">
              <QrCode className="h-3 w-3" />
              امسح للمشاركة
            </p>
          </motion.div>
        </div>

        <div className="mt-12 border-t border-luxury-gold/10 pt-8 text-center">
          <p className="text-xs text-muted">
            © 2026 Congrats Platform. صُنع بحب للخريجين.
          </p>
        </div>
      </div>
    </footer>
  )
}
