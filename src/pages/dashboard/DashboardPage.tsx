import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Users, UserPlus, Cake } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { AppLayout } from '../../components/layout/AppLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { getGreeting, formatBirthday, getAgeFromBirthday } from '../../lib/utils'
import type { HouseholdMember } from '../../types'
function getUpcomingBirthdays(members: HouseholdMember[]) {
  const today = new Date(); today.setHours(0,0,0,0)
  return members.filter(m=>m.person_profile?.birthday&&m.status==='active').map(m=>{
    const p=m.person_profile!; const bday=new Date(p.birthday!+'T00:00:00')
    const thisYear=new Date(today.getFullYear(),bday.getMonth(),bday.getDate())
    if(thisYear<today)thisYear.setFullYear(today.getFullYear()+1)
    const daysUntil=Math.round((thisYear.getTime()-today.getTime())/(1000*60*60*24))
    return { name:`${p.first_name} ${p.last_name}`, birthday:p.birthday!, daysUntil, age:getAgeFromBirthday(p.birthday!)+(thisYear.getFullYear()>today.getFullYear()?1:0), avatarUrl:p.avatar_url }
  }).filter(b=>b.daysUntil<=30).sort((a,b)=>a.daysUntil-b.daysUntil)
}
export function DashboardPage() {
  const navigate = useNavigate()
  const { personProfile, household } = useAuthStore()
  const [members, setMembers] = useState<HouseholdMember[]>([])
  const [loading, setLoading] = useState(true)
  const loadMembers = useCallback(async () => {
    if (!household) return
    try { const { data } = await supabase.from('household_members').select('*, person_profile:person_profiles(*)').eq('household_id',household.id); setMembers((data||[]) as HouseholdMember[]) }
    catch {} finally { setLoading(false) }
  }, [household])
  useEffect(() => { loadMembers() }, [loadMembers])
  const firstName = personProfile?.first_name||'there'
  const activeCount = members.filter(m=>m.status==='active').length
  const birthdays = getUpcomingBirthdays(members)
  return (
    <AppLayout>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-bold text-warm-900">{getGreeting()}, {firstName}! 👋</h1><p className="text-warm-500 text-sm mt-1">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p></div>
        {household&&<Card hoverable padding="md" onClick={()=>navigate('/household')}><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-xl">🏡</div><div><p className="font-semibold text-warm-900">{household.name}</p><p className="text-xs text-warm-400">{loading?'...':`${activeCount} ${activeCount===1?'member':'members'}`}</p></div></div><div className="flex -space-x-2">{members.filter(m=>m.status==='active').slice(0,4).map(m=><Avatar key={m.id} name={`${m.person_profile?.first_name} ${m.person_profile?.last_name}`} src={m.person_profile?.avatar_url} size="sm" className="ring-2 ring-white"/>)}{activeCount>4&&<div className="w-8 h-8 rounded-full bg-warm-100 ring-2 ring-white flex items-center justify-center text-xs text-warm-600">+{activeCount-4}</div>}</div></div></Card>}
        <div><h2 className="text-sm font-semibold text-warm-500 uppercase tracking-wide mb-3">Quick actions</h2><div className="grid grid-cols-3 gap-3">{[{icon:CalendarDays,label:'Create Event',color:'bg-primary-100 text-primary-600',path:'/events/new'},{icon:UserPlus,label:'Invite Someone',color:'bg-accent-100 text-accent-600',path:'/household'},{icon:Users,label:'View Household',color:'bg-purple-100 text-purple-600',path:'/household'}].map(({icon:Icon,label,color,path})=><button key={label} onClick={()=>navigate(path)} className="flex flex-col items-center gap-2 bg-white rounded-xl p-4 border border-warm-100 shadow-card hover:shadow-card-hover transition-shadow"><div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}><Icon size={20}/></div><span className="text-xs font-medium text-warm-700 text-center">{label}</span></button>)}</div></div>
        <div><h2 className="text-sm font-semibold text-warm-500 uppercase tracking-wide mb-3">Upcoming</h2><Card padding="lg"><div className="text-center py-4"><div className="text-4xl mb-3">🗓️</div><p className="font-medium text-warm-700">No events yet</p><p className="text-sm text-warm-400 mt-1">Create your first family event</p><Button variant="secondary" size="sm" className="mt-4" onClick={()=>navigate('/events/new')}>Create event</Button></div></Card></div>
        {birthdays.length>0&&<div><h2 className="text-sm font-semibold text-warm-500 uppercase tracking-wide mb-3">Upcoming birthdays</h2><Card padding="none"><div className="divide-y divide-warm-50">{birthdays.map(b=><div key={b.name} className="flex items-center gap-3 p-3"><Avatar name={b.name} src={b.avatarUrl} size="sm"/><div className="flex-1"><p className="text-sm font-medium text-warm-900">{b.name}</p><div className="flex items-center gap-1 text-xs text-warm-400"><Cake size={11}/><span>{formatBirthday(b.birthday)} · Turns {b.age}</span></div></div><div>{b.daysUntil===0?<span className="text-xs font-semibold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">Today! 🎂</span>:b.daysUntil===1?<span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">Tomorrow!</span>:<span className="text-xs text-warm-400">{b.daysUntil} days</span>}</div></div>)}</div></Card></div>}
      </div>
    </AppLayout>
  )
}