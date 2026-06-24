import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  value: string | number
  description: string
}

export default function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-slate-500 text-sm mt-1">{description}</p>
    </div>
  )
}