import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { addWeeks, subWeeks, isSameDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus, Calendar, Settings2, Filter } from 'lucide-react'
import MainLayout from '../components/MainLayout'
import WeekCalendarGrid from '../components/WeekCalendarGrid'
import MiniCalendar from '../components/MiniCalendar'
import AppointmentFormModal from '../components/AppointmentFormModal'
import { getAllAppointments } from '../services/appointmentService'
import { getAllDeadlines } from '../services/deadlineService'
import { formatWeekRange, format } from '../lib/calendarUtils'

const VIEW_OPTIONS = ['Dia', 'Semana', 'Mês', 'Lista']

export default function AgendaPage() {
  const [referenceDate, setReferenceDate] = useState(new Date())
  const [activeView, setActiveView] = useState('Semana')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: appointments } = useQuery({
    queryKey: ['appointments'],
    queryFn: getAllAppointments,
  })

  const { data: deadlines } = useQuery({
    queryKey: ['deadlines'],
    queryFn: getAllDeadlines,
  })

  const today = new Date()

  const todaysAppointments = (appointments ?? [])
    .filter((a) => new Date(a.startTime) >= today)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3)

  const todaysDeadlines = (deadlines ?? []).filter((d) => isSameDay(new Date(d.date), today))

  const weekAppointmentsCount = (appointments ?? []).length
  const audienciaCount = (appointments ?? []).filter((a) => a.type === 'AUDIENCIA').length
  const reuniaoCount = (appointments ?? []).filter((a) => a.type === 'REUNIAO').length

  function handleViewClick(view: string) {
    if (view === 'Semana') {
      setActiveView(view)
    } else {
      alert(`Visão "${view}" em breve!`)
    }
  }

  return (
    <MainLayout subtitle="Visualize e gerencie compromissos, audiências e prazos.">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReferenceDate((d) => subWeeks(d, 1))}
            className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setReferenceDate(new Date())}
            className="px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800"
          >
            Hoje
          </button>
          <button
            onClick={() => setReferenceDate((d) => addWeeks(d, 1))}
            className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 ml-2">
            {VIEW_OPTIONS.map((view) => (
              <button
                key={view}
                onClick={() => handleViewClick(view)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeView === view
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </div>

          <h2 className="text-white text-base font-semibold ml-2">
            {formatWeekRange(referenceDate)}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800">
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800">
            <Settings2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Compromisso
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <WeekCalendarGrid
            referenceDate={referenceDate}
            appointments={appointments ?? []}
            deadlines={deadlines ?? []}
          />

          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <p className="text-white text-2xl font-bold">{weekAppointmentsCount}</p>
              <p className="text-slate-500 text-xs">Compromissos esta semana</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <p className="text-white text-2xl font-bold">{audienciaCount}</p>
              <p className="text-slate-500 text-xs">Audiências esta semana</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <p className="text-white text-2xl font-bold">{deadlines?.length ?? 0}</p>
              <p className="text-slate-500 text-xs">Prazos esta semana</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-green-400 mx-auto mb-1" />
              <p className="text-white text-2xl font-bold">{reuniaoCount}</p>
              <p className="text-slate-500 text-xs">Reuniões esta semana</p>
            </div>
          </div>
        </div>

        <div className="w-80 space-y-4">
          <MiniCalendar selectedDate={referenceDate} onSelectDate={setReferenceDate} />

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Próximos Compromissos</h3>
            {todaysAppointments.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhum compromisso próximo.</p>
            ) : (
              <ul className="space-y-3">
                {todaysAppointments.map((appointment) => (
                  <li key={appointment.id} className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-slate-200 text-sm font-medium">{appointment.title}</p>
                      <p className="text-slate-500 text-xs">
                        {format(new Date(appointment.startTime), "dd 'de' MMM, HH:mm")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Prazos do Dia</h3>
            {todaysDeadlines.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhum prazo para hoje.</p>
            ) : (
              <ul className="space-y-2">
                {todaysDeadlines.map((deadline) => (
                  <li key={deadline.id} className="text-sm">
                    <p className="text-slate-200">{deadline.title}</p>
                    <p className="text-slate-500 text-xs">Proc. {deadline.process?.number}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Compromisso
          </button>
        </div>
      </div>

      {isModalOpen && <AppointmentFormModal onClose={() => setIsModalOpen(false)} />}
    </MainLayout>
  )
}