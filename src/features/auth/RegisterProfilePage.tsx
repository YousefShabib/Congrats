import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { GalleryThumbGrid } from '@/components/profile/GalleryThumbGrid'
import { slugifyId, toSupabaseError } from '@/supabase/errors'
import { useAuth } from '@/providers/AuthProvider'
import { createGraduateProfile, uploadImage } from '@/services/firebase'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import type { GraduateInput } from '@/types'

interface GalleryItem {
  file: File
  preview: string
}

export function RegisterProfilePage() {
  const navigate = useNavigate()
  const { session, user, graduateId, loading: authLoading, refreshGraduate } = useAuth()
  const [form, setForm] = useState<GraduateInput>({
    name: '',
    university: '',
    major: '',
    graduationYear: new Date().getFullYear(),
    profileImage: '',
    publicBio: '',
    publicGallery: [],
    isOpen: true,
  })
  const [pageId, setPageId] = useState('')
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const resolvedId = pageId.trim() || slugifyId(form.name || 'graduate')

  if (authLoading) return <LuxuryLoader />
  if (!session) return <Navigate to="/register" replace />
  if (graduateId) return <Navigate to="/dashboard" replace />

  function handleProfileFile(file: File | null) {
    if (profilePreview) URL.revokeObjectURL(profilePreview)
    setProfileFile(file)
    setProfilePreview(file ? URL.createObjectURL(file) : null)
  }

  function handleGalleryAdd(files: File[]) {
    setGalleryError(null)
    const room = 3 - galleryItems.length
    const picked = files.slice(0, room)
    if (!picked.length) return
    setGalleryItems((prev) => [
      ...prev,
      ...picked.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ])
  }

  function handleGalleryRemove(index: number) {
    setGalleryItems((prev) => {
      const item = prev[index]
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let profileImage = form.profileImage
      if (profileFile) {
        profileImage = await uploadImage(profileFile, `graduates/${resolvedId}/profile.jpg`)
      }
      if (!profileImage) throw { message: 'صورة الملف الشخصي مطلوبة' }

      const galleryUrls: string[] = []
      for (let i = 0; i < galleryItems.length; i++) {
        const item = galleryItems[i]!
        const ext = item.file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const url = await uploadImage(
          item.file,
          `graduates/${resolvedId}/gallery/${i + 1}.${ext}`,
        )
        galleryUrls.push(url)
      }

      await createGraduateProfile(resolvedId, {
        ...form,
        profileImage,
        publicGallery: galleryUrls,
        themeId: 'luxury-gold',
        plan: 'free',
        userId: user!.id,
      })

      await refreshGraduate()
      navigate('/dashboard')
    } catch (err) {
      setError(toSupabaseError(err).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white px-4 py-10" dir="rtl">
      <div className="mx-auto max-w-xl">
        <p className="mb-2 text-xs text-luxury-gold">الخطوة 2 من 2</p>
        <h1 className="editorial-heading mb-2 text-3xl text-charcoal">أكمل ملف تخرجك</h1>
        <p className="editorial-body mb-8 text-muted">
          هذه المعلومات تظهر في الرابط العام الذي تشاركه
        </p>

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
          <Field label="معرّف الرابط العام">
            <input
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder={resolvedId}
              className="w-full rounded-xl border border-soft-beige bg-white px-4 py-3 font-english"
              dir="ltr"
            />
            <p className="mt-1 text-xs text-muted font-english" dir="ltr">
              /graduate/{resolvedId}
            </p>
          </Field>
          <Field label="عبارة أو فقرة للرابط العام">
            <textarea
              value={form.publicBio ?? ''}
              onChange={(e) => setForm({ ...form, publicBio: e.target.value })}
              placeholder="رسالة ترحيبية أو اقتباس يظهر للزوار..."
              rows={3}
              className="w-full resize-none rounded-xl border border-soft-beige bg-white px-4 py-3"
            />
          </Field>
          <Field label="صورة الملف الشخصي *">
            <div className="flex items-center gap-3">
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt=""
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-luxury-gold/30"
                />
              )}
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => handleProfileFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </Field>

          <GalleryThumbGrid
            images={galleryItems.map((item) => item.preview)}
            error={galleryError}
            onAdd={handleGalleryAdd}
            onRemove={handleGalleryRemove}
            label="معرض الصور العام (حتى 3 صور)"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <MagneticButton
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-luxury-gold-dark to-luxury-gold py-3 text-white"
          >
            {loading ? 'جاري الحفظ...' : 'إنشاء الصفحة والذهاب للوحة التحكم'}
          </MagneticButton>
        </form>

        <Link to="/" className="mt-6 inline-block text-sm text-luxury-gold hover:underline">
          ← العودة للرئيسية
        </Link>
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
