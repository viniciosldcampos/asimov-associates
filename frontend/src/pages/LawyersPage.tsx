import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, UserCheck, FolderKanban, TrendingUp, Search, Plus } from 'lucide-react'
import MainLayout from '../components/MainLayout'
import StatCard from '../components/StatCard'
import LawyerDetailPanel from '../components/LawyerDetailPanel'
import LawyerFormModal from '../components/LawyerFormModal'
import LawyerEditModal from '../components/LawyerEditModal'
import LawyerActionsMenu from '../components/LawyerActionsMenu'
import { getAllLawyers } from '../services/lawyerService'
import type { LawyerListItem } from '../services/lawyerService'

export default function LawyersPage() {
  const [search, setSearch] = useState('')
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLawyer, setEditingLawyer] = useState<LawyerListItem | null>(null)

  const { data: lawyers, isLoading } = useQuery({
    queryKey: ['lawyers'],
    queryFn: getAllLawyers,
  })

  const filtered = useMemo(() => {
    if (!lawyers) return []
    return lawyers.filter(
      (lawyer) =>
        search.trim() === '' ||
        lawyer.name.toLowerCase().includes(search.toLowerCase()) ||
        lawyer.oab?.toLowerCase().includes(search.toLowerCase())
    )
  }, [lawyers, search])

  const activeCount = lawyers?.filter((l) => l.isActive).length ?? 0

  return (
    <MainLayout subtitle="Gerencie todos os advogados do escritório.">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white text-2xl font-bold">Advogados</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar advogado, OAB..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Advogado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/20"
          label="Total de Advogados"
          value={lawyers?.length ?? 0}
          description="Advogados cadastrados"
        />
        <StatCard
          icon={UserCheck}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/20"
          label="Advogados Ativos"
          value={activeCount}
          description="Ativos no momento"
        />
        <StatCard
          icon={FolderKanban}
          iconColor="text-green-400"
          iconBg="bg-green-500/20"
          label="Total de Processos"
          value={lawyers?.reduce((acc) => acc, 0) ?? 0}
          description="Distribuídos entre advogados"
        />
        <StatCard
          icon={TrendingUp}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/20"
          label="Taxa de Sucesso"
          value="—"
          description="Média do escritório"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-5">
          {isLoading ? (
            <p className="text-slate-500 text-sm">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhum advogado encontrado.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-800">
                  <th className="pb-3 font-medium">Advogado</th>
                  <th className="pb-3 font-medium">OAB</th>
                  <th className="pb-3 font-medium">Área de Atuação</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lawyer) => (
                  <tr
                    key={lawyer.id}
                    onClick={() => setSelectedLawyerId(lawyer.id)}
                    className="border-b border-slate-800/50 last:border-0 cursor-pointer hover:bg-slate-800/50"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
                          {lawyer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-slate-200">{lawyer.name}</p>
                          <p className="text-slate-500 text-xs">{lawyer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">
                      {lawyer.oab ? `OAB/${lawyer.oabState ?? ''} ${lawyer.oab}` : '—'}
                    </td>
                    <td className="py-3 text-slate-300">
                      {lawyer.specialties.length > 0 ? lawyer.specialties.join(', ') : '—'}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          lawyer.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {lawyer.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <LawyerActionsMenu
                        lawyerId={lawyer.id}
                        lawyerName={lawyer.name}
                        isActive={lawyer.isActive}
                        onEdit={() => setEditingLawyer(lawyer)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedLawyerId && (
          <LawyerDetailPanel
            lawyerId={selectedLawyerId}
            onClose={() => setSelectedLawyerId(null)}
          />
        )}
      </div>

      {isModalOpen && <LawyerFormModal onClose={() => setIsModalOpen(false)} />}
      {editingLawyer && (
        <LawyerEditModal lawyer={editingLawyer} onClose={() => setEditingLawyer(null)} />
      )}
    </MainLayout>
  )
}