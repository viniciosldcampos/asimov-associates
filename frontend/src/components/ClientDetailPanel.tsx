import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X, Mail, Phone, MapPin } from 'lucide-react'
import { getClientById } from '../services/clientService'
import { STATUS_LABELS, STATUS_STYLES } from '../lib/processLabels'

interface ClientDetailPanelProps {
  clientId: string
  onClose: () => void
}

export default function ClientDetailPanel({ clientId, onClose }: ClientDetailPanelProps) {
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClientById(clientId),
  })

  const activeCount = client?.processes.filter((p) => p.status === 'EM_ANDAMENTO').length ?? 0
  const completedCount = client?.processes.filter((p) => p.status === 'CONCLUIDO').length ?? 0

  return (
    <aside className="w-96 bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
      <div className="flex justify-end mb-2">
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {isLoading ? (
        <p className="text-slate-500 text-sm">Carregando...</p>
      ) : !client ? (
        <p className="text-slate-500 text-sm">Cliente não encontrado.</p>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg">
              {client.name
                .split(' ')
                .slice(0, 2)
                .map((n) => n.charAt(0))
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold">{client.name}</h3>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    client.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {client.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="text-slate-500 text-xs">
                {client.type === 'PESSOA_FISICA' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </p>
              <p className="text-slate-500 text-xs">
                Cliente desde {format(new Date(client.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="space-y-2 mb-5 text-sm">
            <p className="text-slate-500 text-xs uppercase mb-1">Informações de Contato</p>
            {client.email && (
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-slate-500" />
                {client.email}
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                {client.phone}
              </div>
            )}
            {client.address && (
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500" />
                {client.address}
                {client.city ? `, ${client.city} - ${client.state ?? ''}` : ''}
              </div>
            )}
          </div>

          <div className="mb-5 text-sm">
            <p className="text-slate-500 text-xs uppercase mb-2">Documentos</p>
            {client.cpf && (
              <div className="flex justify-between py-1">
                <span className="text-slate-500">CPF</span>
                <span className="text-slate-200">{client.cpf}</span>
              </div>
            )}
            {client.cnpj && (
              <div className="flex justify-between py-1">
                <span className="text-slate-500">CNPJ</span>
                <span className="text-slate-200">{client.cnpj}</span>
              </div>
            )}
            {client.rg && (
              <div className="flex justify-between py-1">
                <span className="text-slate-500">RG</span>
                <span className="text-slate-200">{client.rg}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
            <div>
              <p className="text-white font-bold text-lg">{client.processes.length}</p>
              <p className="text-slate-500 text-xs">Processos</p>
            </div>
            <div>
              <p className="text-blue-400 font-bold text-lg">{activeCount}</p>
              <p className="text-slate-500 text-xs">Em andamento</p>
            </div>
            <div>
              <p className="text-green-400 font-bold text-lg">{completedCount}</p>
              <p className="text-slate-500 text-xs">Concluídos</p>
            </div>
          </div>

          <div>
            <p className="text-slate-500 text-xs uppercase mb-2">Últimos Processos</p>
            {client.processes.length === 0 ? (
              <p className="text-slate-500 text-sm">Nenhum processo vinculado.</p>
            ) : (
              <ul className="space-y-2">
                {client.processes.slice(0, 5).map((process) => (
                  <li key={process.id} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">#{process.number}</span>
                    <span className={`text-xs font-medium ${STATUS_STYLES[process.status] ?? 'text-slate-400'}`}>
                      {STATUS_LABELS[process.status] ?? process.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </aside>
  )
}