import { format, differenceInCalendarDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { UpcomingDeadline } from '../services/dashboardService'

interface UpcomingDeadlinesCardProps {
  deadlines: UpcomingDeadline[]
}

function getDaysLabel(dateStr: string) {
  const days = differenceInCalendarDays(new Date(dateStr), new Date())

  if (days === 0) return { text: 'Hoje', color: 'bg-red-500/20 text-red-400' }
  if (days === 1) return { text: 'Amanhã', color: 'bg-amber-500/20 text-amber-400' }
  if (days < 0) return { text: 'Vencido', color: 'bg-red-500/20 text-red-400' }
  return { text: `${days} dias`, color: 'bg-slate-700 text-slate-300' }
}

export default function UpcomingDeadlinesCard({ deadlines }: UpcomingDeadlinesCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Prazos próximos</h3>
        <a href="/prazos" className="text-purple-400 text-sm hover:underline">
          Ver todos
        </a>
      </div>

      {deadlines.length === 0 ? (
        <p className="text-slate-500 text-sm">Nenhum prazo próximo.</p>
      ) : (
        <ul className="space-y-3">
          {deadlines.map((deadline) => {
            const date = new Date(deadline.date)
            const { text, color } = getDaysLabel(deadline.date)

            return (
              <li key={deadline.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-center w-10">
                    <p className="text-white text-sm font-bold leading-none">
                      {format(date, 'dd', { locale: ptBR })}
                    </p>
                    <p className="text-slate-500 text-[10px] uppercase">
                      {format(date, 'MMM', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-200 text-sm">
                      {deadline.process ? `Processo nº ${deadline.process.number}` : deadline.title}
                    </p>
                    <p className="text-slate-500 text-xs">{deadline.title}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${color}`}>
                  {text}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}