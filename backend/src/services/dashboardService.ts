import { prisma } from "../utils/prisma";

export async function getStats() {
  const totalProcesses = await prisma.process.count();

  const inProgress = await prisma.process.count({
    where: { status: "EM_ANDAMENTO" },
  });

  // "Prazos hoje" = prazos com data entre o início e o fim do dia atual
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const deadlinesToday = await prisma.deadline.count({
    where: {
      date: { gte: startOfDay, lte: endOfDay },
    },
  });

  const completedProcesses = await prisma.process.count({
    where: { status: "CONCLUIDO" },
  });

  // Taxa de sucesso: processos concluídos / total de processos finalizados (concluídos + vencidos)
  const expiredProcesses = await prisma.process.count({
    where: { status: "VENCIDO" },
  });

  const finishedTotal = completedProcesses + expiredProcesses;
  const successRate =
    finishedTotal > 0
      ? Math.round((completedProcesses / finishedTotal) * 100)
      : 0;

  return {
    totalProcesses,
    inProgress,
    deadlinesToday,
    successRate,
  };
}

export async function getProcessesByInstance() {
  const result = await prisma.process.groupBy({
    by: ["instance"],
    _count: { instance: true },
  });

  return result.map((item) => ({
    instance: item.instance,
    count: item._count.instance,
  }));
}

export async function getUpcomingDeadlines(limit = 5) {
  const now = new Date();

  return prisma.deadline.findMany({
    where: {
      date: { gte: now },
      status: { not: "CONCLUIDO" },
    },
    include: {
      process: { select: { id: true, number: true } },
      lawyer: { select: { id: true, name: true } },
    },
    orderBy: { date: "asc" },
    take: limit,
  });
}

export async function getProcessesByMonth() {
  const processes = await prisma.process.findMany({
    select: { startDate: true },
  });

  // Agrupa manualmente por mês (0 = Janeiro, 11 = Dezembro)
  const counts = new Array(12).fill(0);
  processes.forEach((process) => {
    const month = process.startDate.getMonth();
    counts[month]++;
  });

  return counts;
}
