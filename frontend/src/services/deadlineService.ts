import apiClient from "../lib/axios";

export interface DeadlineListItem {
  id: string;
  title: string;
  type: "PROCESSUAL" | "AUDIENCIA" | "OUTROS";
  status: "PENDENTE" | "VENCE_HOJE" | "VENCIDO" | "CONCLUIDO";
  date: string;
  processId: string;
  lawyerId: string;
  process: { id: string; number: string; instance: string } | null;
  lawyer: { id: string; name: string; oab?: string };
}

export interface CreateDeadlineInput {
  title: string;
  type: "PROCESSUAL" | "AUDIENCIA" | "OUTROS";
  date: string;
  description?: string;
  processId: string;
  lawyerId: string;
}

export interface UpdateDeadlineInput {
  title?: string;
  type?: "PROCESSUAL" | "AUDIENCIA" | "OUTROS";
  status?: "PENDENTE" | "VENCE_HOJE" | "VENCIDO" | "CONCLUIDO";
  date?: string;
}

export async function getAllDeadlines() {
  const response = await apiClient.get<DeadlineListItem[]>("/deadlines");
  return response.data;
}

export async function createDeadline(data: CreateDeadlineInput) {
  const response = await apiClient.post("/deadlines", data);
  return response.data;
}

export async function updateDeadline(id: string, data: UpdateDeadlineInput) {
  const response = await apiClient.put(`/deadlines/${id}`, data);
  return response.data;
}

export async function deleteDeadline(id: string) {
  await apiClient.delete(`/deadlines/${id}`);
}
