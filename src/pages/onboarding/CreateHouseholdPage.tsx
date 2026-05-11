import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
export function CreateHouseholdPage() {
  const navigate = useNavigate()
  const { user, personProfile, setHousehold } = useAuthStore()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user||!personProfile||!name.trim()) { setError('Name required'); return }
    setLoading(true); setError('')
    try {
      const { data: hh, error: he } = await supabase.from('households').insert({ name:name.trim(), created_by:user.id }).select().single()
      if (he) throw he
      const { error: me } = await supabase.from('household_members').insert({ household_id:hh.id, person_profile_id:personProfile.id, role:'admin', status:'active', joined_at:new Date().toISOString() })
      if (me) throw me
      setHousehold(hh); navigate('/')
    } catch (err: unknown) { setError(err instanceof Error?err.message:'Failed') } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-3"><Home size={24} className="text-primary-600"/></div><h1 className="text-2xl font-bold text-warm-900">Create your household</h1><p className="text-warm-500 text-sm mt-1">Step 2 of 2</p></div>
        <div className="flex gap-1.5 mb-6"><div className="flex-1 h-1.5 bg-primary-400 rounded-full"/><div className="flex-1 h-1.5 bg-primary-400 rounded-full"/></div>
        <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-6">
          <div className="text-center mb-6"><div className="text-5xl mb-2">🏡</div></div>
          {error&&<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Household name" placeholder="The Smiths" value={name} onChange={e=>setName(e.target.value)} required autoFocus helper="You can change this later"/>
            <Button type="submit" loading={loading} fullWidth size="lg">Create household 🎉</Button>
          </form>
        </div>
      </div>
    </div>
  )
}