import { useState, useEffect, useCallback } from 'react'
import { UserPlus, Link, Users, Shield } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { AppLayout } from '../../components/layout/AppLayout'
import { MemberCard } from '../../components/household/MemberCard'
import { InviteLinkModal } from '../../components/household/InviteLinkModal'
import { AddMemberModal } from '../../components/household/AddMemberModal'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import type { HouseholdMember } from '../../types'
export function HouseholdPage() {
  const { user, household } = useAuthStore()
  const [members, setMembers] = useState<HouseholdMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInvite, setShowInvite] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [error, setError] = useState('')
  const loadMembers = useCallback(async () => {
    if (!household) return
    setLoading(true); setError('')
    try { const { data, error: fe } = await supabase.from('household_members').select('*, person_profile:person_profiles(*)').eq('household_id',household.id).order('created_at',{ascending:true}); if(fe)throw fe; setMembers((data||[]) as HouseholdMember[]) }
    catch (err: unknown) { setError(err instanceof Error?err.message:'Failed') } finally { setLoading(false) }
  }, [household])
  useEffect(() => { loadMembers() }, [loadMembers])
  const activeMembers = members.filter(m=>m.status==='active')
  const pendingMembers = members.filter(m=>m.status!=='active')
  const isAdmin = members.find(m=>m.person_profile?.user_id===user?.id)?.role==='admin'
  if (!household) return <AppLayout><div className="text-center py-16 text-warm-500">No household found.</div></AppLayout>
  return (
    <AppLayout>
      <div className="space-y-6">
        <div><div className="flex items-center gap-2 mb-1"><div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center"><span className="text-lg">🏡</span></div><h1 className="text-2xl font-bold text-warm-900">{household.name}</h1></div><p className="text-warm-500 text-sm">{activeMembers.length} {activeMembers.length===1?'member':'members'}</p></div>
        {isAdmin&&<div className="flex gap-2"><Button variant="primary" size="sm" onClick={()=>setShowAdd(true)}><UserPlus size={15}/>Add member</Button><Button variant="secondary" size="sm" onClick={()=>setShowInvite(true)}><Link size={15}/>Invite by link</Button></div>}
        {error&&<div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
        <Card padding="none">
          <div className="px-4 py-3 border-b border-warm-100 flex items-center gap-2"><Users size={16} className="text-warm-500"/><span className="font-semibold text-warm-800 text-sm">Members</span></div>
          {loading?<div className="flex items-center justify-center py-10"><div className="animate-spin w-6 h-6 border-2 border-primary-200 border-t-primary-500 rounded-full"/></div>:activeMembers.length===0?<div className="py-10 text-center text-warm-400 text-sm">No members yet.</div>:<div className="p-2 divide-y divide-warm-50">{activeMembers.map(m=><MemberCard key={m.id} member={m} isCurrentUser={m.person_profile?.user_id===user?.id}/>)}</div>}
        </Card>
        {pendingMembers.length>0&&<Card padding="none"><div className="px-4 py-3 border-b border-warm-100 flex items-center gap-2"><Shield size={16} className="text-warm-500"/><span className="font-semibold text-warm-800 text-sm">Pending</span><span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{pendingMembers.length}</span></div><div className="p-2 divide-y divide-warm-50">{pendingMembers.map(m=><MemberCard key={m.id} member={m} isCurrentUser={m.person_profile?.user_id===user?.id}/>)}</div></Card>}
      </div>
      {showInvite&&<InviteLinkModal onClose={()=>setShowInvite(false)}/>}
      {showAdd&&<AddMemberModal onClose={()=>setShowAdd(false)} onAdded={m=>setMembers(prev=>[...prev,m])}/>}
    </AppLayout>
  )
}