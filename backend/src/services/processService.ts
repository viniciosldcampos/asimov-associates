import { prisma } from "../utils/prisma";

interface ProcessInput {
  number: string;
  description?: string;
  status?:
    | "EM_ANDAMENTO"
    | "CONCLUIDO"
    | "VENCIDO"
    | "AGUARDANDO"
    | "PENDENTE"
    | "ARQUIVADO";
  instance:
    | "PRIMEIRA_INSTANCIA"
    | "SEGUNDA_INSTANCIA"
    | "TRABALHISTA"
    | "SUPERIOR_TRIBUNAL"
    | "OUTROS";
  phase: string;
  vara?: string;
  startDate: string;
  endDate?: string;
  isFinished?: boolean;
  isExpired?: boolean;
  clientId: string;
  lawyerId: string;
  categoryId?: string;
}

const STATUS_LABELS: Record<string, string> = {
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído",
  VENCIDO: "Vencido",
  AGUARDANDO: "Aguardando",
  PENDENTE: "Pendente",
  ARQUIVADO: "Arquivado",
};

export async function createProcess(data: ProcessInput) {
  const client = await prisma.client.findUnique({
    where: { id: data.clientId },
  });
  if (!client) {
    throw new Error("Cliente não encontrado");
  }

  const lawyer = await prisma.user.findFirst({
    where: { id: data.lawyerId, role: "ADVOGADO" },
  });
  if (!lawyer) {
    throw new Error("Advogado não encontrado");
  }

  const process = await prisma.process.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });

  await prisma.activity.create({
    data: {
      type: "PROCESSO_CRIADO",
      description: `Processo nº ${process.number} foi cadastrado`,
      processId: process.id,
      userId: data.lawyerId,
    },
  });

  return process;
}

export async function getAllProcesses() {
  return prisma.process.findMany({
    include: {
      client: { select: { id: true, name: true } },
      lawyer: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProcessById(id: string) {
  const process = await prisma.process.findUnique({
    where: { id },
    include: {
      client: true,
      lawyer: { select: { id: true, name: true, email: true, oab: true } },
      category: true,
      deadlines: true,
      appointments: true,
    },
  });

  if (!process) {
    throw new Error("Processo não encontrado");
  }

  return process;
}

export async function updateProcess(id: string, data: Partial<ProcessInput>) {
  const process = await prisma.process.findUnique({ where: { id } });
  if (!process) {
    throw new Error("Processo não encontrado");
  }

  const updated = await prisma.process.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    },
  });

  if (data.status && data.status !== process.status) {
    await prisma.activity.create({
      data: {
        type: "STATUS_ALTERADO",
        description: `Status do processo nº ${process.number} alterado para "${STATUS_LABELS[data.status] ?? data.status}"`,
        processId: process.id,
        userId: process.lawyerId,
      },
    });
  } else {
    await prisma.activity.create({
      data: {
        type: "PROCESSO_ATUALIZADO",
        description: `Processo nº ${process.number} foi atualizado`,
        processId: process.id,
        userId: process.lawyerId,
      },
    });
  }

  return updated;
}

export async function deleteProcess(id: string) {
  const process = await prisma.process.findUnique({ where: { id } });
  if (!process) {
    throw new Error("Processo não encontrado");
  }

  return prisma.process.delete({ where: { id } });
}
