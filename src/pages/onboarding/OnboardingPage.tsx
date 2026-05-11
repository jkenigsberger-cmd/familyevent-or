import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
export function OnboardingPage() {
  const navigate = useNavigate()
  const { user, setPersonProfile } = useAuthStore()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthday, setBirthday] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user||!firstName.trim()||!lastName.trim()) { setError('Name required'); return }
    setLoading(true); setError('')
    try {
      const { data, error: ie } = await supabase.from('person_profiles').insert({ user_id:user.id, first_name:firstName.trim(), last_name:lastName.trim(), birthday:birthday||null, email:user.email, avatar_url:null }).select().single()
      if (ie) throw ie; setPersonProfile(data); navigate('/onboarding/household')
    } catch (err: unknown) { setError(err instanceof Error?err.message:'Failed') } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3"><User size={24} className="text-primary-600"/></div><h1 className="text-2xl font-bold text-warm-900">Tell us about yourself</h1><p className="text-warm-500 text-sm mt-1">Step 1 of 2</p></div>
        <div className="flex gap-1.5 mb-6"><div className="flex-1 h-1.5 bg-primary-400 rounded-full"/><div className="flex-1 h-1.5 bg-warm-200 rounded-full"/></div>
        <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-6">
          {error&&<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3"><Input label="First name" placeholder="Jane" value={firstName} onChange={e=>setFirstName(e.target.value)} required autoFocus/><Input label="Last name" placeholder="Smith" value={lastName} onChange={e=>setLastName(e.target.value)} required/></div>
            <Input label="Birthday" type="date" value={birthday} onChange={e=>setBirthday(e.target.value)} helper="Optional"/>
            <Button type="submit" loading={loading} fullWidth size="lg">Continue →</Button>
          </form>
        </div>
      </div>
    </div>
  )
}