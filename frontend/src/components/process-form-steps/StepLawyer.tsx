import { useQuery } from '@tanstack/react-query'
import { getAllLawyers } from '../../services/lawyerService'
import { INSTANCE_LABELS } from '../../lib/processLabels'
import type { ProcessFormData } from '../ProcessFormModal'

interface StepProps {
  data: ProcessFormData
  onChange: (partial: Partial<ProcessFormData>) => void
}

export default function StepLawyer({ data, onChange }: StepProps) {
  const { data: lawyers, isLoading } = useQuery({
    queryKey: ['lawyers'],
    queryFn: getAllLawyers,
  })

  function handleSelectLawyer(lawyerId: string) {
    const lawyer = lawyers?.find((l) => l.id === lawyerId)
    onChange({ lawyerId, lawyerName: lawyer?.name ?? '' })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Advogado Responsável
          </label>
          <select
            value={data.lawyerId}
            onChange={(e) => handleSelectLawyer(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">{isLoading ? 'Carregando...' : 'Selecione o advogado'}</option>
            {lawyers?.map((lawyer) => (
              <option key={lawyer.id} value={lawyer.id}>
                {lawyer.name} {lawyer.oab ? `— OAB ${lawyer.oab}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Instância</label>
          <select
            value={data.instance}
            onChange={(e) => onChange({ instance: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Selecione a instância</option>
            {Object.entries(INSTANCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Vara</label>
          <input
            type="text"
            placeholder="Ex: Vara Cível de Porto Alegre"
            value={data.vara}
            onChange={(e) => onChange({ vara: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Fase Atual</label>
          <input
            type="text"
            placeholder="Ex: Execução, Citação..."
            value={data.phase}
            onChange={(e) => onChange({ phase: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  )
}