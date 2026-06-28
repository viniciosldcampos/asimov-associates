import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from 'recharts'
import type { ProcessListItem } from '../services/processService'

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface SuccessRateChartProps {
  processes: ProcessListItem[]
}

function formatPercentage(value: unknown) {
  return `${value}%`
}

export default function SuccessRateChart({ processes }: SuccessRateChartProps) {
  const currentMonth = new Date().getMonth()

  const chartData = MONTH_LABELS.slice(0, currentMonth + 1).map((label, index) => {
    const monthProcesses = processes.filter((p) => new Date(p.updatedAt).getMonth() === index)
    const completed = monthProcesses.filter((p) => p.status === 'CONCLUIDO').length
    const expired = monthProcesses.filter((p) => p.status === 'VENCIDO').length
    const finishedTotal = completed + expired
    const rate = finishedTotal > 0 ? Math.round((completed / finishedTotal) * 100) : 0

    return { month: label, taxa: rate }
  })

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Taxa de Sucesso</h3>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
          <option>Por mês</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 20, right: 5, bottom: 0, left: -20 }}>
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            cursor={false}
          />
          <Bar dataKey="taxa" name="Taxa de sucesso" fill="#a855f7" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="taxa" position="top" formatter={formatPercentage} fill="#e2e8f0" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}