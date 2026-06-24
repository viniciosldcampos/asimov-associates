import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCircle,
  Calendar,
  Clock,
  BarChart3,
  Settings,
  Scale,
} from 'lucide-react'
import { useAuth } from '../contexts/useAuth'

const menuItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/processos', icon: FileText, label: 'Processos' },
  { to: '/advogados', icon: Users, label: 'Advogados' },
  { to: '/clientes', icon: UserCircle, label: 'Clientes' },
  { to: '/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/prazos', icon: Clock, label: 'Prazos' },
  { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen">
      <div className="p-6 flex items-center gap-2">
        <Scale className="w-7 h-7 text-purple-500" />
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">ASIMOV</h1>
          <p className="text-slate-500 text-xs tracking-wider">ASSOCIATES</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-600/20 text-purple-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-sm">
          {user?.name?.charAt(0) ?? '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
          <p className="text-slate-500 text-xs capitalize">
            {user?.role?.toLowerCase()}
          </p>
        </div>
      </div>
    </aside>
  )
}