import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

interface ProcessesByMonthChartProps {
  data: number[]
}

export default function ProcessesByMonthChart({ data }: ProcessesByMonthChartProps) {
  const chartData = MONTH_LABELS.map((label, index) => ({
    month: label,
    total: data[index] ?? 0,
  }))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Processos por Mês</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
          />
          <Bar dataKey="total" fill="#a855f7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}