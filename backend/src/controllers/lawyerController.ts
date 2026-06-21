import { Request, Response } from "express";
import {
  getAllLawyers,
  getLawyerById,
  updateLawyer,
} from "../services/lawyerService";

export async function getAll(req: Request, res: Response) {
  try {
    const lawyers = await getAllLawyers();
    return res.status(200).json(lawyers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const lawyer = await getLawyerById(id);
    return res.status(200).json(lawyer);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const lawyer = await updateLawyer(id, req.body);
    return res.status(200).json(lawyer);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
