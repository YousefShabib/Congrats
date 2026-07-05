import { Loader2, Plus, X } from 'lucide-react'
import { useRef } from 'react'

interface GalleryThumbGridProps {
  images: string[]
  max?: number
  uploading?: boolean
  error?: string | null
  onRemove: (index: number) => void
  onAdd: (files: File[]) => void | Promise<void>
  label?: string
}

export function GalleryThumbGrid({
  images,
  max = 3,
  uploading = false,
  error,
  onRemove,
  onAdd,
  label = 'معرض الصور',
}: GalleryThumbGridProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const canAdd = images.length < max

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return
    const picked = Array.from(files).slice(0, max - images.length)
    await onAdd(picked)
    e.target.value = ''
  }

  return (
    <div>
      <span className="editorial-label mb-2 block text-charcoal">{label}</span>
      <div className="mt-2 flex flex-wrap items-start gap-3">
        {images.map((src, index) => (
          <div key={`${src}-${index}`} className="group relative h-20 w-20 shrink-0">
            <img
              src={src}
              alt=""
              className="h-full w-full rounded-xl object-cover ring-1 ring-soft-beige/80"
            />
            <button
              type="button"
              aria-label="حذف الصورة"
              disabled={uploading}
              onClick={() => onRemove(index)}
              className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition hover:bg-red-600 disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-soft-beige bg-white text-muted transition hover:border-luxury-gold/50 hover:text-luxury-gold disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span className="text-[10px]">إضافة</span>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => void handleChange(e)}
        />
      </div>

      <p className="mt-2 text-xs text-muted">
        {images.length}/{max} صور · JPG أو PNG · حتى 5 ميجابايت
      </p>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
