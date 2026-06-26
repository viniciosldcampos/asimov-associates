import apiClient from "../lib/axios";

export interface AppointmentListItem {
  id: string;
  title: string;
  type: "AUDIENCIA" | "REUNIAO" | "PRAZO" | "OUTROS";
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
  processId?: string;
  lawyerId: string;
  process: { id: string; number: string } | null;
  lawyer: { id: string; name: string };
}

export interface CreateAppointmentInput {
  title: string;
  type: "AUDIENCIA" | "REUNIAO" | "PRAZO" | "OUTROS";
  startTime: string;
  endTime: string;
  location?: string;
  processId?: string;
  lawyerId: string;
}

export async function getAllAppointments() {
  const response = await apiClient.get<AppointmentListItem[]>("/appointments");
  return response.data;
}

export async function createAppointment(data: CreateAppointmentInput) {
  const response = await apiClient.post("/appointments", data);
  return response.data;
}

export async function deleteAppointment(id: string) {
  await apiClient.delete(`/appointments/${id}`);
}
