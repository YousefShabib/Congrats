import { motion } from 'framer-motion'
import { BookOpen, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { downloadMemoryBook, generateMemoryBookHtml } from '@/utils/memoryBook'
import type { Congratulation, Stats, Student } from '@/types'

interface MemoryBookExportProps {
  student: Student
  wishes: Congratulation[]
  stats: Stats
}

export function MemoryBookExport({ student, wishes, stats }: MemoryBookExportProps) {
  const handleExport = () => {
    const html = generateMemoryBookHtml(student, wishes, stats)
    const filename = `memory-book-${student.name.replace(/\s/g, '-')}.html`
    downloadMemoryBook(html, filename)
  }

  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-3xl px-4">
        <motion.div
          className="flex flex-col items-center rounded-2xl border border-luxury-gold/20 bg-gradient-to-br from-white/70 to-champagne/50 p-10 text-center backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <BookOpen className="mb-4 h-10 w-10 text-luxury-gold-dark" />
          <h3 className="editorial-heading mb-2 text-2xl text-charcoal">كتاب الذكريات</h3>
          <p className="editorial-body mb-6 max-w-md text-muted">
            حمّل نسخة تحتوي على الملف الشخصي، جميع التهاني، والإحصائيات
          </p>
          <Button size="lg" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            تحميل كتاب الذكريات
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
