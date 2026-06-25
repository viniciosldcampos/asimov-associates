import apiClient from "../lib/axios";

export interface CreateProcessInput {
  number: string;
  description?: string;
  instance: string;
  phase: string;
  vara?: string;
  startDate: string;
  endDate?: string;
  isFinished?: boolean;
  isExpired?: boolean;
  clientId: string;
  lawyerId: string;
}

export async function createProcess(data: CreateProcessInput) {
  const response = await apiClient.post("/processes", data);
  return response.data;
}
