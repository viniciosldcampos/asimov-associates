import apiClient from "../lib/axios";

export interface UserListItem {
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
  phone?: string;
  position?: string;
  team?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const ROLE_LABELS: Record<string, string> = {
  ADMINISTRADOR: "Administrador",
  ADVOGADO: "Advogado",
  ASSISTENTE: "Assistente",
  ESTAGIARIO: "Estagiário",
  FINANCEIRO: "Financeiro",
  VISUALIZADOR: "Visualizador",
};

export const ROLE_COLORS: Record<string, string> = {
  ADMINISTRADOR: "bg-purple-500/20 text-purple-400",
  ADVOGADO: "bg-blue-500/20 text-blue-400",
  ASSISTENTE: "bg-green-500/20 text-green-400",
  ESTAGIARIO: "bg-amber-500/20 text-amber-400",
  FINANCEIRO: "bg-cyan-500/20 text-cyan-400",
  VISUALIZADOR: "bg-slate-500/20 text-slate-400",
};

export async function getAllUsers() {
  const response = await apiClient.get<UserListItem[]>("/users");
  return response.data;
}

export async function getUserById(id: string) {
  const response = await apiClient.get<UserListItem>(`/users/${id}`);
  return response.data;
}

export async function updateUser(id: string, data: Partial<UserListItem>) {
  const response = await apiClient.put(`/users/${id}`, data);
  return response.data;
}

export async function deleteUser(id: string) {
  await apiClient.delete(`/users/${id}`);
}
