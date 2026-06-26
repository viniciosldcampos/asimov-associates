import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, UserCheck, UserPlus, UserX, Search, Plus } from 'lucide-react'
import MainLayout from '../components/MainLayout'
import StatCard from '../components/StatCard'
import ClientDetailPanel from '../components/ClientDetailPanel'
import ClientFormModal from '../components/ClientFormModal'
import ClientEditModal from '../components/ClientEditModal'
import ClientActionsMenu from '../components/ClientActionsMenu'
import { getAllClients } from '../services/clientService'
import type { ClientListItem } from '../services/clientService'

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientListItem | null>(null)

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getAllClients,
  })

  const filtered = useMemo(() => {
    if (!clients) return []
    return clients.filter(
      (client) =>
        search.trim() === '' ||
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.cpf?.includes(search) ||
        client.cnpj?.includes(search) ||
        client.email?.toLowerCase().includes(search.toLowerCase())
    )
  }, [clients, search])

  const activeCount = clients?.filter((c) => c.isActive).length ?? 0
  const inactiveCount = clients?.filter((c) => !c.isActive).length ?? 0

  const thisMonthCount =
    clients?.filter((c) => {
      const created = new Date(c.createdAt)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length ?? 0

  return (
    <MainLayout subtitle="Gerencie todos os clientes do escritório.">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-white text-2xl font-bold">Clientes</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar cliente, CPF, CNPJ, e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-80 bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          iconColor="text-purple-400"
          iconBg="bg-purple-500/20"
          label="Total de Clientes"
          value={clients?.length ?? 0}
          description="Todos os clientes"
        />
        <StatCard
          icon={UserCheck}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/20"
          label="Clientes Ativos"
          value={activeCount}
          description="Em andamento"
        />
        <StatCard
          icon={UserPlus}
          iconColor="text-green-400"
          iconBg="bg-green-500/20"
          label="Novos Clientes"
          value={thisMonthCount}
          description="Este mês"
        />
        <StatCard
          icon={UserX}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/20"
          label="Clientes Inativos"
          value={inactiveCount}
          description="Sem movimentação"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-5">
          {isLoading ? (
            <p className="text-slate-500 text-sm">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhum cliente encontrado.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-800">
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">CPF / CNPJ</th>
                  <th className="pb-3 font-medium">E-mail</th>
                  <th className="pb-3 font-medium">Telefone</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className="border-b border-slate-800/50 last:border-0 cursor-pointer hover:bg-slate-800/50"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-slate-200">{client.name}</p>
                          {client.company && (
                            <p className="text-slate-500 text-xs">{client.company}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          client.type === 'PESSOA_FISICA'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }`}
                      >
                        {client.type === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{client.cpf ?? client.cnpj ?? '—'}</td>
                    <td className="py-3 text-slate-300">{client.email ?? '—'}</td>
                    <td className="py-3 text-slate-300">{client.phone ?? '—'}</td>
                    <td className="py-3">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          client.isActive
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {client.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <ClientActionsMenu
                        clientId={client.id}
                        clientName={client.name}
                        isActive={client.isActive}
                        onEdit={() => setEditingClient(client)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedClientId && (
          <ClientDetailPanel
            clientId={selectedClientId}
            onClose={() => setSelectedClientId(null)}
          />
        )}
      </div>

      {isModalOpen && <ClientFormModal onClose={() => setIsModalOpen(false)} />}
      {editingClient && (
        <ClientEditModal client={editingClient} onClose={() => setEditingClient(null)} />
      )}
    </MainLayout>
  )
}