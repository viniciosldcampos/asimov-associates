import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const INSTANCE_LABELS: Record<string, string> = {
  PRIMEIRA_INSTANCIA: '1ª Instância',
  SEGUNDA_INSTANCIA: '2ª Instância',
  TRABALHISTA: 'Trabalhista',
  SUPERIOR_TRIBUNAL: 'Superior Tribunal',
  OUTROS: 'Outros',
}

const COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b']

interface ProcessesByInstanceChartProps {
  data: { instance: string; count: number }[]
}

export default function ProcessesByInstanceChart({ data }: ProcessesByInstanceChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  const chartData = data.map((item) => ({
    name: INSTANCE_LABELS[item.instance] ?? item.instance,
    value: item.count,
  }))

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Processos por Instância</h3>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="50%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>

        <ul className="flex-1 space-y-2">
          {chartData.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <li key={item.name} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-300">
                  {item.name} {percentage}% ({item.value})
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}