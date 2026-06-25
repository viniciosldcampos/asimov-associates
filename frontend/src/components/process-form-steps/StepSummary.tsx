import { INSTANCE_LABELS } from '../../lib/processLabels'
import type { ProcessFormData } from '../ProcessFormModal'

interface StepSummaryProps {
  data: ProcessFormData
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-800/50 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-200 text-sm font-medium">{value || '—'}</span>
    </div>
  )
}

export default function StepSummary({ data }: StepSummaryProps) {
  return (
    <div>
      <p className="text-slate-500 text-sm mb-3">Revise os dados antes de salvar</p>
      <div className="bg-slate-800/50 rounded-lg p-4">
        <SummaryRow label="Número" value={data.number} />
        <SummaryRow label="Cliente" value={data.clientName} />
        <SummaryRow label="Advogado" value={data.lawyerName} />
        <SummaryRow label="Instância" value={INSTANCE_LABELS[data.instance] ?? data.instance} />
        <SummaryRow label="Vara" value={data.vara} />
        <SummaryRow label="Fase" value={data.phase} />
        <SummaryRow label="Data Inicial" value={data.startDate} />
        <SummaryRow label="Data Final" value={data.endDate} />
        <SummaryRow label="Processo Concluído" value={data.isFinished ? 'Sim' : 'Não'} />
        <SummaryRow label="Processo Vencido" value={data.isExpired ? 'Sim' : 'Não'} />
      </div>
    </div>
  )
}