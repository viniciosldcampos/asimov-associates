import { useState } from 'react'
import MainLayout from '../components/MainLayout'
import SettingsNav from '../components/SettingsNav'
import SettingsGeneralTab from '../components/settings/SettingsGeneralTab'
import SettingsUsersTab from '../components/settings/SettingsUsersTab'
import SettingsPermissionsTab from '../components/settings/SettingsPermissionsTab'
import SettingsCategoriesTab from '../components/settings/SettingsCategoriesTab'
import type { SettingsTab } from '../components/SettingsNav'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('geral')

  return (
    <MainLayout subtitle="Personalize e gerencie as configurações do sistema.">
      <h2 className="text-white text-2xl font-bold mb-5">Configurações</h2>
      <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'geral' && <SettingsGeneralTab />}
      {activeTab === 'usuarios' && <SettingsUsersTab />}
      {activeTab === 'permissoes' && <SettingsPermissionsTab />}
      {activeTab === 'categorias' && <SettingsCategoriesTab />}
      {!['geral', 'usuarios', 'permissoes', 'categorias'].includes(activeTab) && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-500">Esta seção está em desenvolvimento.</p>
        </div>
      )}
    </MainLayout>
  )
}