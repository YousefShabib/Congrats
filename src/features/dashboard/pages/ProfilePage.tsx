import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDashboard } from '@/hooks/useDashboard'
import { GalleryThumbGrid } from '@/components/profile/GalleryThumbGrid'
import { PublicLinkBar } from '@/components/profile/PublicLinkBar'
import { LuxuryLoader } from '@/components/ui/LuxuryLoader'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { toSupabaseError } from '@/supabase/errors'
import { uploadImage } from '@/services/firebase'

export function ProfilePage() {
  const { doc, loading, updateProfile, error, graduateId } = useDashboard()
  const [saving, setSaving] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)
  const [galleryError, setGalleryError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    university: '',
    major: '',
    graduationYear: new Date().getFullYear(),
    nameEn: '',
    universityEn: '',
    majorEn: '',
    publicBio: '',
  })
  const [gallery, setGallery] = useState<string[]>([])

  useEffect(() => {
    if (!doc) return
    setForm({
      name: doc.name,
      university: doc.university,
      major: doc.major,
      graduationYear: doc.graduationYear,
      nameEn: doc.nameEn ?? '',
      universityEn: doc.universityEn ?? '',
      majorEn: doc.majorEn ?? '',
      publicBio: doc.publicBio ?? '',
    })
    setGallery(doc.publicGallery ?? [])
  }, [doc])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({ ...form, publicGallery: gallery.slice(0, 3) })
    } finally {
      setSaving(false)
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !graduateId) return
    setSaving(true)
    try {
      const url = await uploadImage(file, `graduates/${graduateId}/cover.jpg`)
      await updateProfile({ coverImage: url })
    } catch (err) {
      setGalleryError(toSupabaseError(err).message)
    } finally {
      setSaving(false)
      e.target.value = ''
    }
  }

  async function handleGalleryAdd(files: File[]) {
    if (!files.length) return
    if (!graduateId) {
      setGalleryError('معرّف الصفحة غير موجود — أعد تسجيل الدخول')
      return
    }
    setGalleryUploading(true)
    setGalleryError(null)
    try {
      const next = [...gallery]
      for (let i = 0; i < Math.min(files.length, 3 - next.length); i++) {
        const file = files[i]!
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const url = await uploadImage(
          file,
          `graduates/${graduateId}/gallery/${Date.now()}-${i}.${ext}`,
        )
        next.push(url)
      }
      const trimmed = next.slice(0, 3)
      setGallery(trimmed)
      await updateProfile({ publicGallery: trimmed })
    } catch (err) {
      setGalleryError(toSupabaseError(err).message)
    } finally {
      setGalleryUploading(false)
    }
  }

  async function handleGalleryRemove(index: number) {
    const next = gallery.filter((_, i) => i !== index)
    setGallery(next)
    setGalleryError(null)
    try {
      await updateProfile({ publicGallery: next })
    } catch (err) {
      setGalleryError(toSupabaseError(err).message)
      setGallery(gallery)
    }
  }

  if (loading && !doc) return <LuxuryLoader />

  return (
    <div className="space-y-6">
      <h1 className="editorial-heading text-3xl text-charcoal">الملف الشخصي</h1>

      {graduateId && <PublicLinkBar graduateId={graduateId} />}

      <section className="rounded-2xl border border-luxury-gold/20 bg-cream/50 p-4 text-sm text-muted">
        <p className="mb-2 font-medium text-charcoal">ماذا يرى الزوار في الرابط العام؟</p>
        <ul className="list-inside list-disc space-y-1">
          <li>صورتك والتفاصيل الأساسية</li>
          <li>عبارة أو فقرة عامة</li>
          <li>حتى 3 صور في المعرض</li>
        </ul>
        {graduateId && (
          <Link
            to={`/graduate/${graduateId}/studio`}
            className="mt-3 inline-block text-luxury-gold hover:underline"
          >
            تجربة الاستوديو الكاملة (للخريج فقط)
          </Link>
        )}
      </section>

      <form onSubmit={handleSave} className="space-y-4 rounded-2xl border border-soft-beige/60 bg-white p-6 shadow-card">
        {(['name', 'university', 'major'] as const).map((key) => (
          <label key={key} className="block">
            <span className="editorial-label mb-1 block">
              {key === 'name' ? 'الاسم' : key === 'university' ? 'الجامعة' : 'التخصص'}
            </span>
            <input
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full rounded-xl border border-soft-beige px-4 py-3"
            />
          </label>
        ))}
        <label className="block">
          <span className="editorial-label mb-1 block">سنة التخرج</span>
          <input
            type="number"
            value={form.graduationYear}
            onChange={(e) => setForm({ ...form, graduationYear: Number(e.target.value) })}
            className="w-full rounded-xl border border-soft-beige px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="editorial-label mb-1 block">عبارة عامة (للرابط المشارك)</span>
          <textarea
            value={form.publicBio}
            onChange={(e) => setForm({ ...form, publicBio: e.target.value })}
            rows={4}
            placeholder="اكتب رسالة ترحيب أو فقرة عن رحلتك..."
            className="w-full resize-none rounded-xl border border-soft-beige px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="editorial-label mb-1 block">صورة الغلاف</span>
          <input type="file" accept="image/*" onChange={handleCoverUpload} />
        </label>

        <GalleryThumbGrid
          images={gallery}
          uploading={galleryUploading}
          error={galleryError}
          onAdd={handleGalleryAdd}
          onRemove={(index) => void handleGalleryRemove(index)}
          label="معرض الرابط العام (حتى 3 صور)"
        />

        {error && <p className="text-sm text-red-600">{error.message}</p>}
        <MagneticButton
          type="submit"
          disabled={saving || galleryUploading}
          className="bg-gradient-to-r from-luxury-gold-dark to-luxury-gold px-6 py-3 text-white"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </MagneticButton>
      </form>
    </div>
  )
}
