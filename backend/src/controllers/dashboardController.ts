import { Request, Response } from "express";
import {
  getStats,
  getProcessesByInstance,
  getUpcomingDeadlines,
  getProcessesByMonth,
} from "../services/dashboardService";

export async function stats(req: Request, res: Response) {
  try {
    const data = await getStats();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function processesByInstance(req: Request, res: Response) {
  try {
    const data = await getProcessesByInstance();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function upcomingDeadlines(req: Request, res: Response) {
  try {
    const data = await getUpcomingDeadlines();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function processesByMonth(req: Request, res: Response) {
  try {
    const data = await getProcessesByMonth();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
