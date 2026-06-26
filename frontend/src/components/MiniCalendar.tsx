import { useState } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

interface MiniCalendarProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
}

export default function MiniCalendar({ selectedDate, onSelectDate }: MiniCalendarProps) {
  const [viewMonth, setViewMonth] = useState(selectedDate)

  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(monthEnd)

  const days: Date[] = []
  let day = gridStart
  while (day <= gridEnd) {
    days.push(day)
    day = addDays(day, 1)
  }

  const today = new Date()

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium text-sm capitalize">
          {format(viewMonth, 'MMMM yyyy', { locale: ptBR })}
        </h4>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMonth((m) => subMonths(m, 1))}
            className="p-1 rounded hover:bg-slate-800 text-slate-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMonth((m) => addMonths(m, 1))}
            className="p-1 rounded hover:bg-slate-800 text-slate-400"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={index} className="text-slate-500 text-xs">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const isCurrentMonth = isSameMonth(d, viewMonth)
          const isToday = isSameDay(d, today)
          const isSelected = isSameDay(d, selectedDate)

          return (
            <button
              key={d.toISOString()}
              onClick={() => onSelectDate(d)}
              className={`text-xs w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-purple-600 text-white'
                  : isToday
                    ? 'text-purple-400 font-semibold'
                    : isCurrentMonth
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600'
              }`}
            >
              {format(d, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}