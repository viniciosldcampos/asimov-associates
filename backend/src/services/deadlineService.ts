import { prisma } from "../utils/prisma";

interface DeadlineInput {
  title: string;
  type?: "PROCESSUAL" | "AUDIENCIA" | "OUTROS";
  status?: "PENDENTE" | "VENCE_HOJE" | "VENCIDO" | "CONCLUIDO";
  date: string;
  description?: string;
  processId: string;
  lawyerId: string;
}

export async function createDeadline(data: DeadlineInput) {
  const process = await prisma.process.findUnique({
    where: { id: data.processId },
  });
  if (!process) {
    throw new Error("Processo não encontrado");
  }

  const lawyer = await prisma.user.findFirst({
    where: { id: data.lawyerId, role: "ADVOGADO" },
  });
  if (!lawyer) {
    throw new Error("Advogado não encontrado");
  }

  return prisma.deadline.create({
    data: {
      ...data,
      date: new Date(data.date),
    },
  });
}

export async function getAllDeadlines() {
  return prisma.deadline.findMany({
    include: {
      process: { select: { id: true, number: true, instance: true } },
      lawyer: { select: { id: true, name: true } },
    },
    orderBy: { date: "asc" },
  });
}

export async function getDeadlineById(id: string) {
  const deadline = await prisma.deadline.findUnique({
    where: { id },
    include: {
      process: { include: { client: { select: { id: true, name: true } } } },
      lawyer: { select: { id: true, name: true, oab: true } },
    },
  });

  if (!deadline) {
    throw new Error("Prazo não encontrado");
  }

  return deadline;
}

export async function updateDeadline(id: string, data: Partial<DeadlineInput>) {
  const deadline = await prisma.deadline.findUnique({ where: { id } });
  if (!deadline) {
    throw new Error("Prazo não encontrado");
  }

  return prisma.deadline.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
}

export async function deleteDeadline(id: string) {
  const deadline = await prisma.deadline.findUnique({ where: { id } });
  if (!deadline) {
    throw new Error("Prazo não encontrado");
  }

  return prisma.deadline.delete({ where: { id } });
}
