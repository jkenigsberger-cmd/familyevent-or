import React from 'react'
import { cn } from '../../lib/utils'
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string; helper?: string }
export function Input({ label, error, helper, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g,'-')
  return <div className="flex flex-col gap-1.5">
    {label&&<label htmlFor={inputId} className="text-sm font-medium text-warm-700">{label}</label>}
    <input id={inputId} className={cn('w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-warm-900 placeholder-warm-400 focus:outline-none focus:ring-2 transition-colors', error?'border-red-300 focus:border-red-400 focus:ring-red-500/20':'border-warm-200 focus:border-primary-400 focus:ring-primary-500/20', className)} {...props}/>
    {error&&<p className="text-xs text-red-500">{error}</p>}
    {helper&&!error&&<p className="text-xs text-warm-400">{helper}</p>}
  </div>
}