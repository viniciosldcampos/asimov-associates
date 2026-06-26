import apiClient from "../lib/axios";

export interface ClientListItem {
  id: string;
  name: string;
  type: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  company?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ClientDetail extends ClientListItem {
  rg?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  processes: {
    id: string;
    number: string;
    status: string;
    description?: string;
  }[];
}

export interface CreateClientInput {
  name: string;
  type: "PESSOA_FISICA" | "PESSOA_JURIDICA";
  company?: string;
  cpf?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
}

export interface UpdateClientInput {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive?: boolean;
}

export async function getAllClients() {
  const response = await apiClient.get<ClientListItem[]>("/clients");
  return response.data;
}

export async function getClientById(id: string) {
  const response = await apiClient.get<ClientDetail>(`/clients/${id}`);
  return response.data;
}

export async function createClient(data: CreateClientInput) {
  const response = await apiClient.post("/clients", data);
  return response.data;
}

export async function updateClient(id: string, data: UpdateClientInput) {
  const response = await apiClient.put(`/clients/${id}`, data);
  return response.data;
}

export async function deleteClient(id: string) {
  await apiClient.delete(`/clients/${id}`);
}
