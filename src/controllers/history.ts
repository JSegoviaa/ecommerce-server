import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';

export const getHistoryByUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = 20, sort = 'ASC', from = 0 } = req.query;

  try {
    const text: string = `
    SELECT 
      history.id, 
      p.title, 
      p.slug, 
      history.created_at 
    FROM 
      history 
    INNER JOIN products p ON history.product_id = p.id 
    WHERE user_id = $1 ORDER BY history.created_at ${sort} OFFSET $2 LIMIT $3
    `;
    const values = [id, from, limit];

    const count: string = `SELECT COUNT(*) FROM  history WHERE user_id = $1`;
    const countValues = [id];

    const [history, total] = await Promise.all([
      await db.query(text, values),
      await db.query(count, countValues),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'Historial de usuario',
      history: history.rows,
      total: total.rows[0].count,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener historial de usuario',
      error,
    });
  }
};

export const createHistory = async (req: Request, res: Response) => {
  const { user_id, product_id } = req.body;
  const date = moment().format();

  try {
    const text: string =
      'INSERT INTO history(user_id, product_id, created_at) VALUES($1,$2,$3) RETURNING*';
    const values = [user_id, product_id, date];

    const { rows } = await db.query(text, values);

    const history = rows[0];

    return res
      .status(201)
      .json({ ok: true, msg: 'Se ha agregado a tu historial', history });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear historial',
      error,
    });
  }
};

export const deleteHistory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const text: string = 'DELETE FROM history WHERE id = $1 RETURNING*';
    const values = [id];

    const { rows } = await db.query(text, values);

    const deletedHistory = rows[0];
    return res
      .status(200)
      .json({ ok: true, msg: 'Se ha borrado de tu historial', deletedHistory });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de eliminar historial',
      error,
    });
  }
};
