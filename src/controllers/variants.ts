import { Request, Response } from 'express';
import { db } from '../db';

export const getVariantsSizes = async (req: Request, res: Response) => {
  try {
    const text: string = 'SELECT * FROM variant_sizes';

    const { rows } = await db.query(text);

    return res
      .status(200)
      .json({ ok: false, msg: 'Todas la variantes', variants: rows });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear variante',
    });
  }
};

export const createVariantSize = async (req: Request, res: Response) => {
  const { name, short } = req.body;

  try {
    const text: string =
      'INSERT INTO variant_sizes(name, short) VALUES($1,$2) RETURNING*';

    const values: string[] = [name, short];

    const { rows } = await db.query(text, values);

    const newVariant = rows[0];

    return res
      .status(201)
      .json({ ok: true, msg: 'Se ha creado variante con éxito', newVariant });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear variante',
    });
  }
};

export const updateVariantSize = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, short } = req.body;

  try {
    const text: string =
      'UPDATE variant_sizes SET name = $1, short = $2 WHERE id = $3 RETURNING*';

    const values: string[] = [name, short, id];

    const { rows } = await db.query(text, values);

    const updatedVariant = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'La variante se ha actualizado correctamente',
      updatedVariant,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear variante',
    });
  }
};

export const deleteVariantSize = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = 'DELETE FROM variants_sizes WHERE id = $1 RETURNING*';
    const values: string[] = [id];

    const { rows } = await db.query(text, values);

    const deletedVariant = rows[0];

    return res
      .status(200)
      .json({ ok: true, msg: 'Variante eliminada', deletedVariant });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear variante',
    });
  }
};
