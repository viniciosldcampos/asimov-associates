import apiClient from "../lib/axios";

export interface LawyerListItem {
  id: string;
  name: string;
  oab?: string;
}

export async function getAllLawyers() {
  const response = await apiClient.get<LawyerListItem[]>("/lawyers");
  return response.data;
}
