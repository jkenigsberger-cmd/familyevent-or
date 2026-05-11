import { useState, useEffect } from 'react'
import { X, Copy, Check, MessageCircle, Link, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/Button'
import { formatDistanceToNow } from 'date-fns'
export function InviteLinkModal({ onClose }: { onClose: ()=>void }) {
  const { user, household } = useAuthStore()
  const [link, setLink] = useState('')
  const [expiresAt, setExpiresAt] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => { generateInvite() }, [])
  async function generateInvite() {
    if (!user||!household) return
    setLoading(true); setError('')
    try {
      const { data, error: ie } = await supabase.from('household_invites').insert({ household_id:household.id, created_by:user.id, expires_at:new Date(Date.now()+7*24*60*60*1000).toISOString(), max_uses:null }).select().single()
      if (ie) throw ie
      setLink(`${window.location.origin}/invite/${data.token}`); setExpiresAt(data.expires_at)
    } catch (err: unknown) { setError(err instanceof Error?err.message:'Failed') } finally { setLoading(false) }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(link) } catch { const el=document.createElement('textarea'); el.value=link; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el) }
    setCopied(true); setTimeout(()=>setCopied(false),2000)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm border border-warm-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-warm-100"><div className="flex items-center gap-2"><Link size={18} className="text-primary-500"/><h3 className="font-semibold text-warm-900">Invite to household</h3></div><button onClick={onClose} className="p-1 rounded-lg hover:bg-warm-100"><X size={18} className="text-warm-500"/></button></div>
        <div className="p-4 space-y-4">
          {error&&<div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          {loading?<div className="flex items-center justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary-200 border-t-primary-500 rounded-full"/></div>:(
            <><div><p className="text-sm text-warm-600 mb-2">Share this link to invite people to <strong>{household?.name}</strong>:</p>
              <div className="flex items-center gap-2"><div className="flex-1 bg-warm-50 border border-warm-200 rounded-lg px-3 py-2 text-xs font-mono truncate">{link}</div><button onClick={copy} className="p-2 rounded-lg bg-warm-100 hover:bg-warm-200">{copied?<Check size={16} className="text-green-600"/>:<Copy size={16} className="text-warm-600"/>}</button></div>
              {expiresAt&&<p className="text-xs text-warm-400 mt-1.5">Expires {formatDistanceToNow(new Date(expiresAt),{addSuffix:true})}</p>}</div>
              <div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={copy} size="sm" fullWidth>{copied?<Check size={14}/>:<Copy size={14}/>}{copied?'Copied!':'Copy link'}</Button><Button onClick={()=>window.open(`https://wa.me/?text=${encodeURIComponent(`Join our household on FamilyTable: ${link}`)}`, '_blank')} size="sm" fullWidth className="bg-[#25D366] hover:bg-[#1fb855] text-white"><MessageCircle size={14}/>WhatsApp</Button></div>
              <div className="border-t border-warm-100 pt-3"><button onClick={generateInvite} className="flex items-center gap-1.5 text-xs text-warm-400 hover:text-warm-600"><RefreshCw size={12}/>Generate new link</button></div></>
          )}
        </div>
      </div>
    </div>
  )
}