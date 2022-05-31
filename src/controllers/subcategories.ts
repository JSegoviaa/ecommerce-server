import { Request, Response } from 'express';

export const getSubcategories = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, msg: 'Lista de subcategorías' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const getSubcategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Subcategoría', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const createSubategory = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, msg: 'Subcategoría creada' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const updateSubategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res
      .status(200)
      .json({ ok: true, msg: 'Actualizar subcategoría', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteSubcategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Eliminar subcategoría', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
