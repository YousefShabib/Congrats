import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DASHBOARD_GRADUATE_KEY } from '@/lib/feature-flags'
import { DEFAULT_GRADUATE_ID } from '@/supabase/constants'

interface GraduateSessionContextValue {
  graduateId: string
  setGraduateId: (id: string) => void
  clearSession: () => void
}

const GraduateSessionContext = createContext<GraduateSessionContextValue | null>(null)

function readStoredId(): string {
  try {
    return localStorage.getItem(DASHBOARD_GRADUATE_KEY) ?? DEFAULT_GRADUATE_ID
  } catch {
    return DEFAULT_GRADUATE_ID
  }
}

export function GraduateSessionProvider({ children }: { children: ReactNode }) {
  const [graduateId, setGraduateIdState] = useState(readStoredId)

  const setGraduateId = useCallback((id: string) => {
    setGraduateIdState(id)
    try {
      localStorage.setItem(DASHBOARD_GRADUATE_KEY, id)
    } catch {
      /* ignore storage errors */
    }
  }, [])

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(DASHBOARD_GRADUATE_KEY)
    } catch {
      /* ignore */
    }
    setGraduateIdState(DEFAULT_GRADUATE_ID)
  }, [])

  const value = useMemo(
    () => ({ graduateId, setGraduateId, clearSession }),
    [graduateId, setGraduateId, clearSession],
  )

  return (
    <GraduateSessionContext.Provider value={value}>{children}</GraduateSessionContext.Provider>
  )
}

export function useGraduateSession() {
  const ctx = useContext(GraduateSessionContext)
  if (!ctx) throw new Error('useGraduateSession must be used within GraduateSessionProvider')
  return ctx
}
