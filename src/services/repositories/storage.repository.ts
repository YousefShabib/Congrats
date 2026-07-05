import { supabase } from '@/supabase/client'
import { MAX_IMAGE_SIZE, STORAGE_BUCKET } from '@/supabase/constants'
import { toSupabaseError } from '@/supabase/errors'

export async function uploadImage(file: File, path: string): Promise<string> {
  const isImage =
    file.type.startsWith('image/') ||
    /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name)

  if (!isImage) {
    throw { code: 'validation/invalid-type', message: 'يجب أن يكون الملف صورة (JPG أو PNG)' }
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw { code: 'validation/file-too-large', message: 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' }
  }

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })

  if (error) {
    const msg = error.message ?? 'فشل رفع الصورة'
    if (msg.includes('Bucket not found') || msg.includes('bucket')) {
      throw {
        code: 'storage/bucket-missing',
        message: 'تخزين الصور غير مفعّل — شغّل supabase/schema.sql في Supabase',
      }
    }
    throw toSupabaseError(error)
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function getImageDownloadURL(path: string): Promise<string> {
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
