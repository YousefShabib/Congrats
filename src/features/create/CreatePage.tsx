import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { slugifyId } from '@/supabase/errors'
import { useGraduateSession } from '@/providers/GraduateSessionProvider'
import { createGraduateProfile, uploadImage, toFirebaseError } from '@/services/firebase'
import { MagneticButton } from '@/components/ui/MagneticButton'
import type { GraduateInput } from '@/types'

export function CreatePage() {
  const navigate = useNavigate()
  const { setGraduateId } = useGraduateSession()
  const [form, setForm] = useState<GraduateInput>({
    name: '',
    university: '',
    major: '',
    graduationYear: new Date().getFullYear(),
    profileImage: '',
    isOpen: true,
  })
  const [pageId, setPageId] = useState('')
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resolvedId = pageId.trim() || slugifyId(form.name || 'graduate')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      let profileImage = form.profileImage
      if (profileFile) {
        profileImage = await uploadImage(
          profileFile,
          `graduates/${resolvedId}/profile.jpg`,
        )
      }
      if (!profileImage) {
        throw { message: 'صورة الملف الشخصي مطلوبة' }
      }

      await createGraduateProfile(resolvedId, { ...form, profileImage, themeId: 'luxury-gold', plan: 'free' })
      setGraduateId(resolvedId)
      navigate(`/graduate/${resolvedId}`)
    } catch (err) {
      setError(toFirebaseError(err).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white px-4 py-10" dir="rtl">
      <div className="mx-auto max-w-xl">
        <Link to="/" className="mb-6 inline-block text-sm text-luxury-gold hover:underline">
          ← العودة للرئيسية
        </Link>
        <h1 className="editorial-heading mb-2 text-3xl text-charcoal">أنشئ صفحة تخرجك</h1>
        <p className="editorial-body mb-8 text-muted">املأ البيانات لإنشاء صفحتك الفاخرة</p>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-soft-beige/60 bg-cream p-6 shadow-card">
          <Field label="الاسم الكامل">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3"
            />
          </Field>
          <Field label="الجامعة">
            <input
              required
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3"
            />
          </Field>
          <Field label="التخصص">
            <input
              required
              value={form.major}
              onChange={(e) => setForm({ ...form, major: e.target.value })}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3"
            />
          </Field>
          <Field label="سنة التخرج">
            <input
              required
              type="number"
              value={form.graduationYear}
              onChange={(e) => setForm({ ...form, graduationYear: Number(e.target.value) })}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3"
            />
          </Field>
          <Field label="معرّف الصفحة (اختياري)">
            <input
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder={resolvedId}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3 font-english"
              dir="ltr"
            />
          </Field>
          <Field label="صورة الملف الشخصي">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfileFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <MagneticButton
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-luxury-gold-dark to-luxury-gold py-3 text-white disabled:opacity-60"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء الصفحة'}
          </MagneticButton>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="editorial-label mb-2 block text-charcoal">{label}</span>
      {children}
    </label>
  )
}
