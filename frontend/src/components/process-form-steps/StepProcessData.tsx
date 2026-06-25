import type { ProcessFormData } from '../ProcessFormModal'

interface StepProps {
  data: ProcessFormData
  onChange: (partial: Partial<ProcessFormData>) => void
}

export default function StepProcessData({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Número do Processo
        </label>
        <input
          type="text"
          placeholder="0000000-00.2026"
          value={data.number}
          onChange={(e) => onChange({ number: e.target.value })}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Descrição</label>
        <textarea
          placeholder="Descreva brevemente o processo..."
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>
    </div>
  )
}