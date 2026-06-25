import { useQuery } from '@tanstack/react-query'
import { getAllClients } from '../../services/clientService'
import type { ProcessFormData } from '../ProcessFormModal'

interface StepProps {
  data: ProcessFormData
  onChange: (partial: Partial<ProcessFormData>) => void
}

export default function StepClient({ data, onChange }: StepProps) {
  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: getAllClients,
  })

  function handleSelect(clientId: string) {
    const client = clients?.find((c) => c.id === clientId)
    onChange({ clientId, clientName: client?.name ?? '' })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Cliente</label>
        <select
          value={data.clientId}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">{isLoading ? 'Carregando...' : 'Selecione o cliente'}</option>
          {clients?.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name} {client.cpf ? `— ${client.cpf}` : ''}
            </option>
          ))}
        </select>
      </div>

      {clients?.length === 0 && (
        <p className="text-amber-400 text-sm">
          Nenhum cliente cadastrado ainda. Cadastre um cliente antes de criar o processo.
        </p>
      )}
    </div>
  )
}