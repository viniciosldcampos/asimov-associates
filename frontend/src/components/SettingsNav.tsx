import {
  Settings,
  Users,
  Lock,
  Tag,
  Bell,
  Shield,
  Plug,
  HardDrive,
} from 'lucide-react'

export type SettingsTab =
  | 'geral'
  | 'usuarios'
  | 'permissoes'
  | 'categorias'
  | 'notificacoes'
  | 'seguranca'
  | 'integracoes'
  | 'backup'

const TABS: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'geral', label: 'Geral', icon: Settings },
  { key: 'usuarios', label: 'Usuários', icon: Users },
  { key: 'permissoes', label: 'Permissões', icon: Lock },
  { key: 'categorias', label: 'Categorias', icon: Tag },
  { key: 'notificacoes', label: 'Notificações', icon: Bell },
  { key: 'seguranca', label: 'Segurança', icon: Shield },
  { key: 'integracoes', label: 'Integrações', icon: Plug },
  { key: 'backup', label: 'Backup', icon: HardDrive },
]

interface SettingsNavProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
}

export default function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  return (
    <nav className="flex items-center gap-1 border-b border-slate-800 mb-6 overflow-x-auto">
      {TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => onTabChange(key)}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
            activeTab === key
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </nav>
  )
}