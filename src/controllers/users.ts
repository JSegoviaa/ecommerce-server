import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, msg: 'Obtener usuarios' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'error', error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Obtener usuario', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'error', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, msg: 'Crear usuarios' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Actualizar usuarios', id });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    return res.status(200).json({ ok: true, msg: 'Eliminar usuarios', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
