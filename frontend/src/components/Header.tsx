import { Search, Bell, UserCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/useAuth'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

interface HeaderProps {
  subtitle?: string
}

export default function Header({ subtitle }: HeaderProps) {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] ?? ''

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
      <div>
        <h2 className="text-white text-xl font-semibold">
          {getGreeting()}, {firstName}!
        </h2>
        {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar processo, cliente, advogado..."
            className="w-80 bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button className="relative p-2.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
          <Bell className="w-5 h-5 text-slate-300" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <button className="p-2.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
          <UserCircle2 className="w-5 h-5 text-slate-300" />
        </button>
      </div>
    </header>
  )
}