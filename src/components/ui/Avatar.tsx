import { cn, getInitials } from '../../lib/utils'
type AvatarSize = 'xs'|'sm'|'md'|'lg'|'xl'
interface AvatarProps { name: string; src?: string|null; size?: AvatarSize; className?: string }
const sizes: Record<AvatarSize,string> = { xs:'w-6 h-6 text-xs', sm:'w-8 h-8 text-sm', md:'w-10 h-10 text-base', lg:'w-14 h-14 text-xl', xl:'w-20 h-20 text-2xl' }
const colors = ['bg-orange-100 text-orange-700','bg-teal-100 text-teal-700','bg-purple-100 text-purple-700','bg-blue-100 text-blue-700','bg-pink-100 text-pink-700','bg-yellow-100 text-yellow-700','bg-green-100 text-green-700','bg-indigo-100 text-indigo-700']
function colorFromName(name: string) { let h=0; for(let i=0;i<name.length;i++)h=name.charCodeAt(i)+((h<<5)-h); return colors[Math.abs(h)%colors.length] }
export function Avatar({ name, src, size='md', className }: AvatarProps) {
  const initials = getInitials(name)
  if (src) return <img src={src} alt={name} className={cn('rounded-full object-cover shrink-0', sizes[size], className)} />
  return <div className={cn('rounded-full flex items-center justify-center font-semibold shrink-0', sizes[size], colorFromName(name), className)} title={name}>{initials}</div>
}