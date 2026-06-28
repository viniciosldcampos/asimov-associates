import { X, Trophy } from 'lucide-react'
import type { LawyerListItem } from '../services/lawyerService'
import type { ProcessListItem } from '../services/processService'

interface LawyerRankingModalProps {
  lawyers: LawyerListItem[]
  processes: ProcessListItem[]
  onClose: () => void
}

export default function LawyerRankingModal({ lawyers, processes, onClose }: LawyerRankingModalProps) {
  const ranking = lawyers
    .map((lawyer) => {
      const lawyerProcesses = processes.filter((p) => p.lawyer.id === lawyer.id)
      const completed = lawyerProcesses.filter((p) => p.status === 'CONCLUIDO').length
      const expired = lawyerProcesses.filter((p) => p.status === 'VENCIDO').length
      const finishedTotal = completed + expired
      const successRate = finishedTotal > 0 ? Math.round((completed / finishedTotal) * 100) : 0

      return {
        ...lawyer,
        totalProcesses: lawyerProcesses.length,
        successRate,
      }
    })
    .sort((a, b) => b.totalProcesses - a.totalProcesses)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-semibold text-lg">Ranking Completo de Advogados</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-800">
              <th className="pb-2 font-medium">#</th>
              <th className="pb-2 font-medium">Advogado</th>
              <th className="pb-2 font-medium text-center">Processos</th>
              <th className="pb-2 font-medium">Taxa de Sucesso</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((lawyer, index) => (
              <tr key={lawyer.id} className="border-b border-slate-800/50 last:border-0">
                <td className="py-2.5 text-slate-500">{index + 1}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-medium">
                      {lawyer.name.charAt(0)}
                    </div>
                    <span className="text-slate-200">{lawyer.name}</span>
                  </div>
                </td>
                <td className="py-2.5 text-slate-300 text-center">{lawyer.totalProcesses}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 w-10">{lawyer.successRate}%</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden max-w-24">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${lawyer.successRate}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}