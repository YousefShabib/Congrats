import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signUp } from '@/services/auth.service'
import { toSupabaseError } from '@/supabase/errors'
import { useAuth } from '@/providers/AuthProvider'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'

export function RegisterPage() {
  const navigate = useNavigate()
  const { session, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (authLoading) return <LuxuryLoader />
  if (session) return <Navigate to="/register/profile" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين')
      return
    }
    if (password.length < 6) {
      setError('كلمة المرور 6 أحرف على الأقل')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await signUp(email.trim(), password)
      navigate('/register/profile')
    } catch (err) {
      setError(toSupabaseError(err).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-white px-4" dir="rtl">
      <div className="w-full max-w-md rounded-2xl border border-soft-beige/60 bg-cream p-8 shadow-card">
        <p className="mb-2 text-center text-xs text-luxury-gold">الخطوة 1 من 2</p>
        <h1 className="editorial-heading mb-2 text-center text-3xl text-charcoal">إنشاء حساب</h1>
        <p className="mb-8 text-center text-sm text-muted">البريد وكلمة المرور فقط</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="editorial-label mb-1 block text-sm">البريد الإلكتروني</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3 font-english"
              dir="ltr"
            />
          </label>
          <label className="block">
            <span className="editorial-label mb-1 block text-sm">كلمة المرور</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="editorial-label mb-1 block text-sm">تأكيد كلمة المرور</span>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <MagneticButton
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-luxury-gold-dark to-luxury-gold py-3 text-white"
          >
            {loading ? 'جاري الإنشاء...' : 'التالي — إكمال الملف'}
          </MagneticButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          لديك حساب؟{' '}
          <Link to="/login" className="text-luxury-gold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  )
}
