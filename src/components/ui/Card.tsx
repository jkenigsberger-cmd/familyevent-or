import React from 'react'
import { cn } from '../../lib/utils'
interface CardProps { children: React.ReactNode; className?: string; padding?: 'none'|'sm'|'md'|'lg'; header?: React.ReactNode; onClick?: ()=>void; hoverable?: boolean }
const pc = { none:'', sm:'p-3', md:'p-4', lg:'p-6' }
export function Card({ children, className, padding='md', header, onClick, hoverable=false }: CardProps) {
  return <div className={cn('bg-white rounded-xl border border-warm-100 shadow-card', hoverable&&'cursor-pointer transition-shadow hover:shadow-card-hover', onClick&&'cursor-pointer', className)} onClick={onClick}>{header&&<div className="px-4 py-3 border-b border-warm-100 font-medium text-warm-800">{header}</div>}<div className={pc[padding]}>{children}</div></div>
}