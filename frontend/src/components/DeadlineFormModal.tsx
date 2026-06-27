import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { X, CalendarClock } from 'lucide-react'
import { createDeadline } from '../services/deadlineService'
import { getAllLawyers } from '../services/lawyerService'
import { getAllProcesses } from '../services/processService'

interface DeadlineFormModalProps {
  onClose: () => void
}

const TYPE_LABELS: Record<string, string> = {
  PROCESSUAL: 'Processual',
  AUDIENCIA: 'Audiência',
  OUTROS: 'Outros',
}

export default function DeadlineFormModal({ onClose }: DeadlineFormModalProps) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<'PROCESSUAL' | 'AUDIENCIA' | 'OUTROS'>('PROCESSUAL')
  const [date, setDate] = useState('')
  const [processId, setProcessId] = useState('')
  const [lawyerId, setLawyerId] = useState('')
  const queryClient = useQueryClient()

  const { data: lawyers } = useQuery({ queryKey: ['lawyers'], queryFn: getAllLawyers })
  const { data: processes } = useQuery({ queryKey: ['processes'], queryFn: getAllProcesses })

  const mutation = useMutation({
    mutationFn: createDeadline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] })
      onClose()
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ title, type, date, processId, lawyerId })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">Novo Prazo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Título</label>
            <input
              type="text"
              required
              placeholder="Ex: Recurso de Apelação"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Data</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Processo</label>
            <select
              required
              value={processId}
              onChange={(e) => setProcessId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione o processo</option>
              {processes?.map((process) => (
                <option key={process.id} value={process.id}>
                  {process.number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Advogado</label>
            <select
              required
              value={lawyerId}
              onChange={(e) => setLawyerId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione o advogado</option>
              {lawyers?.map((lawyer) => (
                <option key={lawyer.id} value={lawyer.id}>
                  {lawyer.name}
                </option>
              ))}
            </select>
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-sm">Erro ao salvar prazo. Tente novamente.</p>
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
              <CalendarClock className="w-4 h-4" />
              {mutation.isPending ? 'Salvando...' : 'Criar Prazo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}