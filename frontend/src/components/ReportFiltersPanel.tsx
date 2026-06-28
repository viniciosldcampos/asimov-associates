import { Download, FileText, Clock, Sparkles } from 'lucide-react'

interface ReportFiltersPanelProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
}

export default function ReportFiltersPanel({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: ReportFiltersPanelProps) {
  return (
    <aside className="w-72 space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Filtros</h3>
          <button className="text-purple-400 text-xs hover:underline">Limpar filtros</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Período</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
              <option>Personalizado</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300"
              />
            </div>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Advogado</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
              <option>Todos os advogados</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Área do Direito</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
              <option>Todas as áreas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Instância</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
              <option>Todas as instâncias</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Vara</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
              <option>Todas as varas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Status do Processo</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
              <option>Todos os status</option>
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