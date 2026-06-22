import { Request, Response } from "express";
import {
  createProcess,
  getAllProcesses,
  getProcessById,
  updateProcess,
  deleteProcess,
} from "../services/processService";

export async function create(req: Request, res: Response) {
  try {
    const process = await createProcess(req.body);
    return res.status(201).json(process);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const processes = await getAllProcesses();
    return res.status(200).json(processes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const process = await getProcessById(id);
    return res.status(200).json(process);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const process = await updateProcess(id, req.body);
    return res.status(200).json(process);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteProcess(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}
