export { supabase, initAnalytics } from '@/supabase/client'
export { toSupabaseError, toFirebaseError } from '@/supabase/errors'
export {
  graduateToStudent,
  wishToCongratulation,
  computeStats,
  extractGalleryImages,
} from '@/services/mappers'
export {
  createGraduateProfile,
  getGraduateProfile,
  getGraduateDoc,
  updateGraduateProfile,
  setGraduateFeatured,
  listGraduates,
  listenToGraduateProfile,
  listenToGraduateDoc,
  incrementVisitorCount,
} from '@/services/repositories/graduate.repository'
export {
  getWishes,
  listenToWishesRealTime,
  addWish,
  likeWish,
  pinWish,
  deleteWish,
} from '@/services/repositories/wish.repository'
export {
  getAnalytics,
  upsertAnalytics,
  recordSharePlatform,
  computeAnalyticsFromWishes,
} from '@/services/repositories/analytics.repository'
export { listUniversities, listThemes } from '@/services/repositories/university.repository'
export { uploadImage, getImageDownloadURL } from '@/services/repositories/storage.repository'
export {
  getGraduatePublicUrl,
  getLiveEventUrl,
  getLiveWallUrl,
  getDashboardUrl,
  resolveGraduateId,
  getShareUrl,
} from '@/lib/urls'
