import { useState } from 'react'
import type { LawyerListItem } from '../services/lawyerService'
import type { ProcessListItem } from '../services/processService'
import LawyerRankingModal from './LawyerRankingModal'

interface LawyerPerformanceListProps {
  lawyers: LawyerListItem[]
  processes: ProcessListItem[]
}

export default function LawyerPerformanceList({ lawyers, processes }: LawyerPerformanceListProps) {
  const [isRankingOpen, setIsRankingOpen] = useState(false)

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
    .slice(0, 5)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">Desempenho por Advogado</h3>

      {ranking.length === 0 ? (
        <p className="text-slate-500 text-sm">Nenhum dado disponível.</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-800">
                <th className="pb-2 font-medium">Advogado</th>
                <th className="pb-2 font-medium text-center">Processos</th>
                <th className="pb-2 font-medium">Taxa de Sucesso</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((lawyer) => (
                <tr key={lawyer.id} className="border-b border-slate-800/50 last:border-0">
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

          <button
            onClick={() => setIsRankingOpen(true)}
            className="text-purple-400 text-sm hover:underline mt-3"
          >
            Ver ranking completo →
          </button>
        </>
      )}

      {isRankingOpen && (
        <LawyerRankingModal
          lawyers={lawyers}
          processes={processes}
          onClose={() => setIsRankingOpen(false)}
        />
      )}
    </div>
  )
}