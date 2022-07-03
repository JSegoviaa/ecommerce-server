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

export const getUsersRates = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = 20, sort = 'ASC', from = 0, order_by = 'id' } = req.query;

  try {
    const text: string = `
    SELECT 
      r.id,
      r.rating,
      r.created_at,
      p.title,
      p.slug,
      i.url
    FROM 
      ratings r 
    INNER JOIN products p ON r.product_id = p.id
    INNER JOIN images i ON p.image_id = i.id  
    WHERE user_id = $1 ORDER BY ${order_by} ${sort} OFFSET $2 LIMIT $3
    `;
    const values = [id, from, limit];

    const { rows } = await db.query(text, values);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, msg: 'No has calificado ningún producto.' });
    }

    return res.status(200).json({
      ok: true,
      msg: 'Se ha obtenido tu lista de calificaciones a los productos.',
      usersRating: rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener calificaciones del usuario.',
    });
  }
};

export const getAllAvgRatings = async (req: Request, res: Response) => {
  const { limit = 20, sort = 'ASC', from = 0, order_by = 'id' } = req.query;

  try {
    const text: string = `
    SELECT 
      r.product_id id, 
      p.title, 
      p.slug, 
      AVG(rating) 
    FROM ratings r
    INNER JOIN products p ON r.product_id = p.id 
    GROUP BY r.product_id, p.title, p.slug
    ORDER BY ${order_by} ${sort} OFFSET $1 LIMIT $2
    `;
    const values = [from, limit];

    const { rows } = await db.query(text, values);

    return res
      .status(200)
      .json({
        ok: true,
        msg: 'Lista de calificaciones.',
        productsRateAvg: rows,
      });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener las calificaciones de los productos.',
      error,
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
