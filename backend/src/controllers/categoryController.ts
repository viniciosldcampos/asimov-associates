import { Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

export async function create(req: Request, res: Response) {
  try {
    const category = await createCategory(req.body);
    return res.status(201).json(category);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    const categories = await getAllCategories();
    return res.status(200).json(categories);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const category = await getCategoryById(id);
    return res.status(200).json(category);
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const category = await updateCategory(id, req.body);
    return res.status(200).json(category);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteCategory(id);
    return res.status(204).send();
  } catch (error: any) {
    return res.status(404).json({ error: error.message });
  }
}
