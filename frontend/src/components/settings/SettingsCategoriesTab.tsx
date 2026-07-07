import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, MoreVertical, X, Tag, Archive } from 'lucide-react'
import { getAllCategories } from '../../services/categoryService'
import type { CategoryItem } from '../../services/categoryService'
import CategoryFormModal from '../CategoryFormModal'
import CategoryEditModal from '../CategoryEditModal'
import apiClient from '../../lib/axios'

const TYPE_LABELS: Record<string, string> = {
  AREA_DO_DIREITO: 'Área',
  TIPO_DE_PROCESSO: 'Tipo de Processo',
  FASE: 'Fase',
  VARA: 'Vara',
}

const TYPE_COLORS: Record<string, string> = {
  AREA_DO_DIREITO: 'bg-purple-500/20 text-purple-400',
  TIPO_DE_PROCESSO: 'bg-blue-500/20 text-blue-400',
  FASE: 'bg-green-500/20 text-green-400',
  VARA: 'bg-amber-500/20 text-amber-400',
}

const CATEGORY_COLORS = ['#a855f7', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#64748b']

export default function SettingsCategoriesTab() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const queryClient = useQueryClient()

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
  })

  const toggleActiveMutation = useMutation({
    mutationFn: (category: CategoryItem) =>
      apiClient.put(`/categories/${category.id}`, { isActive: !category.isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setSelectedCategory(null)
    },
  })

  const activeCount = categories.filter((c) => c.isActive).length
  const archivedCount = categories.filter((c) => !c.isActive).length

  const filtered = categories.filter((category) => {
    const matchesSearch =
      search.trim() === '' ||
      category.name.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === '' || category.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Total de Categorias</p>
            <p className="text-2xl font-bold text-white">{categories.length}</p>
            <p className="text-slate-500 text-xs">Categorias cadastradas</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Ativas</p>
            <p className="text-2xl font-bold text-white">{activeCount}</p>
            <p className="text-slate-500 text-xs">{Math.round((activeCount / Math.max(categories.length, 1)) * 100)}% do total</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Arquivadas</p>
            <p className="text-2xl font-bold text-white">{archivedCount}</p>
            <p className="text-slate-500 text-xs">{Math.round((archivedCount / Math.max(categories.length, 1)) * 100)}% do total</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">Última atualização</p>
            <p className="text-lg font-bold text-white">Hoje</p>
            <p className="text-slate-500 text-xs">Por Vinícios Souza</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Buscar categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
          >
            <option value="">Todos os tipos</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Categoria
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          {isLoading ? (
            <p className="text-slate-500 text-sm">Carregando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500 text-sm">Nenhuma categoria encontrada.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-800">
                  <th className="pb-3 font-medium">Categoria</th>
                  <th className="pb-3 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">Descrição</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((category, index) => (
                  <tr
                    key={category.id}
                    onClick={() => setSelectedCategory(category)}
                    className={`border-b border-slate-800/50 last:border-0 cursor-pointer hover:bg-slate-800/50 ${selectedCategory?.id === category.id ? 'bg-slate-800/50' : ''}`}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}20` }}
                        >
                          <Tag className="w-3.5 h-3.5" style={{ color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }} />
                        </div>
                        <p className="text-slate-200 font-medium">{category.name}</p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${TYPE_COLORS[category.type] ?? 'bg-slate-700 text-slate-300'}`}>
                        {TYPE_LABELS[category.type] ?? category.type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-xs max-w-48 truncate">
                      {category.description ?? '—'}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-green-400' : 'bg-slate-500'}`} />
                        <span className={category.isActive ? 'text-green-400' : 'text-slate-500'}>
                          {category.isActive ? 'Ativa' : 'Arquivada'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingCategory(category)}
                          className="p-1.5 rounded hover:bg-slate-700 text-slate-400"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-700 text-slate-400">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-slate-500 text-sm">
              Mostrando 1 a {filtered.length} de {categories.length} categorias
            </p>
          </div>
        </div>
      </div>

      {selectedCategory && (
        <aside className="w-72 bg-slate-900 border border-slate-800 rounded-xl p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                <Tag className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold">{selectedCategory.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded ${TYPE_COLORS[selectedCategory.type]}`}>
                  {TYPE_LABELS[selectedCategory.type] ?? selectedCategory.type}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedCategory(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 mb-5 text-sm border-b border-slate-800 pb-4">
            <p className="text-slate-500 text-xs uppercase mb-2">Informações Gerais</p>
            <div className="flex justify-between">
              <span className="text-slate-500">Nome</span>
              <span className="text-slate-200">{selectedCategory.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tipo</span>
              <span className="text-slate-200">{TYPE_LABELS[selectedCategory.type] ?? selectedCategory.type}</span>
            </div>
            {selectedCategory.description && (
              <div>
                <span className="text-slate-500">Descrição</span>
                <p className="text-slate-200 mt-1">{selectedCategory.description}</p>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className={selectedCategory.isActive ? 'text-green-400' : 'text-slate-500'}>
                {selectedCategory.isActive ? '● Ativa' : '● Arquivada'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setEditingCategory(selectedCategory)}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Editar Categoria
            </button>
            <button
              onClick={() => toggleActiveMutation.mutate(selectedCategory)}
              disabled={toggleActiveMutation.isPending}
              className="w-full flex items-center justify-center gap-2 border border-red-800 text-red-400 text-sm py-2 rounded-lg hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              <Archive className="w-4 h-4" />
              {selectedCategory.isActive ? 'Arquivar Categoria' : 'Reativar Categoria'}
            </button>
          </div>
        </aside>
      )}

      {isCreateModalOpen && <CategoryFormModal onClose={() => setIsCreateModalOpen(false)} />}
      {editingCategory && <CategoryEditModal category={editingCategory} onClose={() => setEditingCategory(null)} />}
    </div>
  )
}