import { Request, Response } from 'express';
import { db } from '../db';

export const getTags = async (req: Request, res: Response) => {
  try {
    const text: string = 'SELECT * FROM tags ORDER BY name';

    const { rows } = await db.query(text);

    return res
      .status(200)
      .json({ ok: true, msg: 'Se obtuvo lista de etiquetas', tags: rows });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener lista de etiquetas.',
      error,
    });
  }
};

export const createTag = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const text: string = 'INSERT INTO tags(name) VALUES($1) RETURNING*';
    const values = [name];

    const { rows } = await db.query(text, values);

    const tagCreated = rows[0];

    return res
      .status(201)
      .json({ ok: true, msg: 'Se ha añadido la etiqueta.', tagCreated });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear una etiqueta.',
      error,
    });
  }
};
