import { Request, Response } from 'express';
import { db } from '../db';
import moment from 'moment';

export const getAddresses = async (req: Request, res: Response) => {
  const { limit = 20, sort = 'ASC', from = 0 } = req.query;

  try {
    const text: string = `SELECT * FROM  addresses ORDER BY id ${sort} OFFSET ${from}  LIMIT ${limit} `;
    const count: string = `SELECT COUNT(*) FROM  addresses`;

    const [total, addresses] = await Promise.all([
      await db.query(count),
      await db.query(text),
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
    const text: string = `SELECT * FROM addresses WHERE id = '${id}'`;

    const { rows } = await db.query(text);
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
        country = '${country}', 
        state = '${state}', 
        municipality = '${municipality}', 
        city = '${city}', 
        colony = '${colony}', 
        postal_code = '${postal_code}',
        address = '${address}', 
        info = '${info}',
        updated_at = '${date}'
    WHERE id = '${id}' RETURNING *
    `;

    const { rows } = await db.query(text);

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
    const text: string = `DELETE FROM addresses WHERE id = '${id}' RETURNING*`;

    const { rows } = await db.query(text);

    const deletedAddress = rows[0];

    return res
      .status(200)
      .json({ ok: true, msg: 'eliminar dirección', deletedAddress });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
