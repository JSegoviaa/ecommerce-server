import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';

export const getAvgRateByProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string =
      'SELECT AVG (rating) FROM ratings WHERE product_id = $1';
    const values = [id];

    const { rows } = await db.query(text, values);

    const { avg } = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'Calificación de productos.',
      productRate: !avg ? 0 : Number(avg),
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener calificación de producto.',
    });
  }
};

export const rateProduct = async (req: Request, res: Response) => {
  const { rating, user_id, product_id } = req.body;
  const date = moment().format();

  try {
    const textFav: string =
      'SELECT * FROM ratings WHERE user_id = $1 AND product_id = $2';
    const valuesFav = [user_id, product_id];

    const ratingExist = await db.query(textFav, valuesFav);

    if (ratingExist.rows.length > 0) {
      return res
        .status(400)
        .json({ ok: false, msg: 'Ya has calificado este producto.' });
    }

    const text: string =
      'INSERT INTO ratings(rating, user_id, product_id, created_at) VALUES($1,$2,$3,$4) RETURNING*';
    const values = [rating, user_id, product_id, date];

    const { rows } = await db.query(text, values);

    const ratingAdded = rows[0];

    return res
      .status(201)
      .json({ ok: true, msg: 'Se ha agregado su calificación.', ratingAdded });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de calificar producto.',
      error,
    });
  }
};
