import { prisma } from "../utils/prisma";

interface LawyerUpdateInput {
  oab?: string;
  oabState?: string;
  specialties?: string[];
  experienceYears?: number;
  phone?: string;
}

export async function getAllLawyers() {
  return prisma.user.findMany({
    where: { role: "ADVOGADO" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      oab: true,
      oabState: true,
      specialties: true,
      experienceYears: true,
      isActive: true,
      createdAt: true,
      // Nunca selecionamos a senha
    },
    orderBy: { name: "asc" },
  });
}

export async function getLawyerById(id: string) {
  const lawyer = await prisma.user.findFirst({
    where: { id, role: "ADVOGADO" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      oab: true,
      oabState: true,
      specialties: true,
      experienceYears: true,
      isActive: true,
      createdAt: true,
      processesAsLawyer: true,
    },
  });

  if (!lawyer) {
    throw new Error("Advogado não encontrado");
  }

  return lawyer;
}

export async function updateLawyer(id: string, data: LawyerUpdateInput) {
  const lawyer = await prisma.user.findFirst({
    where: { id, role: "ADVOGADO" },
  });
  if (!lawyer) {
    throw new Error("Advogado não encontrado");
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
  });

  const { password: _, ...lawyerWithoutPassword } = updated;
  return lawyerWithoutPassword;
}
