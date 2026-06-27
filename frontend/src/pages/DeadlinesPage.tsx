import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Clock, Hourglass, CalendarDays, Plus, Download } from 'lucide-react'
import MainLayout from '../components/MainLayout'
import StatCard from '../components/StatCard'
import MiniCalendar from '../components/MiniCalendar'
import DeadlineFormModal from '../components/DeadlineFormModal'
import { getAllDeadlines } from '../services/deadlineService'
import { getDaysRemaining, getDeadlineUrgencyLabel, matchesFilter } from '../lib/deadlineUtils'
import type { DeadlineFilter } from '../lib/deadlineUtils'

const TABS: { key: DeadlineFilter; label: string }[] = [
  { key: 'TODOS', label: 'Todos' },
  { key: 'VENCIDOS', label: 'Vencidos' },
  { key: 'VENCE_HOJE', label: 'Vencem Hoje' },
  { key: 'PROXIMOS_7', label: 'Próximos 7 dias' },
  { key: 'PROXIMOS_30', label: 'Próximos 30 dias' },
]

export default function DeadlinesPage() {
  const [activeTab, setActiveTab] = useState<DeadlineFilter>('TODOS')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: deadlines, isLoading } = useQuery({
    queryKey: ['deadlines'],
    queryFn: getAllDeadlines,
  })

  const counts = useMemo(() => {
    const all = deadlines ?? []
    return {
      total: all.length,
      vencidos: all.filter((d) => matchesFilter(d.date, 'VENCIDOS')).length,
      venceHoje: all.filter((d) => matchesFilter(d.date, 'VENCE_HOJE')).length,
      proximos7: all.filter((d) => matchesFilter(d.date, 'PROXIMOS_7')).length,
      proximos30: all.filter((d) => matchesFilter(d.date, 'PROXIMOS_30')).length,
    }
  }, [deadlines])

  const filtered = useMemo(() => {
    if (!deadlines) return []
    return [...deadlines]
      .filter((d) => matchesFilter(d.date, activeTab))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [deadlines, activeTab])

  const upcomingDeadlines = useMemo(() => {
    if (!deadlines) return []
    return [...deadlines]
      .filter((d) => getDaysRemaining(d.date) >= 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }, [deadlines])

  return (
    <MainLayout subtitle="Acompanhe e gerencie todos os prazos dos seus processos.">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white text-2xl font-bold">Prazos</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Prazo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Calendar}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/20"
          label="Total de Prazos"
          value={counts.total}
          description="Todos os prazos"
        />
        <StatCard
          icon={Clock}
          iconColor="text-red-400"
          iconBg="bg-red-500/20"
          label="Prazos Vencidos"
          value={counts.vencidos}
          description="Precisa de atenção"
        />
        <StatCard
          icon={Hourglass}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/20"
          label="Vencem Hoje"
          value={counts.venceHoje}
          description="Prazos para hoje"
        />
        <StatCard
          icon={CalendarDays}
          iconColor="text-green-400"
          iconBg="bg-green-500/20"
          label="Próximos 7 dias"
          value={counts.proximos7}
          description="Prazos próximos"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.key !== 'TODOS' && (
                  <span className="bg-slate-700/50 text-xs px-1.5 py-0.5 rounded">
                    {tab.key === 'VENCIDOS' && counts.vencidos}
                    {tab.key === 'VENCE_HOJE' && counts.venceHoje}
                    {tab.key === 'PROXIMOS_7' && counts.proximos7}
                    {tab.key === 'PROXIMOS_30' && counts.proximos30}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            {isLoading ? (
              <p className="text-slate-500 text-sm">Carregando...</p>
            ) : filtered.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhum prazo encontrado.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-800">
                    <th className="pb-3 font-medium">Prazo</th>
                    <th className="pb-3 font-medium">Processo</th>
                    <th className="pb-3 font-medium">Advogado</th>
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Dias</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((deadline) => {
                    const { text, color } = getDeadlineUrgencyLabel(deadline.date)

                    return (
                      <tr
                        key={deadline.id}
                        className="border-b border-slate-800/50 last:border-0"
                      >
                        <td className="py-3 text-slate-200">{deadline.title}</td>
                        <td className="py-3 text-slate-300">{deadline.process?.number ?? '—'}</td>
                        <td className="py-3 text-slate-300">{deadline.lawyer.name}</td>
                        <td className="py-3 text-slate-500">
                          {format(new Date(deadline.date), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className={`py-3 font-medium ${color}`}>{text}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="w-80 space-y-4">
          <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Próximos Prazos</h3>
            {upcomingDeadlines.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhum prazo próximo.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingDeadlines.map((deadline) => (
                  <li key={deadline.id} className="text-sm">
                    <p className="text-slate-200">{deadline.title}</p>
                    <p className="text-slate-500 text-xs">
                      {format(new Date(deadline.date), "EEEE, d 'de' MMM", { locale: ptBR })}
                    </p>
                    <p className="text-slate-500 text-xs">Proc. {deadline.process?.number}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && <DeadlineFormModal onClose={() => setIsModalOpen(false)} />}
    </MainLayout>
  )
}