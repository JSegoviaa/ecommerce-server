import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';

export const getAllDiscountCodes = async (req: Request, res: Response) => {
  const {
    limit = 20,
    sort = 'ASC',
    from = 0,
    is_active = true,
    order_by = 'id',
  } = req.query;

  try {
    const text: string = `SELECT * FROM codes WHERE is_active = $1 ORDER BY ${order_by} ${sort} OFFSET $2 LIMIT $3`;
    const values = [is_active, from, limit];

    const count: string = `SELECT COUNT(*) FROM codes WHERE is_active = $1`;
    const countValues = [is_active];

    const [codes, total] = await Promise.all([
      await db.query(text, values),
      await db.query(count, countValues),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'Lista de códigos de descuento',
      total: total.rows[0].count,
      codes: codes.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al otener la lista de códigos de descuento',
    });
  }
};

export const getDiscountCode = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = 'SELECT * FROM codes WHERE id = $1';
    const values = [id];

    const { rows } = await db.query(text, values);
    const discountCode = rows[0];

    return res
      .status(200)
      .json({ ok: true, msg: 'Código de descuento', discountCode });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de traer un código de descuento',
    });
  }
};

export const createDiscountCode = async (req: Request, res: Response) => {
  const { name, description, discount, created_by, updated_by } = req.body;
  const date = moment().format();
  //TODO Recibor el expires_at dese el front
  const expires_at = moment().add(20, 'days').startOf('day').format();

  try {
    const text: string = `
        INSERT INTO codes(name, description, discount, created_by, updated_by, created_at, updated_at, expires_at) 
                    VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `;
    const values = [
      name,
      description,
      discount,
      created_by,
      updated_by,
      date,
      date,
      expires_at,
    ];

    const { rows } = await db.query(text, values);

    const newCode = rows[0];

    return res.status(201).json({
      ok: true,
      msg: 'Código de descuento creado exitosamente',
      newCode,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear código de descuento',
      error,
    });
  }
};

export const updateDiscountCode = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    description,
    discount,
    updated_by,
    is_active = true,
  } = req.body;

  const date = moment().format();
  //TODO Recibor el expires_at dese el front
  const expires_at = moment().add(20, 'days').startOf('day').format();
  try {
    const text: string =
      'UPDATE codes SET name = $1, description = $2, discount = $3, updated_by = $4, updated_at = $5, expires_at = $6, is_active = $7 WHERE id = $8 RETURNING*';

    const values = [
      name,
      description,
      discount,
      updated_by,
      date,
      expires_at,
      is_active,
      id,
    ];

    const { rows } = await db.query(text, values);

    const updatedCode = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'Código de descuento actualizado correctamente',
      updatedCode,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de actualizar código de descuento',
    });
  }
};

export const deleteDiscountCode = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = 'DELETE FROM codes WHERE id = $1 RETURNING*';
    const values: string[] = [id];

    const { rows } = await db.query(text, values);

    const deletedCode = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'El código de descuento de ha eliminado correctamente',
      deletedCode,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de eliminar código de descuento',
    });
  }
};
