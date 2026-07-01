import { useState } from 'react'
import { Save, Upload, Building2, CheckCircle, Clock, Database, CloudUpload, Pencil } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getAllCategories } from '../../services/categoryService'

export default function SettingsGeneralTab() {
  const [officeName, setOfficeName] = useState('Asimov Associates')
  const [cnpj, setCnpj] = useState('12.345.678/0001-90')
  const [email, setEmail] = useState('contato@asimov.com.br')
  const [phone, setPhone] = useState('(51) 99999-9999')
  const [address, setAddress] = useState('Rua dos Andradas, 1234, Centro')
  const [city, setCity] = useState('Porto Alegre')
  const [state, setState] = useState('RS')
  const [zipCode, setZipCode] = useState('90010-000')
  const [darkMode, setDarkMode] = useState(true)
  const [deadlineReminders, setDeadlineReminders] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pdfSignature, setPdfSignature] = useState(false)
  const [timezone, setTimezone] = useState('America/Sao_Paulo')

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getAllCategories(),
  })

  const toggleItems = [
    { label: 'Modo escuro', description: 'Ativar o modo escuro em toda a aplicação', value: darkMode, setter: setDarkMode },
    { label: 'Lembrete de prazos', description: 'Receber notificações sobre prazos próximos', value: deadlineReminders, setter: setDeadlineReminders },
    { label: 'Notificações por e-mail', description: 'Receber notificações por e-mail', value: emailNotifications, setter: setEmailNotifications },
    { label: 'Assinatura em PDF', description: 'Incluir assinatura do escritório nos relatórios', value: pdfSignature, setter: setPdfSignature },
  ]

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">

        {/* Linha 1: col-span-2 + col-span-1 */}
        <div className="grid grid-cols-3 gap-6">

          {/* Informações do Escritório (2/3) */}
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Informações do Escritório</h3>
            <p className="text-slate-500 text-xs mb-4">Gerencie as informações principais do escritório.</p>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nome do Escritório</label>
                <input type="text" value={officeName} onChange={(e) => setOfficeName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">CNPJ</label>
                <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-xs text-slate-400 mb-1">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="mb-3">
              <label className="block text-xs text-slate-400 mb-1">Telefone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="mb-3">
              <label className="block text-xs text-slate-400 mb-1">Endereço</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Cidade / Estado</label>
                <div className="flex gap-2">
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  <select value={state} onChange={(e) => setState(e.target.value)}
                    className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-sm text-white">
                    <option>RS</option><option>SP</option><option>RJ</option><option>MG</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">CEP</label>
                <input type="text" value={zipCode} onChange={(e) => setZipCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div>
                <p className="text-xs text-slate-400 mb-1">Logo do Escritório</p>
                <p className="text-slate-500 text-xs mb-2">Sua logo será exibida em relatórios e documentos.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-600/20 border border-purple-600 flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 text-xs hover:bg-slate-800">
                    <Upload className="w-3 h-3" />
                    Alterar logo
                  </button>
                  <p className="text-slate-500 text-xs mt-1">Formatos: PNG, JPG ou SVG. 512x512px</p>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <Save className="w-4 h-4" />
              Salvar alterações
            </button>
          </div>

          {/* Configurações do Sistema (1/3) */}
          <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Configurações do Sistema</h3>
            <p className="text-slate-500 text-xs mb-4">Defina as preferências gerais do sistema.</p>

            <div className="space-y-4">
              {toggleItems.map(({ label, description, value, setter }) => (
                <div key={label} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-slate-200 text-sm">{label}</p>
                    <p className="text-slate-500 text-xs">{description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setter(!value)}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-purple-600' : 'bg-slate-700'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              ))}

              <div className="pt-2">
                <p className="text-slate-200 text-sm mb-1">Fuso horário</p>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">
                  <option value="America/Sao_Paulo">(GMT-03:00) Brasília</option>
                  <option value="America/Manaus">(GMT-04:00) Manaus</option>
                  <option value="America/Fortaleza">(GMT-03:00) Fortaleza</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Linha 2: 3 cards iguais */}
        <div className="grid grid-cols-3 gap-6">

          {/* Configurações de Documentos */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Configurações de Documentos</h3>
            <p className="text-slate-500 text-xs mb-4">Personalize a numeração e templates dos documentos.</p>

            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1">Modelo de numeração de processo</label>
              <div className="grid grid-cols-2 gap-2">
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
                  <option>ANO-NÚMERO-INSTÂNCIA</option>
                  <option>NÚMERO-ANO</option>
                </select>
                <input type="text" defaultValue="000123" readOnly
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300" />
              </div>
              <p className="text-slate-500 text-xs mt-1">Será utilizado no próximo processo criado.</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-slate-400 mb-1">Template padrão de Petição</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
                <option>Petição Padrão - Asimov Associates</option>
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-xs text-slate-400 mb-1">Template de Contrato</label>
              <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300">
                <option>Contrato Padrão - Asimov Associates</option>
              </select>
            </div>

            <button className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Save className="w-3 h-3" />
              Salvar configurações
            </button>
          </div>

          {/* Categorias Personalizadas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Categorias Personalizadas</h3>
            <p className="text-slate-500 text-xs mb-4">Gerencie as categorias utilizadas no sistema.</p>

            <ul className="space-y-1 mb-4">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600/30 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                    </span>
                    <span className="text-slate-200 text-sm">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-xs">— subcategorias</span>
                    <button className="text-slate-500 hover:text-slate-300">
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <button className="w-full border border-slate-700 text-slate-300 text-xs font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors">
              Gerenciar categorias
            </button>
          </div>

          {/* Backup e Segurança */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-1">Backup e Segurança</h3>
            <p className="text-slate-500 text-xs mb-4">Gerencie backups e configurações de segurança.</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-200 text-sm">Backup automático</p>
                    <p className="text-slate-500 text-xs">Realizado diariamente às 02:00 AM</p>
                  </div>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Ativo</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-slate-200 text-sm">Último backup</p>
                    <p className="text-slate-500 text-xs">08/06/2026 02:00 AM</p>
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-slate-200 text-sm">Próximo backup</p>
                  <p className="text-slate-500 text-xs">09/06/2026 02:00 AM</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm">Retenção de backup</p>
                <select className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300">
                  <option>30 dias</option>
                  <option>60 dias</option>
                  <option>90 dias</option>
                </select>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-slate-700 text-slate-300 text-xs font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors">
              <CloudUpload className="w-3 h-3" />
              Fazer backup agora
            </button>
          </div>
        </div>
      </div>

      {/* Painel lateral */}
      <aside className="w-72 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="h-20 bg-linear-to-br from-purple-600/40 to-purple-900/40 relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl border-4 border-slate-900">
              AA
            </div>
          </div>
          <div className="pt-10 pb-5 px-5 text-center">
            <h3 className="text-white font-semibold">Asimov Associates</h3>
            <span className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded">Plano Premium</span>

            <div className="mt-4 space-y-2 text-sm text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Plano</span>
                <span className="text-white">Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Usuários</span>
                <span className="text-white">12 / 25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Armazenamento</span>
                <span className="text-white">8.4 GB / 50 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Renovação</span>
                <span className="text-white">15/08/2026</span>
              </div>
            </div>

            <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
              Gerenciar Plano
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-3">Atividade Recente</h3>
          <ul className="space-y-3">
            {[
              { text: 'Usuário Vinícios S. atualizou as configurações', time: 'Hoje, 14:30' },
              { text: 'Novo usuário João Pedro foi adicionado', time: 'Hoje, 11:15' },
              { text: 'Backup automático realizado com sucesso', time: 'Ontem, 23:45' },
              { text: 'Relatório mensal gerado', time: 'Ontem, 18:20' },
              { text: 'Integração com Google Drive conectada', time: 'Ontem, 16:10' },
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <Database className="w-3 h-3 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-300">{item.text}</p>
                  <p className="text-slate-500">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
          <button className="w-full mt-3 border border-slate-700 text-slate-300 text-xs font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors">
            Ver todas as atividades
          </button>
        </div>
      </aside>
    </div>
  )
}