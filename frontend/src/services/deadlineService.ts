import apiClient from "../lib/axios";

export interface DeadlineListItem {
  id: string;
  title: string;
  type: "PROCESSUAL" | "AUDIENCIA" | "OUTROS";
  status: "PENDENTE" | "VENCE_HOJE" | "VENCIDO" | "CONCLUIDO";
  date: string;
  processId: string;
  lawyerId: string;
  process: { id: string; number: string } | null;
  lawyer: { id: string; name: string };
}

export async function getAllDeadlines() {
  const response = await apiClient.get<DeadlineListItem[]>("/deadlines");
  return response.data;
}
