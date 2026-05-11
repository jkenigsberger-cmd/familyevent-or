import React from 'react'
import { cn } from '../../lib/utils'
type V = 'default'|'success'|'warning'|'danger'|'info'
const vc: Record<V,string> = { default:'bg-warm-100 text-warm-600', success:'bg-green-100 text-green-700', warning:'bg-yellow-100 text-yellow-700', danger:'bg-red-100 text-red-700', info:'bg-blue-100 text-blue-700' }
export function Badge({ variant='default', children, className }: { variant?: V; children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', vc[variant], className)}>{children}</span>
}