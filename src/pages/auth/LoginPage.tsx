import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Chrome } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!isSupabaseConfigured()) { setError('Supabase not configured.'); return }
    setLoading(true); setError('')
    try { const { error: ae } = await supabase.auth.signInWithPassword({ email, password }); if (ae) throw ae; navigate('/') }
    catch (err: unknown) { setError(err instanceof Error?err.message:'Failed to sign in') }
    finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen bg-warm-50 flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl shadow-lg mb-4"><span className="text-white text-2xl font-bold">FT</span></div>
          <h1 className="text-3xl font-bold text-warm-900">Family<span className="text-primary-500">Table</span></h1>
          <p className="text-warm-500 mt-1 text-sm">Your family, organized</p>
        </div>
        <div className="bg-white rounded-2xl shadow-card border border-warm-100 p-6">
          <h2 className="text-xl font-semibold text-warm-900 mb-5">Welcome back</h2>
          {!isSupabaseConfigured()&&<div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700"><strong>Demo mode:</strong> Add Supabase credentials to enable auth.</div>}
          {error&&<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/>
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required/>
            <Button type="submit" loading={loading} fullWidth size="lg"><Mail size={16}/>Sign in</Button>
          </form>
        </div>
        <p className="text-center text-sm text-warm-500 mt-5">Don't have an account?{' '}<Link to="/auth/signup" className="text-primary-600 font-medium hover:underline">Sign up free</Link></p>
      </div>
    </div>
  )
}