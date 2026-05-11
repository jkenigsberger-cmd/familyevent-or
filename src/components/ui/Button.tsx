import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
type Variant = 'primary'|'secondary'|'ghost'|'danger'
type Size = 'sm'|'md'|'lg'
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; loading?: boolean; fullWidth?: boolean; children: React.ReactNode }
const vc: Record<Variant,string> = { primary:'bg-primary-500 hover:bg-primary-600 text-white shadow-sm focus:ring-primary-500', secondary:'bg-white hover:bg-warm-50 text-warm-700 border border-warm-200 focus:ring-primary-500', ghost:'bg-transparent hover:bg-warm-100 text-warm-700 focus:ring-primary-500', danger:'bg-red-500 hover:bg-red-600 text-white shadow-sm focus:ring-red-500' }
const sc: Record<Size,string> = { sm:'px-3 py-1.5 text-sm rounded-lg gap-1.5', md:'px-4 py-2.5 text-sm rounded-lg gap-2', lg:'px-6 py-3 text-base rounded-xl gap-2' }
export function Button({ variant='primary', size='md', loading=false, fullWidth=false, className, disabled, children, ...props }: ButtonProps) {
  return <button className={cn('inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed', vc[variant], sc[size], fullWidth&&'w-full', className)} disabled={disabled||loading} {...props}>{loading&&<Loader2 className="animate-spin shrink-0" size={size==='lg'?18:16}/>}{children}</button>
}