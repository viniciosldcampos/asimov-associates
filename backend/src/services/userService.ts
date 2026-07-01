import { prisma } from "../utils/prisma";
import type { Role } from "@prisma/client";

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      position: true,
      team: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      position: true,
      team: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new Error("Usuário não encontrado");
  return user;
}

interface UserUpdateInput {
  name?: string;
  role?: Role;
  phone?: string;
  position?: string;
  team?: string;
  isActive?: boolean;
}

export async function updateUser(id: string, data: UserUpdateInput) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("Usuário não encontrado");

  const updated = await prisma.user.update({ where: { id }, data });
  const { password: _, ...userWithoutPassword } = updated;
  return userWithoutPassword;
}

export async function deleteUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("Usuário não encontrado");
  return prisma.user.delete({ where: { id } });
}
