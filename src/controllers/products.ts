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
  const {
    limit = 20,
    sort = 'ASC',
    from = 0,
    is_active = true,
    order_by = 'id',
  } = req.query;

  try {
    const text: string = `
    SELECT 
      products.id, 
      title, 
      slug, 
      url 
    FROM 
      products 
    INNER JOIN images ON products.image_id = images.id 
    WHERE is_active = $1 ORDER BY ${order_by} ${sort} OFFSET $2 LIMIT $3
    `;
    const values = [is_active, from, limit];

    const count: string = `SELECT COUNT(*) FROM  products WHERE is_active = $1`;
    const countValues = [is_active];

    const [products, total] = await Promise.all([
      await db.query(text, values),
      await db.query(count, countValues),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'Lista de productos.',
      total: total.rows[0].count,
      products: products.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const textProduct: string = `
    SELECT 
      p.id, 
      p.is_published, 
      p.discount, 
      p.description, 
      p.title, 
      p.is_active, 
      p.created_at, 
      p.created_by, 
      p.updated_at, 
      p.updated_by
    FROM products p
    WHERE p.id = $1`;
    const valuesProduct: string[] = [id];

    const textVariant: string = `
    SELECT
      products_variants.id, price, grams, mililiters, length, width, height, diameter,
      vs.name, short,
      vc.name
      FROM products_variants
      INNER JOIN variant_options vo ON products_variants.variant_option_id = vo.id
      INNER JOIN variant_sizes vs ON vo.variant_size_id = vs.id
      INNER JOIN variant_colors vc ON vo.variant_color_id = vc.id
      WHERE product_id = $1`;
    const valuesVariants: string[] = [id];

    const textImgs: string = `
    SELECT 
      pi.id, 
      url 
    FROM products_images pi
    INNER JOIN images i on i.id = pi.image_id
    WHERE product_id = $1`;
    const valuesImgs: string[] = [id];

    const [product, variants, images] = await Promise.all([
      await db.query(textProduct, valuesProduct),
      await db.query(textVariant, valuesVariants),
      await db.query(textImgs, valuesImgs),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'Producto obtenido correctamente.',
      product: product.rows[0],
      variants: variants.rows,
      images: images.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener un producto.',
      error,
    });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const textProduct: string = `
    SELECT 
      p.id, 
      p.is_published, 
      p.discount, 
      p.description, 
      p.title, 
      p.is_active, 
      p.created_at, 
      p.created_by, 
      p.updated_at, 
      p.updated_by,
      p.slug
    FROM products p
    WHERE p.slug = $1`;
    const valuesProduct: string[] = [slug];

    const textVariant: string = `
    SELECT
      products_variants.id, price, grams, mililiters, length, width, height, diameter,
      vs.name, short,
      vc.name,
      p.slug
      FROM products_variants
      INNER JOIN variant_options vo ON products_variants.variant_option_id = vo.id
      INNER JOIN variant_sizes vs ON vo.variant_size_id = vs.id
      INNER JOIN variant_colors vc ON vo.variant_color_id = vc.id
      INNER JOIN products p on products_variants.product_id = p.id
      WHERE p.slug = $1`;
    const valuesVariants: string[] = [slug];

    const textImgs: string = `
    SELECT 
      pi.id, 
      url 
    FROM products_images pi
    INNER JOIN images i ON i.id = pi.image_id
    INNER JOIN products p ON pi.product_id = p.id
    WHERE p.slug = $1`;
    const valuesImgs: string[] = [slug];

    const [product, variants, images] = await Promise.all([
      await db.query(textProduct, valuesProduct),
      await db.query(textVariant, valuesVariants),
      await db.query(textImgs, valuesImgs),
    ]);

    return res.status(200).json({
      ok: true,
      msg: 'Producto obtenido correctamente.',
      product: product.rows[0],
      variants: variants.rows,
      images: images.rows,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de obtener producto.',
    });
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
  const { images } = req.body;
  let productImages = [];

  try {
    for (let i = 0; i < images.length; i++) {
      const textImgs =
        'INSERT INTO products_images(product_id, image_id) VALUES($1,$2) RETURNING*';
      const valuesImgs = [id, images[i].id];
      const { rows } = await db.query(textImgs, valuesImgs);
      productImages.push(rows[0]);
    }

    return res
      .status(200)
      .json({
        ok: true,
        msg: 'Producto actualizado correctamente',
        productImages,
      });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const deactivateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { is_active, updated_by } = req.body;
  const date = moment().format();
  try {
    const text: string =
      'UPDATE products SET is_active = $1, updated_by = $2, updated_at = $3 WHERE id = $4 RETURNING*';
    const values = [is_active, updated_by, date, id];

    const { rows } = await db.query(text, values);
    const deactivatedProduct = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'El producto se ha desactivado correctamente.',
      deactivatedProduct,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      msg: 'Error en el servidor al momento de desactivar el producto.',
      error,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const text: string = 'DELETE FROM products WHERE id = $1 RETURNING*';
    const values: string[] = [id];

    const { rows } = await db.query(text, values);

    const deletedProduct = rows[0];

    return res.status(200).json({
      ok: true,
      msg: 'Producto eliminado correctamente.',
      deletedProduct,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};
