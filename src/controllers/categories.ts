import { Request, Response } from 'express';

export const getCategories = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, msg: 'Lista de categorías' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Categoría', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, msg: 'Categoría creada' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Actualizar categoría', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Eliminar categoría', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
