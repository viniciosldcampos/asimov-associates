import { Download, FileText, Clock, Sparkles } from 'lucide-react'
import { INSTANCE_LABELS, STATUS_LABELS } from '../lib/processLabels'
import type { LawyerListItem } from '../services/lawyerService'

export interface ReportFilters {
  startDate: string
  endDate: string
  lawyerId: string
  category: string
  instance: string
  vara: string
  status: string
}

interface ReportFiltersPanelProps {
  filters: ReportFilters
  onChange: (partial: Partial<ReportFilters>) => void
  onClear: () => void
  lawyers: LawyerListItem[]
  categories: string[]
  varas: string[]
}

export default function ReportFiltersPanel({
  filters,
  onChange,
  onClear,
  lawyers,
  categories,
  varas,
}: ReportFiltersPanelProps) {
  return (
    <aside className="w-72 space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Filtros</h3>
          <button onClick={onClear} className="text-purple-400 text-xs hover:underline">
            Limpar filtros
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Período</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
              <option>Personalizado</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onChange({ endDate: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Advogado</label>
            <select
              value={filters.lawyerId}
              onChange={(e) => onChange({ lawyerId: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              <option value="">Todos os advogados</option>
              {lawyers.map((lawyer) => (
                <option key={lawyer.id} value={lawyer.id}>
                  {lawyer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Área do Direito</label>
            <select
              value={filters.category}
              onChange={(e) => onChange({ category: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              <option value="">Todas as áreas</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Instância</label>
            <select
              value={filters.instance}
              onChange={(e) => onChange({ instance: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              <option value="">Todas as instâncias</option>
              {Object.entries(INSTANCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Vara</label>
            <select
              value={filters.vara}
              onChange={(e) => onChange({ vara: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              <option value="">Todas as varas</option>
              {varas.map((vara) => (
                <option key={vara} value={vara}>
                  {vara}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Status do Processo</label>
            <select
              value={filters.status}
              onChange={(e) => onChange({ status: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
            >
              <option value="">Todos os status</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3">Ações</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Exportar Relatório
          </button>
          <button className="w-full flex items-center justify-center gap-2 border border-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
            <FileText className="w-4 h-4" />
            Gerar em PDF
          </button>
          <button className="w-full flex items-center justify-center gap-2 border border-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
            <Clock className="w-4 h-4" />
            Agendar Relatório
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <h3 className="text-white font-semibold text-sm">Relatórios personalizados</h3>
        </div>
        <p className="text-slate-500 text-xs mb-3">
          Crie relatórios personalizados com os dados que são mais importantes para você.
        </p>
        <button className="text-purple-400 text-sm hover:underline">
          Criar relatório personalizado →
        </button>
      </div>
    </aside>
  )
}