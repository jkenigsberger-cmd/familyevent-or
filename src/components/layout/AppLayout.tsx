import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Users, Circle, Calendar, LogOut, ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { useAuthStore } from '../../stores/authStore'
import { supabase } from '../../lib/supabase'
export function AppLayout({ children }: { children: React.ReactNode }) {
  const { personProfile, household, reset } = useAuthStore()
  const navigate = useNavigate()
  const fullName = personProfile ? `${personProfile.first_name} ${personProfile.last_name}` : 'User'
  async function handleSignOut() { await supabase.auth.signOut(); reset(); navigate('/auth/login') }
  const navItems = [{ to:'/', icon:Home, label:'Home', end:true },{ to:'/household', icon:Users, label:'Household', end:false },{ to:'/circles', icon:Circle, label:'Circles', end:false },{ to:'/calendar', icon:Calendar, label:'Calendar', end:false }]
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <header className="bg-white border-b border-warm-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center"><span className="text-white text-xs font-bold">FT</span></div><span className="font-bold text-warm-900 text-lg">Family<span className="text-primary-500">Table</span></span></div>
          <div className="flex items-center gap-3">
            {household&&<span className="text-sm text-warm-500 hidden sm:block">{household.name}</span>}
            <div className="relative group">
              <button className="flex items-center gap-1.5 rounded-full hover:bg-warm-50 p-1"><Avatar name={fullName} src={personProfile?.avatar_url} size="sm"/><ChevronDown size={14} className="text-warm-400 hidden sm:block"/></button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-warm-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 border-b border-warm-50"><p className="text-sm font-medium text-warm-900 truncate">{fullName}</p><p className="text-xs text-warm-400 truncate">{personProfile?.email}</p></div>
                <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-warm-600 hover:bg-warm-50 hover:text-red-600 transition-colors rounded-b-xl"><LogOut size={15}/>Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-100 z-40">
        <div className="max-w-2xl mx-auto px-2 flex items-center justify-around h-16">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors min-w-[60px]', isActive?'text-primary-500':'text-warm-400 hover:text-warm-600')}>
              {({ isActive }) => (<><Icon size={22} strokeWidth={isActive?2.5:1.8}/><span className={cn('text-xs font-medium', isActive?'text-primary-500':'text-warm-400')}>{label}</span></>)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}