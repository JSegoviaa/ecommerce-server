import { Request, Response } from 'express';
import { db } from '../db';

export const searchProduct = async (req: Request, res: Response) => {
  const {
    search,
    limit = 20,
    sort = 'ASC',
    from = 0,
    order_by = 'id',
  } = req.query;

  try {
    const text: string = `
    SELECT DISTINCT
      p.id, 
      p.title, 
      p.slug, 
      i.url,
      p.created_at 
    FROM 
      products p
    INNER JOIN products_tags pt ON p.id = pt.product_id
    INNER JOIN tags t ON pt.tag_id = t.id
    INNER JOIN images i ON p.image_id = i.id
    WHERE p.is_active = true AND p.is_published = false AND p.title LIKE $1 OR t.name LIKE $2 ORDER BY ${order_by} ${sort} OFFSET $3 LIMIT $4
    `;

    const values = [`%${search}%`, `%${search}%`, from, limit];

    const { rows } = await db.query(text, values);

    if (rows.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: `No hay resultados con la búsqueda: ${search}.`,
      });
    }

    return res
      .status(200)
      .json({ ok: true, msg: 'Productos encontrados', productsFound: rows });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de buscar productos.',
      error,
    });
  }
};
