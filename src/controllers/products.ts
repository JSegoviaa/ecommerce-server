import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';
import { slugExist, slugify } from '../helpers';
import {
  ProductCreated,
  ProductVariant,
  ProductsVariants,
  ProductBody,
} from '../interfaces';

export const getProducts = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ ok: true, msg: 'Lista de productos' });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Producto', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const {
    title,
    description,
    discount,
    created_by,
    updated_by,
    image_id,
    variant_options,
  }: ProductBody = req.body;

  const date = moment().format();
  const slug = slugify(title);
  const newSlug = await slugExist(slug, 'products');
  let variants: ProductVariant[] = [];
  let productsVariants: ProductsVariants[] = [];

  try {
    const text: string = `
    INSERT INTO 
      products(title, slug, description, discount, is_published, is_active, image_id, created_by, updated_by, created_at, updated_at) 
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) 
    RETURNING*
    `;

    const values = [
      title,
      newSlug,
      description,
      discount,
      false,
      true,
      image_id,
      created_by,
      updated_by,
      date,
      date,
    ];

    const { rows } = await db.query(text, values);
    const productCreated: ProductCreated = rows[0];

    for (let i = 0; i < variant_options.length; i++) {
      const text: string = `
      INSERT INTO 
        variant_options(price, grams, mililiters, length, width, height, diameter, variant_size_id, variant_color_id) 
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) 
      RETURNING*`;

      const values = [
        variant_options[i].price,
        variant_options[i].grams,
        variant_options[i].mililiters,
        variant_options[i].length,
        variant_options[i].width,
        variant_options[i].height,
        variant_options[i].diameter,
        variant_options[i].variant_size_id,
        variant_options[i].variant_color_id,
      ];

      const { rows } = await db.query(text, values);

      variants.push(rows[0]);
    }

    for (let i = 0; i < variants.length; i++) {
      const text: string = `INSERT INTO products_variants(product_id, variant_option_id) VALUES($1,$2) RETURNING*`;
      const values = [productCreated.id, variants[i].id];

      const { rows } = await db.query(text, values);

      productsVariants.push(rows[0]);
    }

    return res.status(201).json({
      ok: true,
      msg: 'Se ha creado el producto exitosamente.',
      productCreated,
      variants,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de crear un producto.',
      error,
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Actualizar producto', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    return res.status(200).json({ ok: true, msg: 'Eliminar producto', id });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
