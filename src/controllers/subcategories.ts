import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';
import { slugExist, slugify } from '../helpers';

export const getSubcategories = async (req: Request, res: Response) => {
  const { limit = 20, sort = 'ASC', from = 0, is_active = true } = req.query;

  try {
    const text: string = `SELECT * FROM  subcategories WHERE is_active='${is_active}' ORDER BY id ${sort} OFFSET ${from}  LIMIT ${limit} `;
    const count: string = `SELECT COUNT(*) FROM  subcategories WHERE is_active='${true}'`;

    const [total, subcategories] = await Promise.all([
      await db.query(count),
      await db.query(text),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'Lista de subcategorías',
      total: total.rows[0].count,
      subcategories: subcategories.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const getSubcategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = `SELECT * FROM subcategories WHERE id = '${id}' LIMIT 1`;
    const { rows } = await db.query(text);
    const category = rows[0];

    return res.status(200).json({ ok: true, msg: 'Categoría', category });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const createSubategory = async (req: Request, res: Response) => {
  const { title, img = '', created_by, updated_by, category_id } = req.body;

  const date = moment().format();
  const slug = slugify(title);
  const newSlug = await slugExist(slug, 'subcategories');

  try {
    const text: string =
      'INSERT INTO subcategories(title, img, slug, is_active, is_published, created_by, updated_by, category_id, created_at, updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *';

    const values: string[] = [
      title,
      img,
      newSlug,
      true,
      false,
      created_by,
      updated_by,
      category_id,
      date,
      date,
    ];

    const { rows } = await db.query(text, values);

    const newSubcategory = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'Subcategoría creada',
      newSubcategory,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const updateSubategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  //TODO
  try {
    return res
      .status(200)
      .json({ ok: true, msg: 'Actualizar subcategoría', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deactivateSubcategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const date = moment().format();

  try {
    const text: string = `UPDATE subcategories SET is_active='${false}', updated_by = '${userId}', updated_at = '${date}' WHERE id = ${id} RETURNING*`;

    const { rows } = await db.query(text);

    return res.status(200).json({
      ok: true,
      msg: 'Subcategoría dada de baja',
      deactivatedCategory: rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteSubcategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = `DELETE FROM subcategories WHERE id = '${id}' RETURNING*`;

    const { rows } = await db.query(text);
    return res.status(200).json({
      ok: true,
      msg: 'Eliminar subcategoría',
      deletedSubcategory: rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
