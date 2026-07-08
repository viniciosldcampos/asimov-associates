import { useState } from 'react'
import { Shield, Lock, Smartphone, Monitor, Globe, AlertTriangle, CheckCircle, Eye, EyeOff, Save } from 'lucide-react'

export default function SettingsSecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('30')

  function getPasswordStrength(password: string) {
    if (password.length === 0) return { label: '', color: '', width: '0%' }
    if (password.length < 6) return { label: 'Fraca', color: 'bg-red-500', width: '25%' }
    if (password.length < 8) return { label: 'Média', color: 'bg-amber-500', width: '50%' }
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: 'Boa', color: 'bg-blue-500', width: '75%' }
    return { label: 'Forte', color: 'bg-green-500', width: '100%' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  const sessions = [
    { id: '1', device: 'Chrome — Windows 11', location: 'Porto Alegre, RS', ip: '189.6.xxx.xxx', time: 'Agora', current: true, icon: Monitor },
    { id: '2', device: 'Safari — iPhone 14', location: 'Porto Alegre, RS', ip: '189.6.xxx.xxx', time: '2h atrás', current: false, icon: Smartphone },
    { id: '3', device: 'Firefox — macOS', location: 'São Paulo, SP', ip: '177.71.xxx.xxx', time: 'Ontem, 18:30', current: false, icon: Globe },
  ]

  const securityLogs = [
    { event: 'Login realizado com sucesso', time: 'Hoje, 14:22', type: 'success' },
    { event: 'Senha alterada', time: 'Ontem, 10:15', type: 'warning' },
    { event: 'Tentativa de login falhou', time: '05/06/2026, 22:43', type: 'error' },
    { event: 'Login realizado com sucesso', time: '05/06/2026, 09:11', type: 'success' },
    { event: '2FA desativado', time: '04/06/2026, 16:30', type: 'warning' },
  ]

  const securityScore = twoFactorEnabled ? 85 : 60
  const securityLabel = securityScore >= 80 ? 'Alto' : securityScore >= 60 ? 'Médio' : 'Baixo'
  const securityColor = securityScore >= 80 ? 'text-green-400' : securityScore >= 60 ? 'text-amber-400' : 'text-red-400'
  const securityBarColor = securityScore >= 80 ? 'bg-green-500' : securityScore >= 60 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-4">
        {/* Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Nível de Segurança</p>
            <p className={`text-2xl font-bold ${securityColor}`}>{securityLabel}</p>
            <p className="text-slate-500 text-xs">{securityScore}% de proteção</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Sessões Ativas</p>
            <p className="text-2xl font-bold text-white">{sessions.length}</p>
            <p className="text-slate-500 text-xs">Dispositivos conectados</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Tentativas de Login</p>
            <p className="text-2xl font-bold text-red-400">1</p>
            <p className="text-slate-500 text-xs">Falha nos últimos 7 dias</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Autenticação 2FA</p>
            <p className={`text-2xl font-bold ${twoFactorEnabled ? 'text-green-400' : 'text-slate-400'}`}>
              {twoFactorEnabled ? 'Ativa' : 'Inativa'}
            </p>
            <p className="text-slate-500 text-xs">{twoFactorEnabled ? 'Proteção extra ativada' : 'Recomendado ativar'}</p>
          </div>
        </div>

        {/* Alterar Senha */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Alterar Senha</h3>
              <p className="text-slate-500 text-xs">Mantenha sua conta segura com uma senha forte</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Senha atual</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Digite sua senha atual"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Nova senha</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Digite a nova senha"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Força da senha</span>
                    <span className="text-xs text-slate-300">{passwordStrength.label}</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Confirmar nova senha</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a nova senha"
                  className={`w-full bg-slate-800 border rounded-lg px-4 py-2.5 pr-10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    confirmPassword && confirmPassword !== newPassword ? 'border-red-500' : 'border-slate-700'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-red-400 text-xs mt-1">As senhas não coincidem</p>
              )}
            </div>
          </div>

          <button className="mt-4 flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            Alterar senha
          </button>
        </div>

        {/* 2FA */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Autenticação de Dois Fatores (2FA)</h3>
                <p className="text-slate-500 text-xs">Adicione uma camada extra de segurança à sua conta</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${twoFactorEnabled ? 'bg-purple-600' : 'bg-slate-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${twoFactorEnabled ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          {twoFactorEnabled && (
            <div className="bg-slate-800/50 rounded-lg p-4 text-sm">
              <p className="text-slate-300 mb-2">
                Escaneie o QR code abaixo com o aplicativo Google Authenticator ou Authy.
              </p>
              <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-3">
                <div className="grid grid-cols-5 gap-0.5 p-1">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className={`w-4 h-4 ${[1,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1][i] ? "bg-black" : "bg-white"}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-500 text-xs">
                Código de backup: <span className="text-white font-mono">XKCD-7892-ABCD-1234</span>
              </p>
            </div>
          )}
        </div>

        {/* Sessões Ativas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Sessões Ativas</h3>
              <p className="text-slate-500 text-xs">Gerencie os dispositivos conectados à sua conta</p>
            </div>
          </div>

          <div className="space-y-3">
            {sessions.map((session) => {
              const Icon = session.icon
              return (
                <div key={session.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-slate-200 text-sm font-medium">{session.device}</p>
                      <p className="text-slate-500 text-xs">{session.location} · {session.ip} · {session.time}</p>
                    </div>
                  </div>
                  {session.current ? (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Atual</span>
                  ) : (
                    <button className="text-xs text-red-400 hover:underline">Encerrar</button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Tempo limite de sessão</p>
              <p className="text-slate-500 text-xs">Encerrar sessão após inatividade</p>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="240">4 horas</option>
            </select>
          </div>
        </div>

        {/* Log de Segurança */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-purple-600/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Log de Segurança</h3>
              <p className="text-slate-500 text-xs">Histórico de eventos de segurança da sua conta</p>
            </div>
          </div>

          <div className="space-y-2">
            {securityLogs.map((log, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                <div className="flex items-center gap-2">
                  {log.type === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                  {log.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {log.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  <span className="text-slate-300 text-sm">{log.event}</span>
                </div>
                <span className="text-slate-500 text-xs">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Painel lateral */}
      <aside className="w-72 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Nível de Segurança</h3>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-2xl font-bold ${securityColor}`}>{securityLabel}</span>
            <span className="text-slate-400 text-sm">{securityScore}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all ${securityBarColor}`}
              style={{ width: `${securityScore}%` }}
            />
          </div>

          <p className="text-slate-500 text-xs uppercase mb-2">Recomendações</p>
          <ul className="space-y-2">
            {[
              { label: 'Senha forte configurada', done: newPassword.length >= 8 },
              { label: '2FA ativado', done: twoFactorEnabled },
              { label: 'E-mail verificado', done: true },
              { label: 'Sessões revisadas', done: true },
            ].map(({ label, done }) => (
              <li key={label} className="flex items-center gap-2 text-xs">
                {done
                  ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                }
                <span className={done ? 'text-slate-300' : 'text-slate-400'}>{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">Ações Rápidas</h3>
          <div className="space-y-2">
            <button className="w-full border border-slate-700 text-slate-300 text-sm py-2 rounded-lg hover:bg-slate-800 transition-colors">
              Encerrar todas as sessões
            </button>
            <button className="w-full border border-red-800 text-red-400 text-sm py-2 rounded-lg hover:bg-red-900/20 transition-colors">
              Revogar todos os acessos
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}