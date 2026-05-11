import React, { useState } from 'react'
import { X, UserPlus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import type { HouseholdMember } from '../../types'
export function AddMemberModal({ onClose, onAdded }: { onClose: ()=>void; onAdded: (m: HouseholdMember)=>void }) {
  const { household } = useAuthStore()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!household||!firstName.trim()||!lastName.trim()) { setError('Name is required'); return }
    setLoading(true); setError('')
    try {
      const { data: profile, error: pe } = await supabase.from('person_profiles').insert({ user_id:null, first_name:firstName.trim(), last_name:lastName.trim(), birthday:birthday||null, email:email||null, avatar_url:null }).select().single()
      if (pe) throw pe
      const { data: member, error: me } = await supabase.from('household_members').insert({ household_id:household.id, person_profile_id:profile.id, role:'member', status:'active', joined_at:new Date().toISOString() }).select().single()
      if (me) throw me
      onAdded({ ...member, person_profile: profile }); onClose()
    } catch (err: unknown) { setError(err instanceof Error?err.message:'Failed') } finally { setLoading(false) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm border border-warm-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-warm-100"><div className="flex items-center gap-2"><UserPlus size={18} className="text-primary-500"/><h3 className="font-semibold text-warm-900">Add family member</h3></div><button onClick={onClose} className="p-1 rounded-lg hover:bg-warm-100"><X size={18} className="text-warm-500"/></button></div>
        <div className="p-4">
          {error&&<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3"><Input label="First name" placeholder="Jane" value={firstName} onChange={e=>setFirstName(e.target.value)} required autoFocus/><Input label="Last name" placeholder="Smith" value={lastName} onChange={e=>setLastName(e.target.value)} required/></div>
            <Input label="Birthday" type="date" value={birthday} onChange={e=>setBirthday(e.target.value)} helper="Optional"/>
            <Input label="Email" type="email" placeholder="jane@example.com" value={email} onChange={e=>setEmail(e.target.value)} helper="Optional"/>
            <div className="flex gap-2 pt-1"><Button type="button" variant="secondary" onClick={onClose} fullWidth>Cancel</Button><Button type="submit" loading={loading} fullWidth>Add member</Button></div>
          </form>
        </div>
      </div>
    </div>
  )
}