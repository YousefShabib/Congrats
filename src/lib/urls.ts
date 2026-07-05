import { DEFAULT_GRADUATE_ID } from '@/supabase/constants'

export function getGraduatePublicUrl(graduateId: string): string {
  return `${window.location.origin}/graduate/${graduateId}`
}

export function getLiveEventUrl(graduateId: string): string {
  return `${window.location.origin}/graduate/${graduateId}/live`
}

export function getLiveWallUrl(graduateId: string): string {
  return `${window.location.origin}/graduate/${graduateId}/wall`
}

export function getDashboardUrl(path = ''): string {
  return `/dashboard${path}`
}

export function resolveGraduateId(explicitId?: string): string {
  if (explicitId) return explicitId

  const pathMatch = window.location.pathname.match(/\/graduate\/([^/]+)/)
  if (pathMatch?.[1] && pathMatch[1] !== 'live' && pathMatch[1] !== 'wall') {
    return pathMatch[1]
  }

  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get('g') ?? params.get('graduate')
  if (fromQuery) return fromQuery

  return DEFAULT_GRADUATE_ID
}

// Legacy alias
export const getShareUrl = getGraduatePublicUrl
