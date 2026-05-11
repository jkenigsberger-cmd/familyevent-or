import { Calendar } from 'lucide-react'
import type { HouseholdMember } from '../../types'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { formatBirthday, getAgeFromBirthday } from '../../lib/utils'
export function MemberCard({ member, isCurrentUser=false }: { member: HouseholdMember; isCurrentUser?: boolean }) {
  const p = member.person_profile
  if (!p) return null
  const fullName = `${p.first_name} ${p.last_name}`
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-warm-50 transition-colors">
      <Avatar name={fullName} src={p.avatar_url} size="md"/>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5"><p className="font-medium text-warm-900 text-sm truncate">{fullName}</p>{isCurrentUser&&<span className="text-xs text-warm-400">(you)</span>}</div>
        {p.birthday ? <div className="flex items-center gap-1 text-xs text-warm-400 mt-0.5"><Calendar size={11}/><span>{formatBirthday(p.birthday)} · Age {getAgeFromBirthday(p.birthday)}</span></div> : <p className="text-xs text-warm-300 mt-0.5">No birthday set</p>}
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge variant={member.role==='admin'?'info':'default'}>{member.role}</Badge>
        {member.status!=='active'&&<Badge variant={member.status==='invited'?'warning':'default'}>{member.status}</Badge>}
      </div>
    </div>
  )
}