import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreVertical, Trash2, RefreshCw } from 'lucide-react'
import { updateProcessStatus, deleteProcess } from '../services/processService'
import { STATUS_LABELS } from '../lib/processLabels'

interface ProcessActionsMenuProps {
  processId: string
  processNumber: string
}

export default function ProcessActionsMenu({ processId, processNumber }: ProcessActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isStatusSubmenuOpen, setIsStatusSubmenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const [submenuOpensLeft, setSubmenuOpensLeft] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const statusButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setIsStatusSubmenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleToggle() {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 192 // w-48
      const viewportWidth = window.innerWidth

      const left =
        rect.right + menuWidth > viewportWidth ? rect.right - menuWidth : rect.left

      setMenuPosition({ top: rect.bottom + 4, left })
    }
    setIsOpen((prev) => !prev)
    setIsStatusSubmenuOpen(false)
  }

  function handleToggleStatusSubmenu() {
    if (!isStatusSubmenuOpen && statusButtonRef.current) {
      const rect = statusButtonRef.current.getBoundingClientRect()
      const submenuWidth = 176 // w-44
      const viewportWidth = window.innerWidth

      // Se não houver espaço suficiente à direita do menu principal, abre o submenu para a esquerda
      setSubmenuOpensLeft(rect.right + submenuWidth > viewportWidth)
    }
    setIsStatusSubmenuOpen((prev) => !prev)
  }

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateProcessStatus(processId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] })
      setIsOpen(false)
      setIsStatusSubmenuOpen(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteProcess(processId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] })
      setIsOpen(false)
    },
  })

  function handleDelete() {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o processo nº ${processNumber}? Essa ação não pode ser desfeita.`
    )
    if (confirmed) {
      deleteMutation.mutate()
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {isOpen && menuPosition && (
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: menuPosition.top, left: menuPosition.left }}
          className="w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1"
        >
          <div className="relative">
            <button
              ref={statusButtonRef}
              onClick={handleToggleStatusSubmenu}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left"
            >
              <RefreshCw className="w-4 h-4" />
              Mudar status
            </button>

            {isStatusSubmenuOpen && (
              <div
                className={`absolute top-0 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 ${
                  submenuOpensLeft ? 'right-full mr-1' : 'left-full ml-1'
                }`}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => statusMutation.mutate(value)}
                    disabled={statusMutation.isPending}
                    className="w-full px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left disabled:opacity-50"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-slate-700 my-1" />

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700 text-left disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      )}
    </>
  )
}