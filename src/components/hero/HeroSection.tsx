import { motion } from 'framer-motion'
import { GraduationCap, Sparkles } from 'lucide-react'
import { FloatingParticles } from '@/components/hero/FloatingParticles'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { useSmoothParallax } from '@/hooks/useSmoothParallax'
import type { Student } from '@/types'

interface HeroSectionProps {
  student: Student
  onCongratulate: () => void
}

export function HeroSection({ student, onCongratulate }: HeroSectionProps) {
  const { x, y } = useSmoothParallax(0.018)

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20">
      <FloatingParticles />

      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-gold/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative mb-10"
          style={{ x, y }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="absolute -inset-6 rounded-full bg-gradient-to-br from-luxury-gold/25 via-luxury-gold-light/15 to-transparent blur-2xl"
            animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-2xl shadow-luxury-gold/25 sm:h-48 sm:w-48 md:h-56 md:w-56">
            <img
              src={student.profileImage}
              alt={student.name}
              className="h-full w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
          <motion.div
            className="absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-luxury-gold to-luxury-gold-dark text-white shadow-lg"
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GraduationCap className="h-6 w-6" />
          </motion.div>
        </motion.div>

        <motion.span
          className="editorial-label mb-5 inline-flex items-center gap-2 rounded-full border border-luxury-gold/30 bg-white/50 px-4 py-1.5 text-xs text-luxury-gold-dark backdrop-blur-sm"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          whileHover={{ scale: 1.04 }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="font-english">{student.graduationYear}</span>
          <span>تخرج</span>
        </motion.span>

        <motion.h1
          className="editorial-heading mb-3 text-4xl text-charcoal sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          {student.name}
        </motion.h1>

        <motion.p
          className="font-english mb-8 text-lg font-light text-muted sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          {student.nameEn}
        </motion.p>

        <motion.div
          className="mb-12 flex flex-col items-center gap-2.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          <p className="editorial-body text-lg text-charcoal/85">{student.university}</p>
          <p className="font-english text-sm font-light text-muted">{student.universityEn}</p>
          <div className="mt-3 flex items-center gap-4">
            <span className="h-px w-10 bg-luxury-gold/35" />
            <p className="text-base font-medium text-luxury-gold-dark">{student.major}</p>
            <span className="h-px w-10 bg-luxury-gold/35" />
          </div>
          <p className="font-english text-xs font-light text-muted">{student.majorEn}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          <MagneticButton
            onClick={onCongratulate}
            className="group h-14 gap-2 bg-gradient-to-r from-luxury-gold-dark via-luxury-gold to-luxury-gold-light px-10 text-base font-semibold text-white shadow-xl shadow-luxury-gold/25"
            strength={0.2}
          >
            <Sparkles className="h-5 w-5" />
            <span>أرسل تهنئة</span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-2 text-muted">
          <span className="editorial-label text-[10px]">اكتشف التهاني</span>
          <div className="h-8 w-5 rounded-full border-2 border-luxury-gold/35 p-1">
            <motion.div
              className="mx-auto h-1.5 w-1.5 rounded-full bg-luxury-gold"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
