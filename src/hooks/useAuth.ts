import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import type { User, PersonProfile, Household } from '../types'
export function useAuth() {
  const { setUser, setPersonProfile, setHousehold, setLoading, reset } = useAuthStore()
  useEffect(() => {
    if (!isSupabaseConfigured()) { setLoading(false); return }
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { const u: User = { id: session.user.id, email: session.user.email??'', created_at: session.user.created_at }; setUser(u); loadUserData(session.user.id) }
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session?.user) { const u: User = { id: session.user.id, email: session.user.email??'', created_at: session.user.created_at }; setUser(u); await loadUserData(session.user.id) }
      else reset()
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  async function loadUserData(userId: string) {
    setLoading(true)
    try {
      const { data: profileData, error: profileError } = await supabase.from('person_profiles').select('*').eq('user_id', userId).single()
      if (profileError || !profileData) { setPersonProfile(null); setHousehold(null); setLoading(false); return }
      setPersonProfile(profileData as PersonProfile)
      const { data: memberData, error: memberError } = await supabase.from('household_members').select('household_id, households(*)').eq('person_profile_id', profileData.id).eq('status','active').limit(1).single()
      if (!memberError && memberData?.households) setHousehold(memberData.households as unknown as Household)
      else setHousehold(null)
    } catch { setPersonProfile(null); setHousehold(null) }
    finally { setLoading(false) }
  }
}