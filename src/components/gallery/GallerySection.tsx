import { motion } from 'framer-motion'
import { memo, useState } from 'react'
import { Images } from 'lucide-react'
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox'

interface GallerySectionProps {
  images: string[]
}

export const GallerySection = memo(function GallerySection({ images }: GallerySectionProps) {
  const heights = ['h-64', 'h-48', 'h-72', 'h-56', 'h-64', 'h-52', 'h-64', 'h-60']
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="editorial-label mb-4 inline-flex items-center gap-2 rounded-full border border-luxury-gold/30 bg-white/50 px-4 py-1.5 text-xs text-luxury-gold-dark">
            <Images className="h-3.5 w-3.5" />
            معرض الذكريات
          </span>
          <h2 className="editorial-heading mb-3 text-3xl text-charcoal sm:text-4xl">لحظات لا تُنسى</h2>
          <p className="editorial-body text-muted">اضغط على أي صورة للتكبير</p>
        </motion.div>

        <div className="columns-2 gap-4 md:columns-3 md:gap-6">
          {images.map((src, i) => (
            <motion.div
              key={`${src}-${i}`}
              className="mb-4 break-inside-avoid md:mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.button
                type="button"
                className={`group relative w-full overflow-hidden rounded-2xl ${heights[i % heights.length]} cursor-zoom-in`}
                whileHover={{ scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={src}
                  alt={`ذكرى تخرج ${i + 1}`}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-charcoal/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      <GalleryLightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  )
})
