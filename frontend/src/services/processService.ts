import apiClient from "../lib/axios";

export interface ProcessListItem {
  id: string;
  number: string;
  status: string;
  instance: string;
  phase: string;
  updatedAt: string;
  client: { id: string; name: string };
  lawyer: { id: string; name: string };
}

export async function getRecentProcesses() {
  const response = await apiClient.get<ProcessListItem[]>("/processes");
  return response.data.slice(0, 5);
}
