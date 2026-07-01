import { prisma } from "../utils/prisma";

const MODULES = [
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

type AppModule = (typeof MODULES)[number];
type PermissionLevel = "FULL" | "EDIT" | "READ" | "NONE";

// Permissões padrão por role
const DEFAULT_PERMISSIONS: Record<
  string,
  Record<AppModule, PermissionLevel>
> = {
  ADMINISTRADOR: {
    DASHBOARD: "FULL",
    PROCESSOS: "FULL",
    ADVOGADOS: "FULL",
    CLIENTES: "FULL",
    AGENDA: "FULL",
    PRAZOS: "FULL",
    RELATORIOS: "FULL",
    CONFIGURACOES: "FULL",
    USUARIOS: "FULL",
    PERMISSOES: "FULL",
    CATEGORIAS: "FULL",
    FINANCEIRO: "FULL",
  },
  ADVOGADO: {
    DASHBOARD: "FULL",
    PROCESSOS: "FULL",
    ADVOGADOS: "READ",
    CLIENTES: "FULL",
    AGENDA: "FULL",
    PRAZOS: "FULL",
    RELATORIOS: "READ",
    CONFIGURACOES: "NONE",
    USUARIOS: "NONE",
    PERMISSOES: "NONE",
    CATEGORIAS: "NONE",
    FINANCEIRO: "NONE",
  },
  ASSISTENTE: {
    DASHBOARD: "FULL",
    PROCESSOS: "EDIT",
    ADVOGADOS: "NONE",
    CLIENTES: "NONE",
    AGENDA: "FULL",
    PRAZOS: "FULL",
    RELATORIOS: "READ",
    CONFIGURACOES: "NONE",
    USUARIOS: "NONE",
    PERMISSOES: "NONE",
    CATEGORIAS: "NONE",
    FINANCEIRO: "NONE",
  },
  ESTAGIARIO: {
    DASHBOARD: "FULL",
    PROCESSOS: "READ",
    ADVOGADOS: "NONE",
    CLIENTES: "NONE",
    AGENDA: "READ",
    PRAZOS: "READ",
    RELATORIOS: "READ",
    CONFIGURACOES: "NONE",
    USUARIOS: "NONE",
    PERMISSOES: "NONE",
    CATEGORIAS: "NONE",
    FINANCEIRO: "NONE",
  },
  FINANCEIRO: {
    DASHBOARD: "FULL",
    PROCESSOS: "READ",
    ADVOGADOS: "NONE",
    CLIENTES: "NONE",
    AGENDA: "NONE",
    PRAZOS: "NONE",
    RELATORIOS: "FULL",
    CONFIGURACOES: "NONE",
    USUARIOS: "NONE",
    PERMISSOES: "NONE",
    CATEGORIAS: "NONE",
    FINANCEIRO: "FULL",
  },
  VISUALIZADOR: {
    DASHBOARD: "READ",
    PROCESSOS: "READ",
    ADVOGADOS: "READ",
    CLIENTES: "READ",
    AGENDA: "READ",
    PRAZOS: "READ",
    RELATORIOS: "READ",
    CONFIGURACOES: "NONE",
    USUARIOS: "NONE",
    PERMISSOES: "NONE",
    CATEGORIAS: "NONE",
    FINANCEIRO: "NONE",
  },
};

export async function getUserPermissions(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { permissions: true },
  });

  if (!user) throw new Error("Usuário não encontrado");

  const defaults =
    DEFAULT_PERMISSIONS[user.role] ?? DEFAULT_PERMISSIONS.VISUALIZADOR;

  // Merge: permissões personalizadas sobrescrevem as padrões do role
  const merged = { ...defaults };
  user.permissions.forEach((p) => {
    merged[p.module as AppModule] = p.level as PermissionLevel;
  });

  return {
    userId,
    role: user.role,
    permissions: Object.entries(merged).map(([module, level]) => ({
      module,
      level,
    })),
  };
}

export async function getAllUsersPermissions() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, role: true, permissions: true },
  });

  return users.map((user) => {
    const defaults =
      DEFAULT_PERMISSIONS[user.role] ?? DEFAULT_PERMISSIONS.VISUALIZADOR;
    const merged = { ...defaults };
    user.permissions.forEach((p) => {
      merged[p.module as AppModule] = p.level as PermissionLevel;
    });

    return {
      userId: user.id,
      name: user.name,
      role: user.role,
      permissions: Object.entries(merged).map(([module, level]) => ({
        module,
        level,
      })),
    };
  });
}

export async function updateUserPermission(
  userId: string,
  module: AppModule,
  level: PermissionLevel,
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Usuário não encontrado");

  return prisma.permission.upsert({
    where: { userId_module: { userId, module } },
    update: { level },
    create: { userId, module, level },
  });
}

export async function resetUserPermissions(userId: string) {
  await prisma.permission.deleteMany({ where: { userId } });
  return { message: "Permissões resetadas para o padrão do perfil" };
}

export { DEFAULT_PERMISSIONS, MODULES };
