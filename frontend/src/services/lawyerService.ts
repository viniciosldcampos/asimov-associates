import apiClient from "../lib/axios";

export interface LawyerListItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  oab?: string;
  oabState?: string;
  specialties: string[];
  experienceYears?: number;
  isActive: boolean;
}

export interface LawyerActivity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  process: { id: string; number: string } | null;
}

export interface LawyerDetail extends LawyerListItem {
  processesAsLawyer: {
    id: string;
    number: string;
    status: string;
  }[];
  activities: LawyerActivity[];
}

export interface CreateLawyerInput {
  name: string;
  email: string;
  password: string;
  oab?: string;
  oabState?: string;
  specialties?: string[];
}

export interface UpdateLawyerInput {
  oab?: string;
  oabState?: string;
  specialties?: string[];
  experienceYears?: number;
  phone?: string;
  isActive?: boolean;
}

export async function updateLawyer(id: string, data: UpdateLawyerInput) {
  const response = await apiClient.put(`/lawyers/${id}`, data);
  return response.data;
}

export async function toggleLawyerActive(id: string, isActive: boolean) {
  const response = await apiClient.put(`/lawyers/${id}`, { isActive });
  return response.data;
}

export async function getAllLawyers() {
  const response = await apiClient.get<LawyerListItem[]>("/lawyers");
  return response.data;
}

export async function getLawyerById(id: string) {
  const response = await apiClient.get<LawyerDetail>(`/lawyers/${id}`);
  return response.data;
}

export async function createLawyer(data: CreateLawyerInput) {
  const registerResponse = await apiClient.post("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
  });

  const newLawyerId = registerResponse.data.id;

  if (data.oab || data.oabState || data.specialties?.length) {
    await apiClient.put(`/lawyers/${newLawyerId}`, {
      oab: data.oab,
      oabState: data.oabState,
      specialties: data.specialties,
    });
  }

  return newLawyerId;
}
