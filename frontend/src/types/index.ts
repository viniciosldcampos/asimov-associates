export interface User {
  id: string;
  name: string;
  email: string;
  role:
    | "ADMINISTRADOR"
    | "ADVOGADO"
    | "ASSISTENTE"
    | "ESTAGIARIO"
    | "FINANCEIRO"
    | "VISUALIZADOR";
  avatar?: string;
  phone?: string;
  oab?: string;
  oabState?: string;
  specialties?: string[];
  experienceYears?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  type: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  cpf?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Process {
  id: string;
  number: string;
  description?: string;
  status:
    | "EM_ANDAMENTO"
    | "CONCLUIDO"
    | "VENCIDO"
    | "AGUARDANDO"
    | "PENDENTE"
    | "ARQUIVADO";
  instance: string;
  phase: string;
  startDate: string;
  endDate?: string;
  isFinished: boolean;
  clientId: string;
  lawyerId: string;
  categoryId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
