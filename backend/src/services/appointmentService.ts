import { prisma } from "../utils/prisma";

interface AppointmentInput {
  title: string;
  type?: "AUDIENCIA" | "REUNIAO" | "PRAZO" | "OUTROS";
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  processId?: string;
  lawyerId: string;
}

export async function createAppointment(data: AppointmentInput) {
  if (data.processId) {
    const process = await prisma.process.findUnique({
      where: { id: data.processId },
    });
    if (!process) {
      throw new Error("Processo não encontrado");
    }
  }

  const lawyer = await prisma.user.findFirst({
    where: { id: data.lawyerId, role: "ADVOGADO" },
  });
  if (!lawyer) {
    throw new Error("Advogado não encontrado");
  }

  return prisma.appointment.create({
    data: {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    },
  });
}

export async function getAllAppointments() {
  return prisma.appointment.findMany({
    include: {
      process: { select: { id: true, number: true } },
      lawyer: { select: { id: true, name: true } },
    },
    orderBy: { startTime: "asc" },
  });
}

export async function getAppointmentById(id: string) {
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: {
      process: { include: { client: { select: { id: true, name: true } } } },
      lawyer: { select: { id: true, name: true } },
    },
  });

  if (!appointment) {
    throw new Error("Compromisso não encontrado");
  }

  return appointment;
}

export async function updateAppointment(
  id: string,
  data: Partial<AppointmentInput>,
) {
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    throw new Error("Compromisso não encontrado");
  }

  return prisma.appointment.update({
    where: { id },
    data: {
      ...data,
      startTime: data.startTime ? new Date(data.startTime) : undefined,
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    },
  });
}

export async function deleteAppointment(id: string) {
  const appointment = await prisma.appointment.findUnique({ where: { id } });
  if (!appointment) {
    throw new Error("Compromisso não encontrado");
  }

  return prisma.appointment.delete({ where: { id } });
}
