import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/supabase/client'
import { getGraduateDocByUserId } from '@/services/repositories/graduate.repository'
import { signOut as authSignOut } from '@/services/auth.service'
import type { GraduateDoc } from '@/types'

interface AuthContextValue {
  session: Session | null
  user: User | null
  graduateId: string | null
  graduateDoc: GraduateDoc | null
  loading: boolean
  refreshGraduate: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [graduateId, setGraduateId] = useState<string | null>(null)
  const [graduateDoc, setGraduateDoc] = useState<GraduateDoc | null>(null)
  const [loading, setLoading] = useState(true)

  const loadGraduate = useCallback(async (userId: string) => {
    const grad = await getGraduateDocByUserId(userId)
    setGraduateId(grad?.id ?? null)
    setGraduateDoc(grad ?? null)
  }, [])

  const refreshGraduate = useCallback(async () => {
    if (!user) return
    await loadGraduate(user.id)
  }, [user, loadGraduate])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        loadGraduate(data.session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user) {
        loadGraduate(nextSession.user.id)
      } else {
        setGraduateId(null)
        setGraduateDoc(null)
      }
    })

    return () => sub.subscription.unsubscribe()
  }, [loadGraduate])

  const signOut = useCallback(async () => {
    await authSignOut()
    setSession(null)
    setUser(null)
    setGraduateId(null)
    setGraduateDoc(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user,
      graduateId,
      graduateDoc,
      loading,
      refreshGraduate,
      signOut,
    }),
    [session, user, graduateId, graduateDoc, loading, refreshGraduate, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

/** @deprecated use useAuth().graduateId */
export function useGraduateSession() {
  const { graduateId, refreshGraduate } = useAuth()
  return {
    graduateId: graduateId ?? '',
    setGraduateId: () => refreshGraduate(),
    clearSession: () => {},
  }
}
