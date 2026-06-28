import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { FolderKanban, ClipboardCheck, CheckCircle2, AlertTriangle, TrendingUp, Plus } from 'lucide-react'
import MainLayout from '../components/MainLayout'
import StatCard from '../components/StatCard'
import ProcessesByInstanceBarChart from '../components/ProcessesByInstanceBarChart'
import ProcessEvolutionChart from '../components/ProcessEvolutionChart'
import ProcessByCategoryChart from '../components/ProcessByCategoryChart'
import SuccessRateChart from '../components/SuccessRateChart'
import LawyerPerformanceList from '../components/LawyerPerformanceList'
import ReportFiltersPanel from '../components/ReportFiltersPanel'
import { getDashboardStats, getProcessesByInstance, getProcessesByMonth } from '../services/dashboardService'
import { getAllProcesses } from '../services/processService'
import { getAllLawyers } from '../services/lawyerService'
import { calculateTrend } from '../lib/periodComparison'

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(
    format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd')
  )
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: getDashboardStats })
  const { data: byInstance } = useQuery({
    queryKey: ['dashboard-by-instance'],
    queryFn: getProcessesByInstance,
  })
  const { data: byMonth } = useQuery({ queryKey: ['dashboard-by-month'], queryFn: getProcessesByMonth })
  const { data: processes } = useQuery({ queryKey: ['processes'], queryFn: getAllProcesses })
  const { data: lawyers } = useQuery({ queryKey: ['lawyers'], queryFn: getAllLawyers })

  const completedCount = processes?.filter((p) => p.status === 'CONCLUIDO').length ?? 0
  const expiredCount = processes?.filter((p) => p.status === 'VENCIDO').length ?? 0

  const sparklineBase = (byMonth ?? []).slice(0, new Date().getMonth() + 1)

  const byCategory = useMemo(() => {
    if (!processes) return []
    const counts: Record<string, number> = {}

    processes.forEach((process) => {
      const categoryName = process.category?.name ?? 'Sem categoria'
      counts[categoryName] = (counts[categoryName] ?? 0) + 1
    })

    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [processes])

  const trends = useMemo(() => {
    if (!processes) {
      return {
        total: { value: '0%', isPositive: true },
        inProgress: { value: '0%', isPositive: true },
        completed: { value: '0%', isPositive: true },
        expired: { value: '0%', isPositive: true },
      }
    }

    return {
      total: calculateTrend(processes, startDate, endDate, () => true),
      inProgress: calculateTrend(processes, startDate, endDate, (p) => p.status === 'EM_ANDAMENTO'),
      completed: calculateTrend(processes, startDate, endDate, (p) => p.status === 'CONCLUIDO'),
      expired: calculateTrend(processes, startDate, endDate, (p) => p.status === 'VENCIDO'),
    }
  }, [processes, startDate, endDate])

  return (
    <MainLayout subtitle="Análises completas sobre os processos e desempenho do escritório.">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white text-2xl font-bold">Relatórios</h2>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm">
            {format(new Date(startDate), 'dd/MM/yyyy')} - {format(new Date(endDate), 'dd/MM/yyyy')}
          </div>
          <button className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">
            Comparar períodos
          </button>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Novo Relatório
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-5 gap-4">
            <StatCard
              icon={FolderKanban}
              iconColor="text-purple-400"
              iconBg="bg-purple-500/20"
              label="Total de Processos"
              value={stats?.totalProcesses ?? 0}
              description="vs. período anterior"
              trend={trends.total}
              sparklineData={sparklineBase}
              sparklineColor="#a855f7"
            />
            <StatCard
              icon={ClipboardCheck}
              iconColor="text-blue-400"
              iconBg="bg-blue-500/20"
              label="Em Andamento"
              value={stats?.inProgress ?? 0}
              description="vs. período anterior"
              trend={trends.inProgress}
              sparklineData={sparklineBase.map((v) => Math.max(0, v - 1))}
              sparklineColor="#3b82f6"
            />
            <StatCard
              icon={CheckCircle2}
              iconColor="text-green-400"
              iconBg="bg-green-500/20"
              label="Concluídos"
              value={completedCount}
              description="vs. período anterior"
              trend={trends.completed}
              sparklineData={sparklineBase.map((v) => v + 1)}
              sparklineColor="#22c55e"
            />
            <StatCard
              icon={AlertTriangle}
              iconColor="text-red-400"
              iconBg="bg-red-500/20"
              label="Vencidos"
              value={expiredCount}
              description="vs. período anterior"
              trend={trends.expired}
              sparklineData={sparklineBase.map((v) => Math.max(0, v - 2))}
              sparklineColor="#ef4444"
            />
            <StatCard
              icon={TrendingUp}
              iconColor="text-amber-400"
              iconBg="bg-amber-500/20"
              label="Taxa de Sucesso"
              value={`${stats?.successRate ?? 0}%`}
              description="vs. período anterior"
              trend={{ value: '+3%', isPositive: true }}
              sparklineData={sparklineBase}
              sparklineColor="#f59e0b"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ProcessEvolutionChart processes={processes ?? []} />
            <ProcessByCategoryChart data={byCategory} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ProcessesByInstanceBarChart data={byInstance ?? []} />
            <LawyerPerformanceList lawyers={lawyers ?? []} processes={processes ?? []} />
            <SuccessRateChart processes={processes ?? []} />
          </div>
        </div>

        <ReportFiltersPanel
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>
    </MainLayout>
  )
}