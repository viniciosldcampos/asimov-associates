import apiClient from "../lib/axios";

export type PermissionLevel = "FULL" | "EDIT" | "READ" | "NONE";

export const APP_MODULES = [
  "DASHBOARD",
  "PROCESSOS",
  "ADVOGADOS",
  "CLIENTES",
  "AGENDA",
  "PRAZOS",
  "RELATORIOS",
  "CONFIGURACOES",
  "USUARIOS",
  "PERMISSOES",
  "CATEGORIAS",
  "FINANCEIRO",
] as const;

export type AppModule = (typeof APP_MODULES)[number];

export const MODULE_LABELS: Record<AppModule, string> = {
  DASHBOARD: "Dashboard",
  PROCESSOS: "Processos",
  ADVOGADOS: "Advogados",
  CLIENTES: "Clientes",
  AGENDA: "Agenda",
  PRAZOS: "Prazos",
  RELATORIOS: "Relatórios",
  CONFIGURACOES: "Configurações",
  USUARIOS: "Usuários",
  PERMISSOES: "Permissões",
  CATEGORIAS: "Categorias",
  FINANCEIRO: "Financeiro",
};

export interface UserPermissions {
  userId: string;
  name: string;
  role: string;
  permissions: { module: string; level: PermissionLevel }[];
}

export async function getAllUsersPermissions() {
  const response = await apiClient.get<UserPermissions[]>("/permissions");
  return response.data;
}

export async function getUserPermissions(userId: string) {
  const response = await apiClient.get<UserPermissions>(
    `/permissions/${userId}`,
  );
  return response.data;
}

export async function updateUserPermission(
  userId: string,
  module: AppModule,
  level: PermissionLevel,
) {
  const response = await apiClient.put(`/permissions/${userId}`, {
    module,
    level,
  });
  return response.data;
}

export async function resetUserPermissions(userId: string) {
  const response = await apiClient.delete(`/permissions/${userId}/reset`);
  return response.data;
}
