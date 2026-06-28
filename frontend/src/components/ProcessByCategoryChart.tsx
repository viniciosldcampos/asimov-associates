import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#64748b']

interface ProcessByCategoryChartProps {
  data: { name: string; value: number }[]
}

export default function ProcessByCategoryChart({ data }: ProcessByCategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Processos por Área do Direito</h3>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
          <option>Todos</option>
        </select>
      </div>

      {data.length === 0 ? (
        <p className="text-slate-500 text-sm">Nenhuma categoria vinculada a processos.</p>
      ) : (
        <div className="flex items-center gap-4">
          <ResponsiveContainer width="50%" height={200}>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>

          <ul className="flex-1 space-y-2">
            {data.map((item, index) => {
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
      )}
    </div>
  )
}