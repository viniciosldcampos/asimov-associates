import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Save } from 'lucide-react'
import { updateClient } from '../services/clientService'
import type { ClientListItem } from '../services/clientService'

interface ClientEditModalProps {
  client: ClientListItem
  onClose: () => void
}

export default function ClientEditModal({ client, onClose }: ClientEditModalProps) {
  const [name, setName] = useState(client.name)
  const [company, setCompany] = useState(client.company ?? '')
  const [email, setEmail] = useState(client.email ?? '')
  const [phone, setPhone] = useState(client.phone ?? '')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => updateClient(client.id, { name, company, email, phone }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', client.id] })
      onClose()
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">Editar Cliente</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {client.type === 'PESSOA_JURIDICA' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Empresa</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Telefone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm">Erro ao salvar. Tente novamente.</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-medium"
            >
              <Save className="w-4 h-4" />
              {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}