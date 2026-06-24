import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface MainLayoutProps {
  children: ReactNode
  subtitle?: string
}

export default function MainLayout({ children, subtitle }: MainLayoutProps) {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header subtitle={subtitle} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}