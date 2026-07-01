import apiClient from "../lib/axios";

export interface CategoryItem {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
}

export async function getAllCategories() {
  const response = await apiClient.get<CategoryItem[]>("/categories");
  return response.data;
}
