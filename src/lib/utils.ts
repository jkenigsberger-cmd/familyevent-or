import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function getInitials(name: string) { return name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(p=>p[0].toUpperCase()).join('') }
export function getAgeFromBirthday(birthday: string) { const b=new Date(birthday),t=new Date(); let a=t.getFullYear()-b.getFullYear(); const m=t.getMonth()-b.getMonth(); if(m<0||(m===0&&t.getDate()<b.getDate()))a--; return a }
export function formatBirthday(birthday: string) { return new Date(birthday+'T00:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric'}) }
export function getGreeting() { const h=new Date().getHours(); return h<12?'Good morning':h<17?'Good afternoon':'Good evening' }