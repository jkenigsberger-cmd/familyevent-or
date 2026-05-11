import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Users, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import type { HouseholdInvite } from '../../types'
type Step = 'loading'|'invalid'|'view'|'complete-profile'|'confirm'|'joined'
export function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { user, personProfile, setPersonProfile, setHousehold } = useAuthStore()
  const [step, setStep] = useState<Step>('loading')
  const [invite, setInvite] = useState<HouseholdInvite|null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  useEffect(() => { loadInvite() }, [token])
  async function loadInvite() {
    if (!token) { setStep('invalid'); return }
    try {
      const { data, error: fe } = await supabase.from('household_invites').select('*, household:households(*)').eq('token',token).single()
      if (fe||!data||new Date(data.expires_at)<new Date()) { setStep('invalid'); return }
      setInvite(data as HouseholdInvite)
      setStep(!user?'view':!personProfile?'complete-profile':'confirm')
    } catch { setStep('invalid') }
  }
  async function handleJoin() {
    if (!invite||!personProfile) return
    setLoading(true); setError('')
    try {
      const { error: me } = await supabase.from('household_members').insert({ household_id:invite.household_id, person_profile_id:personProfile.id, role:'member', status:'active', joined_at:new Date().toISOString() })
      if (me) throw me
      if (invite.household) setHousehold(invite.household)
      setStep('joined')
    } catch (err: unknown) { setError(err instanceof Error?err.message:'Failed') } finally { setLoading(false) }
  }
  const hhName = invite?.household?.name||'this household'
  if (step==='loading') return <div className="min-h-screen bg-warm-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary-200 border-t-primary-500 rounded-full"/></div>
  if (step==='invalid') return <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4"><div className="text-center"><div className="text-5xl mb-4">🔗</div><h2 className="text-xl font-bold text-warm-900 mb-2">Invalid invite link</h2><Button onClick={()=>navigate('/auth/login')} variant="secondary">Go to login</Button></div></div>
  if (step==='joined') return <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4"><div className="text-center"><div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4"><CheckCircle size={32} className="text-green-600"/></div><h2 className="text-2xl font-bold text-warm-900 mb-4">Welcome to the family! 🎉</h2><Button onClick={()=>navigate('/household')} fullWidth size="lg">View household</Button></div></div>
  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6"><div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3"><Users size={24} className="text-primary-600"/></div><h1 className="text-2xl font-bold text-warm-900">Join <span className="text-primary-500">{hhName}</span></h1></div>
        <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-6">
          {error&&<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          {step==='view'&&<div className="space-y-3"><Button variant="primary" fullWidth size="lg" onClick={()=>navigate(`/auth/signup?invite=${token}`)}>Create account & join</Button><Button variant="secondary" fullWidth size="lg" onClick={()=>navigate(`/auth/login?invite=${token}`)}>Sign in to join</Button></div>}
          {step==='confirm'&&<div className="space-y-4"><div className="bg-warm-50 rounded-xl p-4 text-center"><p className="text-warm-700 text-sm">Joining as <strong>{personProfile?.first_name} {personProfile?.last_name}</strong></p></div><Button onClick={handleJoin} loading={loading} fullWidth size="lg">Join {hhName} 🎉</Button><p className="text-xs text-warm-400 text-center">Not you? <Link to="/auth/login" className="text-primary-500">Sign in with a different account</Link></p></div>}
        </div>
      </div>
    </div>
  )
}