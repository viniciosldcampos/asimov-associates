import { Request, Response } from "express";
import {
  getAllUsersPermissions,
  getUserPermissions,
  updateUserPermission,
  resetUserPermissions,
} from "../services/permissionService";

export async function getAll(req: Request, res: Response) {
  try {
    const data = await getAllUsersPermissions();
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const data = await getUserPermissions(req.params.userId as string);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { module, level } = req.body;
    const data = await updateUserPermission(userId as string, module, level);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function reset(req: Request, res: Response) {
  try {
    const data = await resetUserPermissions(req.params.userId as string);
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}
