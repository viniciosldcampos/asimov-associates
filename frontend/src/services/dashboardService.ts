import apiClient from "../lib/axios";

export interface DashboardStats {
  totalProcesses: number;
  inProgress: number;
  deadlinesToday: number;
  successRate: number;
}

export interface ProcessByInstance {
  instance: string;
  count: number;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  date: string;
  process: { id: string; number: string } | null;
  lawyer: { id: string; name: string };
}

export async function getDashboardStats() {
  const response = await apiClient.get<DashboardStats>("/dashboard/stats");
  return response.data;
}

export async function getProcessesByInstance() {
  const response = await apiClient.get<ProcessByInstance[]>(
    "/dashboard/processes-by-instance",
  );
  return response.data;
}

export async function getUpcomingDeadlines() {
  const response = await apiClient.get<UpcomingDeadline[]>(
    "/dashboard/upcoming-deadlines",
  );
  return response.data;
}

export async function getProcessesByMonth() {
  const response = await apiClient.get<number[]>(
    "/dashboard/processes-by-month",
  );
  return response.data;
}
