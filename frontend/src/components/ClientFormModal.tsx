import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, UserPlus } from 'lucide-react'
import { createClient } from '../services/clientService'

interface ClientFormModalProps {
  onClose: () => void
}

export default function ClientFormModal({ onClose }: ClientFormModalProps) {
  const [type, setType] = useState<'PESSOA_FISICA' | 'PESSOA_JURIDICA'>('PESSOA_FISICA')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [document, setDocument] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      onClose()
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({
      name,
      type,
      company: company || undefined,
      cpf: type === 'PESSOA_FISICA' ? document || undefined : undefined,
      cnpj: type === 'PESSOA_JURIDICA' ? document || undefined : undefined,
      email: email || undefined,
      phone: phone || undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">Novo Cliente</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('PESSOA_FISICA')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                type === 'PESSOA_FISICA'
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-slate-700 text-slate-400'
              }`}
            >
              Pessoa Física
            </button>
            <button
              type="button"
              onClick={() => setType('PESSOA_JURIDICA')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border ${
                type === 'PESSOA_JURIDICA'
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-slate-700 text-slate-400'
              }`}
            >
              Pessoa Jurídica
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {type === 'PESSOA_FISICA' ? 'Nome Completo' : 'Nome do Responsável'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {type === 'PESSOA_JURIDICA' && (
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              {type === 'PESSOA_FISICA' ? 'CPF' : 'CNPJ'}
            </label>
            <input
              type="text"
              placeholder={type === 'PESSOA_FISICA' ? '000.000.000-00' : '00.000.000/0001-00'}
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

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
                placeholder="(51) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm">Erro ao cadastrar cliente. Tente novamente.</p>
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
              <UserPlus className="w-4 h-4" />
              {mutation.isPending ? 'Salvando...' : 'Cadastrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}