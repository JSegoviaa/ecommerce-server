import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';

export const getFavoritesByUser = async (req: Request, res: Response) => {
  const { limit = 20, sort = 'ASC', from = 0, order_by = 'id' } = req.query;
  const { id } = req.params;

  try {
    const text: string = `
    SELECT 
      f.id, 
      p.title, 
      p.slug,
      f.created_at 
    FROM 
      favorites f 
    INNER JOIN products p ON f.product_id = p.id 
    WHERE user_id = $1 
    ORDER BY ${order_by} ${sort} OFFSET $2 LIMIT $3`;

    const values = [id, from, limit];

    const { rows } = await db.query(text, values);

    const usersFavorites = rows;

    return res.status(201).json({
      ok: true,
      msg: 'Se ha obtenido tu lista de favoritos.',
      usersFavorites,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de agregar eliminar favorito. Inténtlo más tarde.',
      error,
    });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  const { user_id, product_id } = req.body;
  const date = moment().format();

  try {
    const textFav: string =
      'SELECT * FROM favorites WHERE user_id = $1 AND product_id = $2';
    const valuesFav = [user_id, product_id];

    const favoriteExist = await db.query(textFav, valuesFav);

    if (favoriteExist.rows.length > 0) {
      return res
        .status(400)
        .json({ ok: false, msg: 'Ya has agregado este producto a favoritos.' });
    }

    const text: string =
      'INSERT INTO favorites(user_id, product_id, created_at) VALUES($1,$2,$3) RETURNING*';
    const values = [user_id, product_id, date];

    const { rows } = await db.query(text, values);

    const favorites = rows[0];

    return res.status(201).json({
      ok: true,
      msg: 'Se ha agregado a tu lista de favoritos',
      favorites,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de agregar a favoritos.',
      error,
    });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const text: string = 'DELETE FROM favorites WHERE id = $1 RETURNING*';
    const values: string[] = [id];

    const { rows } = await db.query(text, values);

    const deletedFavorite = rows[0];

    return res.status(201).json({
      ok: true,
      msg: 'El producto se ha eliminado de tu lista de favoritos.',
      deletedFavorite,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de agregar eliminar favorito.',
      error,
    });
  }
};
