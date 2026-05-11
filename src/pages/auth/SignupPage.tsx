import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
export function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured()) { setError('Supabase not configured.'); return }
    if (password.length<6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    try { const { error: ae } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/onboarding` } }); if (ae) throw ae; setSuccess(true) }
    catch (err: unknown) { setError(err instanceof Error?err.message:'Failed') }
    finally { setLoading(false) }
  }
  if (success) return <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4"><div className="text-center"><div className="text-5xl mb-4">📬</div><h2 className="text-2xl font-bold text-warm-900 mb-2">Check your email</h2><p className="text-warm-500 text-sm mb-6">We sent a link to <strong>{email}</strong></p><Button variant="secondary" onClick={()=>navigate('/auth/login')} fullWidth>Back to login</Button></div></div>
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8"><div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl shadow-lg mb-4"><span className="text-white text-2xl font-bold">FT</span></div><h1 className="text-3xl font-bold text-warm-900">Family<span className="text-primary-500">Table</span></h1></div>
        <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-6">
          <h2 className="text-xl font-semibold text-warm-900 mb-5">Create your account</h2>
          {error&&<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <form onSubmit={handleSignup} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <Input label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={e=>setPassword(e.target.value)} required/>
            <Button type="submit" loading={loading} fullWidth size="lg"><Mail size={16}/>Create account</Button>
          </form>
        </div>
        <p className="text-center text-sm text-warm-500 mt-5">Already have an account?{' '}<Link to="/auth/login" className="text-primary-600 font-medium hover:underline">Sign in</Link></p>
      </div>
    </div>
  )
}