import { isSameDay } from 'date-fns'
import { DAY_LABELS, HOURS, getWeekDays, format } from '../lib/calendarUtils'
import type { AppointmentListItem } from '../services/appointmentService'
import type { DeadlineListItem } from '../services/deadlineService'

const TYPE_COLORS: Record<string, string> = {
  AUDIENCIA: 'bg-blue-600/30 border-blue-500 text-blue-200',
  REUNIAO: 'bg-green-600/30 border-green-500 text-green-200',
  PRAZO: 'bg-amber-600/30 border-amber-500 text-amber-200',
  OUTROS: 'bg-purple-600/30 border-purple-500 text-purple-200',
}

const DEADLINE_DOT_COLORS = ['bg-purple-500', 'bg-blue-500', 'bg-amber-500', 'bg-green-500']

const HOUR_HEIGHT = 64 // px por hora

interface WeekCalendarGridProps {
  referenceDate: Date
  appointments: AppointmentListItem[]
  deadlines: DeadlineListItem[]
}

export default function WeekCalendarGrid({
  referenceDate,
  appointments,
  deadlines,
}: WeekCalendarGridProps) {
  const days = getWeekDays(referenceDate)
  const today = new Date()

  function getEventStyle(startTime: string, endTime: string) {
    const start = new Date(startTime)
    const end = new Date(endTime)
    const startHour = start.getHours() + start.getMinutes() / 60
    const endHour = end.getHours() + end.getMinutes() / 60
    const top = (startHour - HOURS[0]) * HOUR_HEIGHT
    const height = Math.max((endHour - startHour) * HOUR_HEIGHT, 32)
    return { top: `${top}px`, height: `${height}px` }
  }

  const maxDeadlinesInDay = Math.max(
    1,
    ...days.map((day) => deadlines.filter((d) => isSameDay(new Date(d.date), day)).length)
  )

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      {/* Cabeçalho com dias da semana */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-800">
        <div />
        {days.map((day) => {
          const isToday = isSameDay(day, today)
          return (
            <div
              key={day.toISOString()}
              className={`text-center py-3 border-l border-slate-800 ${
                isToday ? 'bg-purple-600/10' : ''
              }`}
            >
              <p className="text-slate-500 text-xs">{DAY_LABELS[(day.getDay() + 6) % 7]}</p>
              <p className={`text-lg font-semibold ${isToday ? 'text-purple-400' : 'text-white'}`}>
                {format(day, 'd')}
              </p>
            </div>
          )
        })}
      </div>

      {/* Faixa "Dia todo" para os prazos */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-slate-800">
        <div className="text-slate-500 text-xs flex items-center justify-end pr-2 py-2">
          Dia todo
        </div>
        {days.map((day) => {
          const dayDeadlines = deadlines.filter((d) => isSameDay(new Date(d.date), day))

          return (
            <div
              key={day.toISOString()}
              className="border-l border-slate-800 p-1 space-y-1"
              style={{ minHeight: `${maxDeadlinesInDay * 28}px` }}
            >
              {dayDeadlines.map((deadline, index) => (
                <div
                  key={deadline.id}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 truncate"
                >
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${
                      DEADLINE_DOT_COLORS[index % DEADLINE_DOT_COLORS.length]
                    }`}
                  />
                  Prazo: {deadline.title}
                  <br />
                  <span className="text-slate-500 ml-3">Proc. {deadline.process?.number}</span>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Grade de horários */}
      <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
        <div>
          {HOURS.map((hour) => (
            <div
              key={hour}
              style={{ height: `${HOUR_HEIGHT}px` }}
              className="text-slate-500 text-xs text-right pr-2 -translate-y-2"
            >
              {String(hour).padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {days.map((day) => {
          const dayAppointments = appointments.filter((a) => isSameDay(new Date(a.startTime), day))

          return (
            <div
              key={day.toISOString()}
              className="relative border-l border-slate-800"
              style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
            >
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                  className="border-b border-slate-800/50"
                />
              ))}

              {dayAppointments.map((appointment) => {
                const style = getEventStyle(appointment.startTime, appointment.endTime)
                const colorClass = TYPE_COLORS[appointment.type] ?? TYPE_COLORS.OUTROS

                return (
                  <div
                    key={appointment.id}
                    style={style}
                    className={`absolute left-1 right-1 rounded px-2 py-1 text-xs border overflow-hidden ${colorClass}`}
                  >
                    <p className="font-medium">
                      {format(new Date(appointment.startTime), 'HH:mm')} -{' '}
                      {format(new Date(appointment.endTime), 'HH:mm')}
                    </p>
                    <p className="truncate">{appointment.title}</p>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}