import { Request, Response } from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../services/appointmentService";

export async function create(req: Request, res: Response) {
  try {
    const appointment = await createAppointment(req.body);
    return res.status(201).json(appointment);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const appointments = await getAllAppointments();
    return res.status(200).json(appointments);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const appointment = await getAppointmentById(id);
    return res.status(200).json(appointment);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const appointment = await updateAppointment(id, req.body);
    return res.status(200).json(appointment);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteAppointment(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}
