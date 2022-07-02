import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';

export const getAllComments = async (req: Request, res: Response) => {
  const {
    limit = 20,
    sort = 'ASC',
    from = 0,
    order_by = 'created_at',
  } = req.query;

  try {
    const text: string = `SELECT * FROM comments ORDER BY ${order_by} ${sort} OFFSET $1 LIMIT $2`;
    const values = [from, limit];

    const { rows } = await db.query(text, values);

    return res.status(201).json({
      ok: true,
      msg: 'Lista de todos los comentarios del producto.',
      allComments: rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener todos los comentarios.',
      error,
    });
  }
};

export const getCommentsByProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { limit = 20, sort = 'ASC', from = 0 } = req.query;

  try {
    const text: string = `SELECT * FROM comments WHERE product_id = $1 ORDER BY created_at ${sort} OFFSET $2 LIMIT $3`;
    const values = [id, from, limit];

    const { rows } = await db.query(text, values);

    return res
      .status(201)
      .json({ ok: true, msg: 'Comentarios del producto.', comments: rows });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener los comentarios del producto.',
      error,
    });
  }
};

export const createComment = async (req: Request, res: Response) => {
  const { title, comment, user_id, product_id } = req.body;
  const date = moment().format();

  try {
    const textComment: string =
      'SELECT * FROM comments WHERE user_id = $1 AND product_id = $2';
    const valuesComment = [user_id, product_id];

    const commentExist = await db.query(textComment, valuesComment);

    if (commentExist.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya has agregado un comentario a este producto.',
      });
    }

    const text: string =
      'INSERT INTO comments(title, comment, user_id, product_id, created_at) VALUES($1,$2,$3,$4,$5) RETURNING*';
    const values = [title, comment, user_id, product_id, date];

    const { rows } = await db.query(text, values);

    const commentCreated = rows[0];
    return res.status(201).json({
      ok: true,
      msg: 'Su comentario ha sido añadido.',
      commentCreated,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de agregar un comentario.',
    });
  }
};
