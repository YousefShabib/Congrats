import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { signIn } from '@/services/auth.service'
import { toFirebaseError } from '@/supabase/errors'
import { useAuth } from '@/providers/AuthProvider'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { session, graduateId, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string })?.from ?? '/dashboard'

  if (authLoading) return <LuxuryLoader />

  if (session) {
    return <Navigate to={graduateId ? from : '/register/profile'} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(toFirebaseError(err).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-warm-white px-4" dir="rtl">
      <div className="w-full max-w-md rounded-2xl border border-soft-beige/60 bg-cream p-8 shadow-card">
        <h1 className="editorial-heading mb-2 text-center text-3xl text-charcoal">تسجيل الدخول</h1>
        <p className="mb-8 text-center text-sm text-muted">ادخل لإدارة تهانيك ولوحة التحكم</p>

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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <MagneticButton
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-luxury-gold-dark to-luxury-gold py-3 text-white"
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </MagneticButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-luxury-gold hover:underline">
            إنشاء حساب
          </Link>
        </p>
      </div>
    </div>
  )
}
