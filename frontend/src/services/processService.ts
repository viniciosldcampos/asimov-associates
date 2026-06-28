import apiClient from "../lib/axios";

export interface ProcessListItem {
  id: string;
  number: string;
  status: string;
  instance: string;
  phase: string;
  startDate: string;
  updatedAt: string;
  client: { id: string; name: string };
  lawyer: { id: string; name: string };
  category: { id: string; name: string } | null;
}

export async function getAllProcesses() {
  const response = await apiClient.get<ProcessListItem[]>("/processes");
  return response.data;
}

export async function getRecentProcesses() {
  const all = await getAllProcesses();
  return all.slice(0, 5);
}

export async function updateProcessStatus(id: string, status: string) {
  const response = await apiClient.put(`/processes/${id}`, { status });
  return response.data;
}

export async function deleteProcess(id: string) {
  await apiClient.delete(`/processes/${id}`);
}
