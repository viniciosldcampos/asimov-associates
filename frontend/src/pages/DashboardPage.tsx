import { useQuery } from '@tanstack/react-query'
import { FolderKanban, ClipboardCheck, Hourglass, CheckCircle2 } from 'lucide-react'
import MainLayout from '../components/MainLayout'
import StatCard from '../components/StatCard'
import ProcessesByMonthChart from '../components/ProcessesByMonthChart'
import ProcessesByInstanceChart from '../components/ProcessesByInstanceChart'
import UpcomingDeadlinesCard from '../components/UpcomingDeadlinesCard'
import RecentProcessesTable from '../components/RecentProcessesTable'
import {
  getDashboardStats,
  getProcessesByInstance,
  getUpcomingDeadlines,
  getProcessesByMonth,
} from '../services/dashboardService'
import { getRecentProcesses } from '../services/processService'

export default function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  })

  const { data: byInstance } = useQuery({
    queryKey: ['dashboard-by-instance'],
    queryFn: getProcessesByInstance,
  })

  const { data: deadlines } = useQuery({
    queryKey: ['dashboard-upcoming-deadlines'],
    queryFn: getUpcomingDeadlines,
  })

  const { data: byMonth } = useQuery({
    queryKey: ['dashboard-by-month'],
    queryFn: getProcessesByMonth,
  })

  const { data: recentProcesses } = useQuery({
    queryKey: ['dashboard-recent-processes'],
    queryFn: getRecentProcesses,
  })

  // Usa os últimos 6 meses com dados como base para os mini-gráficos dos cards
  const sparklineBase = (byMonth ?? []).slice(0, new Date().getMonth() + 1)

  return (
    <MainLayout subtitle="Aqui está o resumo geral dos seus processos.">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={FolderKanban}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/20"
          label="Total de Processos"
          value={isLoadingStats ? '...' : stats?.totalProcesses ?? 0}
          description="Todos os processos"
          trend={{ value: '+12%', isPositive: true }}
          sparklineData={sparklineBase}
          sparklineColor="#a855f7"
        />
        <StatCard
          icon={ClipboardCheck}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/20"
          label="Em Andamento"
          value={isLoadingStats ? '...' : stats?.inProgress ?? 0}
          description="Ativos no momento"
          trend={{ value: '+8%', isPositive: true }}
          sparklineData={sparklineBase.map((v) => Math.max(0, v - 1))}
          sparklineColor="#3b82f6"
        />
        <StatCard
          icon={Hourglass}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/20"
          label="Prazos Hoje"
          value={isLoadingStats ? '...' : stats?.deadlinesToday ?? 0}
          description="Com prazos vencendo"
          trend={{ value: '-5%', isPositive: false }}
          sparklineData={sparklineBase.map((v) => Math.max(0, v - 2))}
          sparklineColor="#f59e0b"
        />
        <StatCard
          icon={CheckCircle2}
          iconColor="text-green-400"
          iconBg="bg-green-500/20"
          label="Taxa de Sucesso"
          value={isLoadingStats ? '...' : `${stats?.successRate ?? 0}%`}
          description="Processos ganhos"
          trend={{ value: '+3%', isPositive: true }}
          sparklineData={sparklineBase.map((v) => v + 1)}
          sparklineColor="#22c55e"
        />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-2">
          <ProcessesByMonthChart data={byMonth ?? []} />
        </div>
        <ProcessesByInstanceChart data={byInstance ?? []} />
        <UpcomingDeadlinesCard deadlines={deadlines ?? []} />
      </div>

      <RecentProcessesTable processes={recentProcesses ?? []} />
    </MainLayout>
  )
}