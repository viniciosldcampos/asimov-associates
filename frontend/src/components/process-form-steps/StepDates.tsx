import type { ProcessFormData } from '../ProcessFormModal'

interface StepProps {
  data: ProcessFormData
  onChange: (partial: Partial<ProcessFormData>) => void
}

export default function StepDates({ data, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Data Inicial</label>
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Data Final</label>
          <input
            type="date"
            value={data.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-slate-300 text-sm">Processo Concluído</span>
        <button
          type="button"
          onClick={() => onChange({ isFinished: !data.isFinished })}
          className={`w-11 h-6 rounded-full transition-colors relative ${
            data.isFinished ? 'bg-purple-600' : 'bg-slate-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              data.isFinished ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-slate-300 text-sm">Processo Vencido</span>
        <button
          type="button"
          onClick={() => onChange({ isExpired: !data.isExpired })}
          className={`w-11 h-6 rounded-full transition-colors relative ${
            data.isExpired ? 'bg-purple-600' : 'bg-slate-700'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
              data.isExpired ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>
    </div>
  )
}