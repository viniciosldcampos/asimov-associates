import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Scale, Search } from 'lucide-react'
import MainLayout from '../components/MainLayout'
import { getAllProcesses } from '../services/processService'
import { STATUS_LABELS, STATUS_STYLES, INSTANCE_LABELS } from '../lib/processLabels'

const PAGE_SIZE = 10

export default function ProcessesPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('TODOS')
  const [instanceFilter, setInstanceFilter] = useState('TODAS')
  const [page, setPage] = useState(1)

  const { data: processes, isLoading } = useQuery({
    queryKey: ['processes'],
    queryFn: getAllProcesses,
  })

  const filtered = useMemo(() => {
    if (!processes) return []

    return processes.filter((process) => {
      const matchesSearch =
        search.trim() === '' ||
        process.number.toLowerCase().includes(search.toLowerCase()) ||
        process.client.name.toLowerCase().includes(search.toLowerCase()) ||
        process.lawyer.name.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter === 'TODOS' || process.status === statusFilter
      const matchesInstance = instanceFilter === 'TODAS' || process.instance === instanceFilter

      return matchesSearch && matchesStatus && matchesInstance
    })
  }, [processes, search, statusFilter, instanceFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function clearFilters() {
    setSearch('')
    setStatusFilter('TODOS')
    setInstanceFilter('TODAS')
    setPage(1)
  }

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-white text-2xl font-bold">Processos</h2>
          <p className="text-slate-500 text-sm mt-1">
            <span className="text-purple-400">Home</span> {'>'} Processos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar processo, cliente, advogado..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-72 bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Novo Processo
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 my-5">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
        >
          <option value="TODOS">Status: Todos</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={instanceFilter}
          onChange={(e) => {
            setInstanceFilter(e.target.value)
            setPage(1)
          }}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
        >
          <option value="TODAS">Instância: Todas</option>
          {Object.entries(INSTANCE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button onClick={clearFilters} className="text-purple-400 text-sm hover:underline">
          Limpar filtros
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        {isLoading ? (
          <p className="text-slate-500 text-sm">Carregando...</p>
        ) : paginated.length === 0 ? (
          <p className="text-slate-500 text-sm">Nenhum processo encontrado.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-800">
                  <th className="pb-3 font-medium">Processo</th>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Advogado</th>
                  <th className="pb-3 font-medium">Instância</th>
                  <th className="pb-3 font-medium">Fase</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Atualizado em</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((process) => (
                  <tr key={process.id} className="border-b border-slate-800/50 last:border-0">
                    <td className="py-3 text-slate-200 flex items-center gap-2">
                      <Scale className="w-4 h-4 text-purple-400" />
                      {process.number}
                    </td>
                    <td className="py-3 text-slate-300">{process.client.name}</td>
                    <td className="py-3 text-slate-300">{process.lawyer.name}</td>
                    <td className="py-3 text-slate-300">
                      {INSTANCE_LABELS[process.instance] ?? process.instance}
                    </td>
                    <td className="py-3 text-slate-300">{process.phase}</td>
                    <td className={`py-3 font-medium ${STATUS_STYLES[process.status] ?? 'text-slate-300'}`}>
                      ● {STATUS_LABELS[process.status] ?? process.status}
                    </td>
                    <td className="py-3 text-slate-500">
                      {format(new Date(process.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
              <p className="text-slate-500 text-sm">
                Mostrando {(page - 1) * PAGE_SIZE + 1} a{' '}
                {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} resultados
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-40 text-sm"
                >
                  ‹
                </button>
                <span className="text-slate-300 text-sm">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-40 text-sm"
                >
                  ›
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}