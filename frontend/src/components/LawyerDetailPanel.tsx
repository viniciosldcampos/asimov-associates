import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X, Mail, Phone, Activity as ActivityIcon } from 'lucide-react'
import { getLawyerById } from '../services/lawyerService'
import { STATUS_LABELS } from '../lib/processLabels'

interface LawyerDetailPanelProps {
  lawyerId: string
  onClose: () => void
}

export default function LawyerDetailPanel({ lawyerId, onClose }: LawyerDetailPanelProps) {
  const { data: lawyer, isLoading } = useQuery({
    queryKey: ['lawyer', lawyerId],
    queryFn: () => getLawyerById(lawyerId),
  })

  const activeCount = lawyer?.processesAsLawyer.filter((p) => p.status === 'EM_ANDAMENTO').length ?? 0
  const completedCount = lawyer?.processesAsLawyer.filter((p) => p.status === 'CONCLUIDO').length ?? 0
  const expiredCount = lawyer?.processesAsLawyer.filter((p) => p.status === 'VENCIDO').length ?? 0
  const totalProcesses = lawyer?.processesAsLawyer.length ?? 0
  const finishedTotal = completedCount + expiredCount
  const successRate = finishedTotal > 0 ? Math.round((completedCount / finishedTotal) * 100) : 0

  return (
    <aside className="w-96 bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
      <div className="flex justify-end mb-2">
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-500 text-sm">Carregando...</p>
      ) : !lawyer ? (
        <p className="text-slate-500 text-sm">Advogado não encontrado.</p>
      ) : (
        <>
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-3">
              {lawyer.name.charAt(0)}
            </div>
            <h3 className="text-white font-semibold text-lg">{lawyer.name}</h3>
            <p className="text-slate-500 text-sm">
              {lawyer.oab ? `OAB/${lawyer.oabState ?? ''} ${lawyer.oab}` : 'OAB não informada'}
            </p>
          </div>

          <div className="space-y-2 mb-5 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-slate-500" />
              {lawyer.email}
            </div>
            {lawyer.phone && (
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                {lawyer.phone}
              </div>
            )}
          </div>

          {lawyer.specialties.length > 0 && (
            <div className="mb-5">
              <p className="text-slate-500 text-xs uppercase mb-2">Áreas de Atuação</p>
              <div className="flex flex-wrap gap-2">
                {lawyer.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="bg-purple-600/20 text-purple-400 text-xs px-2.5 py-1 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
            <div>
              <p className="text-white font-bold text-lg">{totalProcesses}</p>
              <p className="text-slate-500 text-xs">Processos</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{successRate}%</p>
              <p className="text-slate-500 text-xs">Taxa de Sucesso</p>
            </div>
            <div>
              <p className="text-white font-bold text-lg">{lawyer.experienceYears ?? '—'}</p>
              <p className="text-slate-500 text-xs">Anos de exp.</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
            <div>
              <p className="text-blue-400 font-bold text-lg">{activeCount}</p>
              <p className="text-slate-500 text-xs">Ativos</p>
            </div>
            <div>
              <p className="text-green-400 font-bold text-lg">{completedCount}</p>
              <p className="text-slate-500 text-xs">Concluídos</p>
            </div>
            <div>
              <p className="text-red-400 font-bold text-lg">{expiredCount}</p>
              <p className="text-slate-500 text-xs">Vencidos</p>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-slate-500 text-xs uppercase mb-2">Processos</p>
            {lawyer.processesAsLawyer.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhum processo vinculado.</p>
            ) : (
              <ul className="space-y-2">
                {lawyer.processesAsLawyer.slice(0, 5).map((process) => (
                  <li key={process.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">#{process.number}</span>
                    <span className="text-slate-500 text-xs">
                      {STATUS_LABELS[process.status] ?? process.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="text-slate-500 text-xs uppercase mb-2">Atividade Recente</p>
            {lawyer.activities.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhuma atividade registrada.</p>
            ) : (
              <ul className="space-y-3">
                {lawyer.activities.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-2">
                    <ActivityIcon className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-300 text-sm">{activity.description}</p>
                      <p className="text-slate-500 text-xs">
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </aside>
  )
}