import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { db } from '../db';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const text = 'SELECT * FROM  users';
    const { rows } = await db.query(text);

    return res.status(200).json({
      ok: true,
      msg: 'Obtener usuarios',
      users: rows,
    });
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
  const { first_name, last_name, email, password } = req.body;

  try {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    const text: string =
      'INSERT INTO users(first_name, last_name, email, password) VALUES($1,$2,$3,$4) RETURNING *';
    const values: string[] = [first_name, last_name, email, hash];

    const { rows } = await db.query(text, values);

    return res
      .status(201)
      .json({ ok: true, msg: 'Registro exitoso', newUser: rows[0] });
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
