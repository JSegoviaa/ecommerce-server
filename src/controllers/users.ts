import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import moment from 'moment';
import { db } from '../db';
import { generateJWT } from '../helpers';

export const getUsers = async (req: Request, res: Response) => {
  const {
    limit = 20,
    sort = 'ASC',
    from = 0,
    is_active = true,
    order_by = 'id',
  } = req.query;
  try {
    const text: string = `
    SELECT users.id, first_name, last_name, email, created_at, updated_at, is_active, role_id, roles.role FROM users
    INNER JOIN roles ON users.role_id = roles.id
    WHERE is_active = $1 ORDER BY ${order_by} ${sort} OFFSET $2 LIMIT $3
    `;

    const values = [is_active, from, limit];
    const count: string = `SELECT COUNT(*) FROM  users WHERE is_active = $1`;
    const countValues = [is_active];

    const [users, total] = await Promise.all([
      await db.query(text, values),
      await db.query(count, countValues),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'Obtener usuarios',
      total: total.rows[0].count,
      users: users.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'error', error });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = `
    SELECT
      users.id,
      first_name, 
      last_name, 
      email, 
      created_at, 
      updated_at, 
      is_active, 
      roles.id role_id,
      roles.role 
    FROM 
      users 
    INNER JOIN roles ON users.role_id = roles.id 
    WHERE users.id = $1 LIMIT 1
    `;
    const values = [id];
    const { rows } = await db.query(text, values);

    return res
      .status(200)
      .json({ ok: true, msg: 'Obtener usuario', user: rows[0] });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'error', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, role_id, confirmPassword } =
    req.body;
  const date = moment().format();

  try {
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ ok: false, msg: 'Las contraseñas no coinciden' });
    }

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);

    //Guardar usuario en la base de datos
    const text: string =
      'INSERT INTO users(first_name, last_name, email, password, created_at, updated_at, role_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *';
    const values: string[] = [
      first_name,
      last_name,
      email,
      hash,
      date,
      date,
      role_id,
    ];

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
  const date = moment().format();

  try {
    const text: string = `UPDATE users SET first_name = $1, last_name = $2, updated_at = $3 WHERE id = $4 RETURNING*`;
    const values = [first_name, last_name, date, id];
    const { rows } = await db.query(text, values);

    return res
      .status(200)
      .json({ ok: true, msg: 'Actualizar usuarios', updatedUser: rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deactivateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_active = false } = req.body;
  const date = moment().format();

  try {
    const text: string = `UPDATE users SET is_active = $1, updated_at = $2 WHERE id = $3 RETURNING*`;
    const values = [is_active, date, id];

    const { rows } = await db.query(text, values);

    return res.status(200).json({
      ok: true,
      msg: 'Usuario dado de baja',
      deactivatedUser: rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const updateUsersRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    const text: string = `UPDATE users SET role_id = $1 WHERE id = $2 RETURNING *`;
    const values = [role, id];

    const { rows } = await db.query(text, values);

    return res.status(200).json({
      ok: true,
      msg: 'Rol de usuario actualizado',
      updatedUser: rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = `DELETE FROM users WHERE id = $1 RETURNING*`;
    const values = [id];

    const { rows } = await db.query(text, values);

    return res.status(200).json({
      ok: true,
      msg: 'Usuario dado de eliminado',
      deletedUser: rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
