import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { createProcess } from '../services/createProcess'
import type { CreateProcessInput } from '../services/createProcess'
import StepProcessData from './process-form-steps/StepProcessData'
import StepClient from './process-form-steps/StepClient'
import StepLawyer from './process-form-steps/StepLawyer'
import StepDates from './process-form-steps/StepDates'
import StepSummary from './process-form-steps/StepSummary'

export interface ProcessFormData {
  number: string
  description: string
  clientId: string
  clientName: string
  lawyerId: string
  lawyerName: string
  instance: string
  vara: string
  phase: string
  startDate: string
  endDate: string
  isFinished: boolean
  isExpired: boolean
}

const STEPS = ['Dados do Processo', 'Cliente', 'Advogado e Instância', 'Prazos e Datas', 'Resumo']

const initialData: ProcessFormData = {
  number: '',
  description: '',
  clientId: '',
  clientName: '',
  lawyerId: '',
  lawyerName: '',
  instance: '',
  vara: '',
  phase: '',
  startDate: '',
  endDate: '',
  isFinished: false,
  isExpired: false,
}

interface ProcessFormModalProps {
  onClose: () => void
}

export default function ProcessFormModal({ onClose }: ProcessFormModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ProcessFormData>(initialData)
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateProcessInput) => createProcess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] })
      onClose()
    },
  })

  function updateData(partial: Partial<ProcessFormData>) {
    setFormData((prev) => ({ ...prev, ...partial }))
  }

  function nextStep() {
    setStep((s) => Math.min(STEPS.length, s + 1))
  }

  function prevStep() {
    setStep((s) => Math.max(1, s - 1))
  }

  function handleSave() {
    mutation.mutate({
      number: formData.number,
      description: formData.description || undefined,
      instance: formData.instance,
      phase: formData.phase,
      vara: formData.vara || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      isFinished: formData.isFinished,
      isExpired: formData.isExpired,
      clientId: formData.clientId,
      lawyerId: formData.lawyerId,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-semibold text-lg">Adicionar Processo</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center mb-6">
          {STEPS.map((_, index) => {
            const stepNumber = index + 1
            const isActive = stepNumber === step
            const isDone = stepNumber < step

            return (
              <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : isDone
                        ? 'bg-purple-600/30 text-purple-400'
                        : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < STEPS.length && (
                  <div
                    className={`flex-1 h-px mx-2 ${isDone ? 'bg-purple-600' : 'bg-slate-800'}`}
                  />
                )}
              </div>
            )
          })}
        </div>

        <p className="text-slate-300 font-medium mb-4">{STEPS[step - 1]}</p>

        {step === 1 && <StepProcessData data={formData} onChange={updateData} />}
        {step === 2 && <StepClient data={formData} onChange={updateData} />}
        {step === 3 && <StepLawyer data={formData} onChange={updateData} />}
        {step === 4 && <StepDates data={formData} onChange={updateData} />}
        {step === 5 && <StepSummary data={formData} />}

        {mutation.isError && (
          <p className="text-red-400 text-sm mt-3">
            Erro ao salvar processo. Verifique os dados e tente novamente.
          </p>
        )}

        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm hover:bg-slate-800"
            >
              Cancelar
            </button>
          )}

          {step < STEPS.length ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={mutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              {mutation.isPending ? 'Salvando...' : 'Salvar Processo'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}