import { useState } from 'react'
import { Bell, Mail, Smartphone, Save, BellRing, AlertTriangle, Calendar, FileText, Users, Shield } from 'lucide-react'

interface NotificationSetting {
  id: string
  label: string
  description: string
  enabled: boolean
  icon: React.ElementType
}

export default function SettingsNotificationsTab() {
  const [systemNotifications, setSystemNotifications] = useState<NotificationSetting[]>([
    { id: 'new_process', label: 'Novo processo criado', description: 'Notificar quando um novo processo for adicionado ao sistema', enabled: true, icon: FileText },
    { id: 'deadline_alert', label: 'Alerta de prazo', description: 'Notificar quando um prazo estiver próximo do vencimento', enabled: true, icon: AlertTriangle },
    { id: 'appointment', label: 'Lembrete de compromisso', description: 'Notificar antes de audiências e reuniões agendadas', enabled: true, icon: Calendar },
    { id: 'new_user', label: 'Novo usuário adicionado', description: 'Notificar quando um novo usuário for cadastrado no sistema', enabled: false, icon: Users },
    { id: 'security_alert', label: 'Alerta de segurança', description: 'Notificar sobre tentativas de acesso suspeitas', enabled: true, icon: Shield },
  ])

  const [emailNotifications, setEmailNotifications] = useState<NotificationSetting[]>([
    { id: 'email_deadline', label: 'Resumo de prazos', description: 'Receber resumo diário dos prazos próximos por e-mail', enabled: true, icon: AlertTriangle },
    { id: 'email_report', label: 'Relatório semanal', description: 'Receber relatório semanal de atividades por e-mail', enabled: true, icon: FileText },
    { id: 'email_new_process', label: 'Novo processo', description: 'Receber e-mail quando um novo processo for atribuído', enabled: false, icon: FileText },
    { id: 'email_appointment', label: 'Confirmação de compromisso', description: 'Receber e-mail de confirmação para novos compromissos', enabled: true, icon: Calendar },
  ])

  const [pushNotifications, setPushNotifications] = useState<NotificationSetting[]>([
    { id: 'push_deadline', label: 'Prazos urgentes', description: 'Notificações push para prazos que vencem em menos de 24h', enabled: true, icon: AlertTriangle },
    { id: 'push_appointment', label: 'Compromissos do dia', description: 'Notificações push para compromissos agendados para hoje', enabled: true, icon: Calendar },
    { id: 'push_mention', label: 'Menções e atribuições', description: 'Notificar quando for mencionado ou atribuído a um processo', enabled: false, icon: BellRing },
  ])

  const [emailFrequency, setEmailFrequency] = useState('diario')
  const [emailTime, setEmailTime] = useState('08:00')

  function toggleNotification(
    list: NotificationSetting[],
    setList: React.Dispatch<React.SetStateAction<NotificationSetting[]>>,
    id: string
  ) {
    setList(list.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n))
  }

  const activeSystemCount = systemNotifications.filter((n) => n.enabled).length
  const activeEmailCount = emailNotifications.filter((n) => n.enabled).length
  const activePushCount = pushNotifications.filter((n) => n.enabled).length
  const totalActive = activeSystemCount + activeEmailCount + activePushCount
  const totalAll = systemNotifications.length + emailNotifications.length + pushNotifications.length
  const channelsActive = [activeSystemCount > 0, activeEmailCount > 0, activePushCount > 0].filter(Boolean).length

  function renderSection(
    title: string,
    description: string,
    icon: React.ElementType,
    list: NotificationSetting[],
    setList: React.Dispatch<React.SetStateAction<NotificationSetting[]>>,
    extra?: React.ReactNode
  ) {
    const Icon = icon
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-slate-500 text-xs">{description}</p>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {list.map(({ id, label, description: desc, enabled, icon: ItemIcon }) => (
            <div key={id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <ItemIcon className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-slate-200 text-sm">{label}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleNotification(list, setList, id)}
                className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${enabled ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          ))}
        </div>

        {extra}
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-4">
        {/* Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Total de Notificações</p>
            <p className="text-2xl font-bold text-white">{totalAll}</p>
            <p className="text-slate-500 text-xs">Tipos configuráveis</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Ativas</p>
            <p className="text-2xl font-bold text-white">{totalActive}</p>
            <p className="text-slate-500 text-xs">{Math.round((totalActive / totalAll) * 100)}% do total</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Canais configurados</p>
            <p className="text-2xl font-bold text-white">{channelsActive}</p>
            <p className="text-slate-500 text-xs">De 3 canais disponíveis</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Última notificação</p>
            <p className="text-lg font-bold text-white">Hoje, 14:30</p>
            <p className="text-slate-500 text-xs">Prazo próximo do vencimento</p>
          </div>
        </div>

        {/* Seção: Sistema */}
        {renderSection(
          'Notificações do Sistema',
          'Gerencie as notificações exibidas dentro do sistema',
          Bell,
          systemNotifications,
          setSystemNotifications
        )}

        {/* Seção: E-mail */}
        {renderSection(
          'Notificações por E-mail',
          'Configure quais notificações serão enviadas por e-mail',
          Mail,
          emailNotifications,
          setEmailNotifications,
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Frequência de e-mails</label>
              <select
                value={emailFrequency}
                onChange={(e) => setEmailFrequency(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
              >
                <option value="imediato">Imediato</option>
                <option value="diario">Resumo diário</option>
                <option value="semanal">Resumo semanal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Horário de envio</label>
              <input
                type="time"
                value={emailTime}
                onChange={(e) => setEmailTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
              />
            </div>
          </div>
        )}

        {/* Seção: Push */}
        {renderSection(
          'Notificações Push',
          'Configure as notificações push para dispositivos móveis',
          Smartphone,
          pushNotifications,
          setPushNotifications
        )}
      </div>

      {/* Painel lateral */}
      <aside className="w-72 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Resumo dos Canais</h3>
          <div className="space-y-3">
            {[
              { label: 'Sistema', icon: Bell, count: activeSystemCount, total: systemNotifications.length, color: 'text-purple-400' },
              { label: 'E-mail', icon: Mail, count: activeEmailCount, total: emailNotifications.length, color: 'text-blue-400' },
              { label: 'Push', icon: Smartphone, count: activePushCount, total: pushNotifications.length, color: 'text-green-400' },
            ].map(({ label, icon: Icon, count, total, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-slate-300 text-sm">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${Math.round((count / total) * 100)}%` }}
                    />
                  </div>
                  <span className="text-slate-500 text-xs">{count}/{total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-2">E-mail configurado</h3>
          <p className="text-slate-500 text-xs mb-3">As notificações por e-mail serão enviadas para:</p>
          <p className="text-purple-400 text-sm font-medium mb-4">contato@asimov.com.br</p>
          <button className="w-full border border-slate-700 text-slate-300 text-sm py-2 rounded-lg hover:bg-slate-800 transition-colors">
            Alterar e-mail
          </button>
        </div>

        <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Salvar preferências
        </button>
      </aside>
    </div>
  )
}