import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Save } from 'lucide-react'
import { updateLawyer } from '../services/lawyerService'
import type { LawyerListItem } from '../services/lawyerService'

interface LawyerEditModalProps {
  lawyer: LawyerListItem
  onClose: () => void
}

const SPECIALTY_OPTIONS = ['Civil', 'Trabalhista', 'Empresarial', 'Tributário', 'Previdenciário', 'Penal']

export default function LawyerEditModal({ lawyer, onClose }: LawyerEditModalProps) {
  const [oab, setOab] = useState(lawyer.oab ?? '')
  const [oabState, setOabState] = useState(lawyer.oabState ?? '')
  const [phone, setPhone] = useState(lawyer.phone ?? '')
  const [specialties, setSpecialties] = useState<string[]>(lawyer.specialties)
  const [isActive, setIsActive] = useState(lawyer.isActive)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => updateLawyer(lawyer.id, { oab, oabState, phone, specialties, isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] })
      queryClient.invalidateQueries({ queryKey: ['lawyer', lawyer.id] })
      onClose()
    },
  })

  function toggleSpecialty(specialty: string) {
    setSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty]
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">Editar Advogado</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-4">{lawyer.name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">OAB</label>
              <input
                type="text"
                value={oab}
                onChange={(e) => setOab(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">UF</label>
              <input
                type="text"
                maxLength={2}
                value={oabState}
                onChange={(e) => setOabState(e.target.value.toUpperCase())}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Áreas de Atuação</label>
            <div className="flex flex-wrap gap-2">
              {SPECIALTY_OPTIONS.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => toggleSpecialty(specialty)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    specialties.includes(specialty)
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-300 text-sm">Status do Advogado</span>
            <button
              type="button"
              onClick={() => setIsActive((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-slate-500'}`} />
              {isActive ? 'Ativo' : 'Inativo'}
            </button>
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