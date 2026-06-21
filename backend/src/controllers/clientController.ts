import { Request, Response } from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "../services/clientService";

export async function create(req: Request, res: Response) {
  try {
    const client = await createClient(req.body);
    return res.status(201).json(client);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const clients = await getAllClients();
    return res.status(200).json(clients);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const client = await getClientById(id);
    return res.status(200).json(client);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const client = await updateClient(id, req.body);
    return res.status(200).json(client);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteClient(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}
