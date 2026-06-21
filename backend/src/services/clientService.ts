import { prisma } from "../utils/prisma";

interface ClientInput {
  name: string;
  type?: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  company?: string;
  cpf?: string;
  cnpj?: string;
  rg?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export async function createClient(data: ClientInput) {
  return prisma.client.create({
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
  });
}

export async function getAllClients() {
  return prisma.client.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getClientById(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: { processes: true },
  });

  if (!client) {
    throw new Error("Cliente não encontrado");
  }

  return client;
}

export async function updateClient(id: string, data: Partial<ClientInput>) {
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    throw new Error("Cliente não encontrado");
  }

  return prisma.client.update({
    where: { id },
    data: {
      ...data,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
    },
  });
}

export async function deleteClient(id: string) {
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) {
    throw new Error("Cliente não encontrado");
  }

  return prisma.client.delete({ where: { id } });
}
