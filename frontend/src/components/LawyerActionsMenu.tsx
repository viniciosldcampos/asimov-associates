import { useState, useRef, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MoreVertical, Pencil, UserX, UserCheck } from 'lucide-react'
import { toggleLawyerActive } from '../services/lawyerService'

interface LawyerActionsMenuProps {
  lawyerId: string
  lawyerName: string
  isActive: boolean
  onEdit: () => void
}

export default function LawyerActionsMenu({
  lawyerId,
  lawyerName,
  isActive,
  onEdit,
}: LawyerActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
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
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleToggle() {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 192
      const viewportWidth = window.innerWidth

      const left = rect.right + menuWidth > viewportWidth ? rect.right - menuWidth : rect.left

      setMenuPosition({ top: rect.bottom + 4, left })
    }
    setIsOpen((prev) => !prev)
  }

  const toggleActiveMutation = useMutation({
    mutationFn: () => toggleLawyerActive(lawyerId, !isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] })
      setIsOpen(false)
    },
  })

  function handleToggleActive() {
    const action = isActive ? 'desativar' : 'reativar'
    const confirmed = window.confirm(`Tem certeza que deseja ${action} ${lawyerName}?`)
    if (confirmed) {
      toggleActiveMutation.mutate()
    }
  }

  function handleEdit() {
    setIsOpen(false)
    onEdit()
  }

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation()
          handleToggle()
        }}
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
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit()
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 text-left"
          >
            <Pencil className="w-4 h-4" />
            Editar advogado
          </button>

          <div className="h-px bg-slate-700 my-1" />

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleToggleActive()
            }}
            disabled={toggleActiveMutation.isPending}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left disabled:opacity-50 hover:bg-slate-700 ${
              isActive ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
            {isActive ? 'Desativar' : 'Reativar'}
          </button>
        </div>
      )}
    </>
  )
}