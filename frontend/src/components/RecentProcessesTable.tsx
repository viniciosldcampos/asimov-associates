import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Scale } from 'lucide-react'
import type { ProcessListItem } from '../services/processService'

const STATUS_STYLES: Record<string, string> = {
  EM_ANDAMENTO: 'text-blue-400',
  CONCLUIDO: 'text-green-400',
  VENCIDO: 'text-red-400',
  AGUARDANDO: 'text-amber-400',
  PENDENTE: 'text-purple-400',
  ARQUIVADO: 'text-slate-400',
}

const STATUS_LABELS: Record<string, string> = {
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDO: 'Concluído',
  VENCIDO: 'Vencido',
  AGUARDANDO: 'Aguardando',
  PENDENTE: 'Pendente',
  ARQUIVADO: 'Arquivado',
}

const INSTANCE_LABELS: Record<string, string> = {
  PRIMEIRA_INSTANCIA: '1ª Instância',
  SEGUNDA_INSTANCIA: '2ª Instância',
  TRABALHISTA: 'Trabalhista',
  SUPERIOR_TRIBUNAL: 'Superior Tribunal',
  OUTROS: 'Outros',
}

interface RecentProcessesTableProps {
  processes: ProcessListItem[]
}

export default function RecentProcessesTable({ processes }: RecentProcessesTableProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Processos Recentes</h3>
        <a href="/processos" className="text-purple-400 text-sm hover:underline">
          Ver todos
        </a>
      </div>

      {processes.length === 0 ? (
        <p className="text-slate-500 text-sm">Nenhum processo cadastrado.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-800">
              <th className="pb-3 font-medium">Processo</th>
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Advogado</th>
              <th className="pb-3 font-medium">Instância</th>
              <th className="pb-3 font-medium">Fase</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Última atualização</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id} className="border-b border-slate-800/50 last:border-0">
                <td className="py-3 text-slate-200 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-400" />
                  {process.number}
                </td>
                <td className="py-3 text-slate-300">{process.client.name}</td>
                <td className="py-3 text-slate-300">{process.lawyer.name}</td>
                <td className="py-3 text-slate-300">
                  {INSTANCE_LABELS[process.instance] ?? process.instance}
                </td>
                <td className="py-3 text-slate-300">{process.phase}</td>
                <td className={`py-3 font-medium ${STATUS_STYLES[process.status] ?? 'text-slate-300'}`}>
                  ● {STATUS_LABELS[process.status] ?? process.status}
                </td>
                <td className="py-3 text-slate-500">
                  {format(new Date(process.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}