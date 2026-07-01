import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Eye, Pencil, Minus, Shield, RefreshCw } from 'lucide-react'
import {
  getAllUsersPermissions,
  updateUserPermission,
  resetUserPermissions,
  APP_MODULES,
  MODULE_LABELS,
} from '../../services/permissionService'
import type { PermissionLevel, AppModule, UserPermissions } from '../../services/permissionService'
import { ROLE_LABELS } from '../../services/userService'

const LEVEL_ICON: Record<PermissionLevel, React.ReactNode> = {
  FULL: <Check className="w-4 h-4 text-green-400" />,
  EDIT: <Pencil className="w-3 h-3 text-amber-400" />,
  READ: <Eye className="w-4 h-4 text-slate-400" />,
  NONE: <Minus className="w-4 h-4 text-slate-600" />,
}

const LEVEL_LABELS: Record<PermissionLevel, string> = {
  FULL: 'Acesso total',
  EDIT: 'Editar',
  READ: 'Somente leitura',
  NONE: 'Sem acesso',
}

const LEVELS: PermissionLevel[] = ['FULL', 'EDIT', 'READ', 'NONE']

function getPermissionLevel(user: UserPermissions, module: string): PermissionLevel {
  return (user.permissions.find((p) => p.module === module)?.level ?? 'NONE') as PermissionLevel
}

export default function SettingsPermissionsTab() {
  const [selectedUser, setSelectedUser] = useState<UserPermissions | null>(null)
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: getAllUsersPermissions,
  })

  const updateMutation = useMutation({
    mutationFn: ({ userId, module, level }: { userId: string; module: AppModule; level: PermissionLevel }) =>
      updateUserPermission(userId, module, level),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
  })

  const resetMutation = useMutation({
    mutationFn: (userId: string) => resetUserPermissions(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] })
      setSelectedUser(null)
    },
  })

  const totalPermissions = users.reduce((acc, u) => acc + u.permissions.filter((p) => p.level !== 'NONE').length, 0)

  function cyclePermission(userId: string, module: AppModule, current: PermissionLevel) {
    const idx = LEVELS.indexOf(current)
    const next = LEVELS[(idx + 1) % LEVELS.length]
    updateMutation.mutate({ userId, module, level: next })
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        {/* Cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Total de Perfis</p>
            <p className="text-2xl font-bold text-white">{new Set(users.map((u) => u.role)).size}</p>
            <p className="text-slate-500 text-xs">Perfis cadastrados</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Permissões Ativas</p>
            <p className="text-2xl font-bold text-white">{totalPermissions}</p>
            <p className="text-slate-500 text-xs">De {users.length * APP_MODULES.length} permissões</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Módulos do Sistema</p>
            <p className="text-2xl font-bold text-white">{APP_MODULES.length}</p>
            <p className="text-slate-500 text-xs">Módulos disponíveis</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Última atualização</p>
            <p className="text-lg font-bold text-white">Hoje</p>
            <p className="text-slate-500 text-xs">Por Vinícios Souza</p>
          </div>
        </div>

        {/* Matriz de permissões */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Matriz de Permissões</h3>
              <p className="text-slate-500 text-xs">Clique em um ícone para alterar a permissão</p>
            </div>
          </div>

          {isLoading ? (
            <p className="text-slate-500 text-sm">Carregando...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-slate-500 pb-3 font-medium w-32">Módulos</th>
                    {users.map((user) => (
                      <th
                        key={user.userId}
                        className="text-center text-slate-300 pb-3 font-medium px-2 cursor-pointer hover:text-purple-400"
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <span className="truncate max-w-17.5">{user.name.split(' ')[0]}</span>
                          <span className="text-slate-500 text-[10px]">
                            {ROLE_LABELS[user.role] ?? user.role}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {APP_MODULES.map((module) => (
                    <tr key={module} className="border-b border-slate-800/50 last:border-0">
                      <td className="py-2.5 text-slate-300 font-medium">{MODULE_LABELS[module]}</td>
                      {users.map((user) => {
                        const level = getPermissionLevel(user, module)
                        return (
                          <td key={user.userId} className="py-2.5 text-center">
                            <button
                              onClick={() => cyclePermission(user.userId, module, level)}
                              disabled={updateMutation.isPending}
                              title={LEVEL_LABELS[level]}
                              className="flex items-center justify-center w-full hover:scale-125 transition-transform disabled:opacity-50"
                            >
                              {LEVEL_ICON[level]}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Legenda */}
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-800">
            {Object.entries(LEVEL_LABELS).map(([level, label]) => (
              <div key={level} className="flex items-center gap-1.5">
                {LEVEL_ICON[level as PermissionLevel]}
                <span className="text-slate-400 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel lateral */}
      {selectedUser && (
        <aside className="w-72 bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {selectedUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold">{selectedUser.name}</p>
              <p className="text-slate-500 text-xs">{ROLE_LABELS[selectedUser.role] ?? selectedUser.role}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-slate-500 text-xs uppercase mb-2">Grupos de Permissões</p>
            <ul className="space-y-2">
              {APP_MODULES.map((module) => {
                const level = getPermissionLevel(selectedUser, module)
                return (
                  <li key={module} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{MODULE_LABELS[module]}</span>
                    <div className="flex items-center gap-1">
                      {LEVEL_ICON[level]}
                      <span className="text-slate-500 text-xs">{LEVEL_LABELS[level]}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => resetMutation.mutate(selectedUser.userId)}
              disabled={resetMutation.isPending}
              className="w-full flex items-center justify-center gap-2 border border-slate-700 text-slate-300 text-sm py-2 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Resetar para padrão do perfil
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition-colors">
              <Shield className="w-4 h-4" />
              Editar Permissões
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}