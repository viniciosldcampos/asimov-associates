import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const INSTANCE_LABELS: Record<string, string> = {
  PRIMEIRA_INSTANCIA: '1ª Instância',
  SEGUNDA_INSTANCIA: '2ª Instância',
  SUPERIOR_TRIBUNAL: 'Tribunais Superiores',
}

interface ProcessesByInstanceBarChartProps {
  data: { instance: string; count: number }[]
}

export default function ProcessesByInstanceBarChart({ data }: ProcessesByInstanceBarChartProps) {
  // Mostra apenas as 3 instâncias relevantes: 1ª, 2ª e Tribunais Superiores
  const chartData = Object.entries(INSTANCE_LABELS).map(([key, label]) => ({
    name: label,
    total: data.find((item) => item.instance === key)?.count ?? 0,
  }))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Processos por Instância</h3>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
          <option>Todos</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            labelStyle={{ color: '#fff' }}
            cursor={false}
          />
          <Bar dataKey="total" fill="#a855f7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}