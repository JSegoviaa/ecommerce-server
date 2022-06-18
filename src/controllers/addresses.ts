import { Request, Response } from 'express';
import { db } from '../db';
import moment from 'moment';

export const getAddresses = async (req: Request, res: Response) => {
  const { limit = 20, sort = 'ASC', from = 0, order_by = 'id' } = req.query;

  try {
    const text: string = `SELECT * FROM  addresses ORDER BY ${order_by} ${sort} OFFSET $1 LIMIT $2`;
    const values = [from, limit];

    const count: string = `SELECT COUNT(*) FROM addresses`;

    const [total, addresses] = await Promise.all([
      await db.query(count),
      await db.query(text, values),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'direcciones',
      total: total.rows[0].count,
      addresses: addresses.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const getAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    //TODO Validar que solo los admins y el mismo usuario pueda ver su dirección
    const text: string = `SELECT * FROM addresses WHERE id = $1`;
    const values = [id];

    const { rows } = await db.query(text, values);
    const address = rows[0];

    return res.status(200).json({ ok: true, msg: 'dirección', address });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const createAddress = async (req: Request, res: Response) => {
  const {
    country,
    state,
    municipality,
    city,
    colony,
    postal_code,
    address,
    info,
    user_id,
  } = req.body;

  const date = moment().format();

  try {
    const text: string = `
    INSERT INTO 
        addresses(country, state, municipality, city, colony, postal_code, address, info, user_id, created_at, updated_at) 
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) 
    RETURNING *`;

    const values: string[] = [
      country,
      state,
      municipality,
      city,
      colony,
      postal_code,
      address,
      info,
      user_id,
      date,
      date,
    ];

    const { rows } = await db.query(text, values);

    const newAddress = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'Se ha agregado su dirección correctamente',
      newAddress,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    country,
    state,
    municipality,
    city,
    colony,
    postal_code,
    address,
    info,
  } = req.body;
  const date = moment().format();

  try {
    const text: string = `
    UPDATE 
        addresses 
    SET 
        country = $1, 
        state = $2, 
        municipality = $3, 
        city = $4, 
        colony = $5, 
        postal_code = $6,
        address = $7, 
        info = $8,
        updated_at = $9
    WHERE id = $10 RETURNING *
    `;
    const values = [
      country,
      state,
      municipality,
      city,
      colony,
      postal_code,
      address,
      info,
      date,
      id,
    ];

    const { rows } = await db.query(text, values);

    const updatedAddress = rows[0];

    return res
      .status(200)
      .json({ ok: true, msg: 'actualizar dirección', updatedAddress });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const text: string = `DELETE FROM addresses WHERE id = $1 RETURNING*`;
    const values = [id];

    const { rows } = await db.query(text, values);

    const deletedAddress = rows[0];

    return res
      .status(200)
      .json({ ok: true, msg: 'eliminar dirección', deletedAddress });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
