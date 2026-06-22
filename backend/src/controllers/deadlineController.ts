import { Request, Response } from "express";
import {
  createDeadline,
  getAllDeadlines,
  getDeadlineById,
  updateDeadline,
  deleteDeadline,
} from "../services/deadlineService";

export async function create(req: Request, res: Response) {
  try {
    const deadline = await createDeadline(req.body);
    return res.status(201).json(deadline);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const deadlines = await getAllDeadlines();
    return res.status(200).json(deadlines);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const deadline = await getDeadlineById(id);
    return res.status(200).json(deadline);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const deadline = await updateDeadline(id, req.body);
    return res.status(200).json(deadline);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteDeadline(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}
