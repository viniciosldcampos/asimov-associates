import type { LucideIcon } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface StatCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  value: string | number
  description: string
  trend?: {
    value: string
    isPositive: boolean
  }
  sparklineData?: number[]
  sparklineColor?: string
}

export default function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  description,
  trend,
  sparklineData,
  sparklineColor = '#a855f7',
}: StatCardProps) {
  const chartData = sparklineData?.map((v, i) => ({ index: i, value: v }))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>

      <p className="text-3xl font-bold text-white mb-1">{value}</p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          {trend ? (
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value}
            </span>
          ) : null}
          <span className="text-slate-500 text-xs">{description}</span>
        </div>

        {chartData && chartData.length > 1 && (
          <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={sparklineColor}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}