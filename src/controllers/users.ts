import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import moment from 'moment';
import { db } from '../db';
import { generateJWT } from '../helpers';

export const getUsers = async (req: Request, res: Response) => {
  const { limit = 20, sort = 'ASC', from = 0 } = req.query;

  try {
    const text = `SELECT * FROM  users ORDER BY id ${sort} OFFSET ${from} LIMIT ${limit}`;
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
    const text = `SELECT first_name, last_name, email, created_at, updated_at, is_active FROM users WHERE id = ${id} LIMIT 1`;

    const { rows } = await db.query(text);

    return res
      .status(200)
      .json({ ok: true, msg: 'Obtener usuario', usuario: rows[0] });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'error', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password } = req.body;
  const date = moment().format('MMMM Do YYYY, h:mm:ss a');

  try {
    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    //Guardar usuario en la base de datos
    const text: string =
      'INSERT INTO users(first_name, last_name, email, password, created_at, updated_at) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
    const values: string[] = [first_name, last_name, email, hash, date, date];

    const { rows } = await db.query(text, values);
    //Generar JWT
    const token = await generateJWT(rows[0].id);

    return res.status(201).json({
      ok: true,
      msg: 'Registro exitoso',
      token,
      newUser: rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, password, ...rest } = req.body;
  const { first_name, last_name } = rest;
  const date = moment().format('MMMM Do YYYY, h:mm:ss a');

  try {
    const text: string = `UPDATE users SET first_name = '${first_name}', last_name = '${last_name}', updated_at = '${date}' WHERE id = ${id} RETURNING*`;

    const { rows } = await db.query(text);

    return res
      .status(200)
      .json({ ok: true, msg: 'Actualizar usuarios', updatedUser: rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const date = moment().format('MMMM Do YYYY, h:mm:ss a');

  try {
    const text: string = `UPDATE users SET is_active='${false}', updated_at = '${date}' WHERE id = ${id} RETURNING*`;

    const { rows } = await db.query(text);

    return res
      .status(200)
      .json({ ok: true, msg: 'Usuario dado de baja', deletedUser: rows[0] });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
