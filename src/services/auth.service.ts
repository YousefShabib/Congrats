import { supabase } from '@/supabase/client'
import { toSupabaseError } from '@/supabase/errors'

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw toSupabaseError(error)
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw toSupabaseError(error)
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw toSupabaseError(error)
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw toSupabaseError(error)
  return data.session
}
