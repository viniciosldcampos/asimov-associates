import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { ProcessListItem } from '../services/processService'

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface ProcessEvolutionChartProps {
  processes: ProcessListItem[]
}

interface TooltipPayloadEntry {
  dataKey: string
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-white text-sm font-medium mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

export default function ProcessEvolutionChart({ processes }: ProcessEvolutionChartProps) {
  const [groupBy, setGroupBy] = useState<'mes' | 'ano'>('mes')
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyData = MONTH_LABELS.slice(0, currentMonth + 1).map((label, index) => {
    const processesUpToMonth = processes.filter((p) => new Date(p.startDate).getMonth() <= index)

    return {
      period: label,
      emAndamento: processesUpToMonth.filter((p) => p.status === 'EM_ANDAMENTO').length,
      concluidos: processesUpToMonth.filter((p) => p.status === 'CONCLUIDO').length,
      vencidos: processesUpToMonth.filter((p) => p.status === 'VENCIDO').length,
    }
  })

  const yearlyData = [currentYear - 2, currentYear - 1, currentYear].map((year) => {
    const processesUpToYear = processes.filter((p) => new Date(p.startDate).getFullYear() <= year)

    return {
      period: String(year),
      emAndamento: processesUpToYear.filter((p) => p.status === 'EM_ANDAMENTO').length,
      concluidos: processesUpToYear.filter((p) => p.status === 'CONCLUIDO').length,
      vencidos: processesUpToYear.filter((p) => p.status === 'VENCIDO').length,
    }
  })

  const chartData = groupBy === 'mes' ? monthlyData : yearlyData

  const legendItems = [
    { label: 'Em andamento', color: '#a855f7' },
    { label: 'Concluídos', color: '#22c55e' },
    { label: 'Vencidos', color: '#ef4444' },
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-semibold">Evolução de Processos</h3>
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value as 'mes' | 'ano')}
          className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300"
        >
          <option value="mes">Por mês</option>
          <option value="ano">Por ano</option>
        </select>
      </div>

      <div className="flex items-center gap-4 mb-3">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-slate-400 text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorEmAndamento" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorConcluidos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="colorVencidos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="emAndamento"
            name="Em andamento"
            stroke="#a855f7"
            strokeWidth={2}
            fill="url(#colorEmAndamento)"
            dot={{ r: 4, fill: '#a855f7', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="concluidos"
            name="Concluídos"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#colorConcluidos)"
            dot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
          <Area
            type="monotone"
            dataKey="vencidos"
            name="Vencidos"
            stroke="#ef4444"
            strokeWidth={2}
            fill="url(#colorVencidos)"
            dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}