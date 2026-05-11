import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useAuthStore } from './stores/authStore'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { OnboardingPage } from './pages/onboarding/OnboardingPage'
import { CreateHouseholdPage } from './pages/onboarding/CreateHouseholdPage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { HouseholdPage } from './pages/household/HouseholdPage'
import { AcceptInvitePage } from './pages/invite/AcceptInvitePage'

function LoadingScreen() {
  return <div className="min-h-screen bg-warm-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full" /></div>
}
function Placeholder({ title }: { title: string }) {
  return <div className="min-h-screen bg-warm-50 flex items-center justify-center"><div className="text-center"><p className="text-4xl mb-3">🚧</p><h2 className="text-xl font-bold text-warm-900">{title}</h2><p className="text-warm-500 text-sm mt-1">Coming soon!</p></div></div>
}
function AuthRedirect() {
  const { user, personProfile, household, loading } = useAuthStore()
  const location = useLocation()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/auth/login" state={{ from: location }} replace />
  if (!personProfile) return <Navigate to="/onboarding" replace />
  if (!household) return <Navigate to="/onboarding/household" replace />
  return <Navigate to="/" replace />
}
function PrivateRoute({ children, requireProfile=true, requireHousehold=true }: { children: React.ReactNode; requireProfile?: boolean; requireHousehold?: boolean }) {
  const { user, personProfile, household, loading } = useAuthStore()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/auth/login" replace />
  if (requireProfile && !personProfile) return <Navigate to="/onboarding" replace />
  if (requireHousehold && !household) return <Navigate to="/onboarding/household" replace />
  return <>{children}</>
}
function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { user, personProfile, household, loading } = useAuthStore()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/auth/login" replace />
  if (personProfile && household) return <Navigate to="/" replace />
  return <>{children}</>
}
function AuthProvider({ children }: { children: React.ReactNode }) { useAuth(); return <>{children}</> }
export default function App() {
  return (
    <BrowserRouter><AuthProvider><Routes>
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route path="/invite/:token" element={<AcceptInvitePage />} />
      <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />
      <Route path="/onboarding/household" element={<OnboardingRoute><CreateHouseholdPage /></OnboardingRoute>} />
      <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/household" element={<PrivateRoute><HouseholdPage /></PrivateRoute>} />
      <Route path="/circles" element={<PrivateRoute><Placeholder title="Circles" /></PrivateRoute>} />
      <Route path="/calendar" element={<PrivateRoute><Placeholder title="Calendar" /></PrivateRoute>} />
      <Route path="/events/new" element={<PrivateRoute><Placeholder title="Create Event" /></PrivateRoute>} />
      <Route path="*" element={<AuthRedirect />} />
    </Routes></AuthProvider></BrowserRouter>
  )
}