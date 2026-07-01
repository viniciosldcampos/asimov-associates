import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, Plus, Pencil, MoreVertical, X, Mail, Phone, Shield, Calendar } from 'lucide-react'
import { getAllUsers, updateUser, deleteUser, ROLE_LABELS, ROLE_COLORS } from '../../services/userService'
import type { UserListItem } from '../../services/userService'

export default function SettingsUsersTab() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (user: UserListItem) => updateUser(user.id, { isActive: !user.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setSelectedUser(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setSelectedUser(null)
    },
  })

  const activeCount = users.filter((u) => u.isActive).length
  const adminCount = users.filter((u) => u.role === 'ADMINISTRADOR').length

  const filtered = users.filter((user) => {
    const matchesSearch =
      search.trim() === '' ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === '' || user.role === roleFilter
    const matchesStatus =
      statusFilter === '' ||
      (statusFilter === 'ATIVO' && user.isActive) ||
      (statusFilter === 'INATIVO' && !user.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  function handleDelete(user: UserListItem) {
    const confirmed = window.confirm(`Tem certeza que deseja excluir ${user.name}? Essa ação não pode ser desfeita.`)
    if (confirmed) deleteMutation.mutate(user.id)
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        {/* Cards de estatísticas */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Total de Usuários', value: users.length, description: 'Todos os usuários' },
            { label: 'Usuários Ativos', value: activeCount, description: `${Math.round((activeCount / Math.max(users.length, 1)) * 100)}% do total` },
            { label: 'Administradores', value: adminCount, description: `${Math.round((adminCount / Math.max(users.length, 1)) * 100)}% do total` },
            { label: 'Último acesso hoje', value: 12, description: '48% do total' },
          ].map((card) => (
            <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-slate-500 text-xs">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Busca e filtros */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar usuário, e-mail ou perfil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
            <option value="">Todos os perfis</option>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
            <option value="">Todos os status</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
          <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Novo Usuário
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          {isLoading ? (
            <p className="text-slate-500 text-sm">Carregando...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-800">
                  <th className="pb-3 font-medium">Usuário</th>
                  <th className="pb-3 font-medium">Perfil</th>
                  <th className="pb-3 font-medium">Equipe</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Último acesso</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`border-b border-slate-800/50 last:border-0 cursor-pointer hover:bg-slate-800/50 ${selectedUser?.id === user.id ? 'bg-slate-800/50' : ''}`}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-slate-200">{user.name}</p>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${ROLE_COLORS[user.role] ?? 'bg-slate-700 text-slate-300'}`}>
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-300">{user.team ?? '—'}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-slate-500'}`} />
                        <span className={user.isActive ? 'text-green-400' : 'text-slate-500'}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500">
                      {format(new Date(user.updatedAt), "dd/MM/yyyy, HH:mm", { locale: ptBR })}
                    </td>
                    <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-slate-500 text-sm">
              Mostrando 1 a {filtered.length} de {users.length} usuários
            </p>
          </div>
        </div>
      </div>

      {/* Painel lateral de detalhes */}
      {selectedUser && (
        <aside className="w-80 bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-white font-semibold">{selectedUser.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded ${ROLE_COLORS[selectedUser.role]}`}>
                  {ROLE_LABELS[selectedUser.role]}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 mb-5 text-sm">
            <p className="text-slate-500 text-xs uppercase mb-2">Informações Pessoais</p>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-slate-500" />
              {selectedUser.email}
            </div>
            {selectedUser.phone && (
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                {selectedUser.phone}
              </div>
            )}
            {selectedUser.position && (
              <div className="flex items-center gap-2 text-slate-300">
                <Shield className="w-4 h-4 text-slate-500" />
                {selectedUser.position}
              </div>
            )}
          </div>

          <div className="space-y-2 mb-5 text-sm border-t border-slate-800 pt-4">
            <p className="text-slate-500 text-xs uppercase mb-2">Informações da Conta</p>
            <div className="flex justify-between">
              <span className="text-slate-500">Perfil</span>
              <span className="text-slate-200">{ROLE_LABELS[selectedUser.role]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className={selectedUser.isActive ? 'text-green-400' : 'text-slate-500'}>
                {selectedUser.isActive ? '● Ativo' : '● Inativo'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Data de criação</span>
              <span className="text-slate-200">
                {format(new Date(selectedUser.createdAt), 'dd/MM/yyyy, HH:mm', { locale: ptBR })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Último acesso</span>
              <span className="text-slate-200">
                {format(new Date(selectedUser.updatedAt), 'dd/MM/yyyy, HH:mm', { locale: ptBR })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Redefinir senha</span>
              <button className="text-purple-400 text-xs hover:underline">
                Enviar link de redefinição
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => toggleActiveMutation.mutate(selectedUser)}
              disabled={toggleActiveMutation.isPending}
              className="w-full flex items-center justify-center gap-2 border border-slate-700 text-slate-300 text-sm py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              {selectedUser.isActive ? 'Desativar Usuário' : 'Reativar Usuário'}
            </button>
            <button
              onClick={() => handleDelete(selectedUser)}
              disabled={deleteMutation.isPending}
              className="w-full flex items-center justify-center gap-2 border border-red-800 text-red-400 text-sm py-2 rounded-lg hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              Excluir Usuário
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}