import { prisma } from "../utils/prisma";

interface CategoryInput {
  name: string;
  type: "AREA_DO_DIREITO" | "TIPO_DE_PROCESSO" | "FASE" | "VARA";
  description?: string;
  color?: string;
  isActive?: boolean;
}

export async function createCategory(data: CategoryInput) {
  return prisma.category.create({ data });
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { processes: { select: { id: true, number: true } } },
  });

  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  return category;
}

export async function updateCategory(id: string, data: Partial<CategoryInput>) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  return prisma.category.delete({ where: { id } });
}
