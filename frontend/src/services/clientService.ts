import apiClient from "../lib/axios";

export interface ClientListItem {
  id: string;
  name: string;
  cpf?: string;
  cnpj?: string;
}

export async function getAllClients() {
  const response = await apiClient.get<ClientListItem[]>("/clients");
  return response.data;
}
