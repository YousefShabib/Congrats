import { motion } from 'framer-motion'
import { ArrowLeft, GraduationCap, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { SUBSCRIPTION_PLANS } from '@/types'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-warm-white" dir="rtl">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-luxury-gold" />
          <span className="editorial-heading text-xl text-charcoal">Congrats</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <MagneticButton className="border border-luxury-gold/30 bg-white px-5 py-2 text-charcoal">
              تسجيل الدخول
            </MagneticButton>
          </Link>
          <Link to="/dashboard">
            <MagneticButton className="border border-soft-beige bg-cream px-5 py-2 text-charcoal">
              لوحة التحكم
            </MagneticButton>
          </Link>
          <Link to="/register">
            <MagneticButton className="bg-gradient-to-r from-luxury-gold-dark to-luxury-gold px-5 py-2 text-white">
              أنشئ صفحتك
            </MagneticButton>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <motion.section
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="editorial-label mb-4 text-luxury-gold">منصة تهاني التخرج الفاخرة</p>
          <h1 className="editorial-heading mb-6 text-4xl text-charcoal md:text-6xl">
            صفحة تخرج تليق بإنجازك
          </h1>
          <p className="editorial-body mx-auto mb-10 max-w-2xl text-lg text-muted">
            أنشئ صفحة تهاني تفاعلية، شاركها مع أحبائك، وتابع الإحصائيات — منصة SaaS
            جاهزة لآلاف الخريجين من جامعات متعددة.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <MagneticButton className="gap-2 bg-gradient-to-r from-luxury-gold-dark to-luxury-gold px-8 py-4 text-lg text-white">
                <Sparkles className="h-5 w-5" />
                ابدأ مجاناً
              </MagneticButton>
            </Link>
            <Link to={`/graduate/${import.meta.env.VITE_DEFAULT_GRADUATE_ID ?? 'noura-2026'}`}>
              <MagneticButton className="gap-2 border border-soft-beige bg-cream px-8 py-4 text-lg text-charcoal">
                <ArrowLeft className="h-5 w-5" />
                شاهد مثال حي
              </MagneticButton>
            </Link>
          </div>
        </motion.section>

        <section className="mb-20 grid gap-6 md:grid-cols-3">
          {[
            { icon: Users, title: 'آلاف الخريجين', desc: 'بنية SaaS قابلة للتوسع لجامعات متعددة' },
            { icon: Sparkles, title: 'ثيمات فاخرة', desc: 'Luxury Gold، Royal، Minimal وأكثر' },
            { icon: GraduationCap, title: 'تهاني تفاعلية', desc: 'مدار فلكي، Live Wall، ومشاركة فورية' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-soft-beige/60 bg-cream p-6 shadow-card">
              <Icon className="mb-4 h-8 w-8 text-luxury-gold" />
              <h3 className="editorial-heading mb-2 text-xl">{title}</h3>
              <p className="editorial-body text-muted">{desc}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="editorial-heading mb-8 text-center text-3xl">خطط الاشتراك</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.tier}
                className="rounded-2xl border border-soft-beige/60 bg-white p-6 shadow-card"
              >
                <p className="editorial-label mb-1 text-luxury-gold">{plan.label}</p>
                <p className="editorial-heading mb-4 text-2xl">{plan.priceLabel}</p>
                <ul className="space-y-2 text-sm text-muted">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted">
            الدفع غير مفعّل حالياً — البنية جاهزة للاشتراكات المستقبلية
          </p>
        </section>
      </main>
    </div>
  )
}
