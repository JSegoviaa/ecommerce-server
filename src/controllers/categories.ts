import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';
import { slugExist, slugify } from '../helpers';

export const getCategories = async (req: Request, res: Response) => {
  const { limit = 20, sort = 'ASC', from = 0, is_active = true } = req.query;

  try {
    const text: string = `SELECT * FROM  categories WHERE is_active='${is_active}' ORDER BY id ${sort} OFFSET ${from}  LIMIT ${limit} `;
    const count: string = `SELECT COUNT(*) FROM  categories WHERE is_active='${true}'`;

    const [total, categories] = await Promise.all([
      await db.query(count),
      await db.query(text),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'Lista de categorías',
      total: total.rows[0].count,
      categories: categories.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = `SELECT * FROM categories WHERE id = '${id}' LIMIT 1`;
    const { rows } = await db.query(text);
    const category = rows[0];

    return res.status(200).json({ ok: true, msg: 'Categoría', category });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { title, img = '', created_by, updated_by } = req.body;

  const date = moment().format();
  const slug = slugify(title);
  const newSlug = await slugExist(slug, 'categories');

  try {
    const text: string =
      'INSERT INTO categories(title, img, slug, is_active, is_published, created_by, updated_by, created_at, updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *';

    const values: string[] = [
      title,
      img,
      newSlug,
      true,
      false,
      created_by,
      updated_by,
      date,
      date,
    ];

    const { rows } = await db.query(text, values);

    const newCategory = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'Categoría creada',
      newCategory,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  //TODO
  try {
    return res.status(200).json({ ok: true, msg: 'Actualizar categoría', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deactivateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const date = moment().format();

  try {
    const text: string = `UPDATE categories SET is_active='${false}', updated_by = '${userId}', updated_at = '${date}' WHERE id = ${id} RETURNING*`;

    const { rows } = await db.query(text);

    return res.status(200).json({
      ok: true,
      msg: 'Categoría dada de baja',
      deactivatedCategory: rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = `DELETE FROM categories WHERE id = '${id}' RETURNING*`;

    const { rows } = await db.query(text);
    return res
      .status(200)
      .json({ ok: true, msg: 'Eliminar categoría', deletedCategory: rows[0] });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
