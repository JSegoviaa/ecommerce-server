import { Request, Response } from 'express';
import moment from 'moment';
import { db } from '../db';
import { slugExist, slugify } from '../helpers';
import {
  ProductCreated,
  ProductVariant,
  ProductsVariants,
  ProductBody,
  Tags,
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
  const {
    limit = 20,
    sort = 'ASC',
    from = 0,
    order_by = 'created_at',
  } = req.query;
  let newRate: number = 0;

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

    const textComments: string = `SELECT * FROM comments c WHERE c.product_id = $1 ORDER BY ${order_by} ${sort} OFFSET $2 LIMIT $3`;
    const valuesComments = [id, from, limit];

    const textRatings: string = `SELECT AVG (rating) FROM ratings WHERE product_id = $1`;
    const values = [id];

    const [product, variants, images, comments, rating] = await Promise.all([
      await db.query(textProduct, valuesProduct),
      await db.query(textVariant, valuesVariants),
      await db.query(textImgs, valuesImgs),
      await db.query(textComments, valuesComments),
      await db.query(textRatings, values),
    ]);

    const rate: number = Number(rating.rows[0].avg);

    if (rate <= 0.3) {
      newRate = 0;
    } else if (rate > 0.3 && rate <= 0.7) {
      newRate = 0.5;
    } else if (rate > 0.7 && rate <= 1.3) {
      newRate = 1;
    } else if (rate > 1.3 && rate <= 1.7) {
      newRate = 1.5;
    } else if (rate > 1.7 && rate <= 2.3) {
      newRate = 2;
    } else if (rate > 2.3 && rate <= 2.7) {
      newRate = 2.5;
    } else if (rate > 2.7 && rate <= 3.3) {
      newRate = 3;
    } else if (rate > 3.3 && rate <= 3.7) {
      newRate = 3.5;
    } else if (rate > 3.7 && rate <= 4.3) {
      newRate = 4;
    } else if (rate > 4.3 && rate <= 7.5) {
      newRate = 4.5;
    } else newRate = 5;

    return res.status(200).json({
      ok: true,
      msg: 'Producto obtenido correctamente.',
      fullProduct: {
        info: product.rows[0],
        variants: variants.rows,
        images: images.rows,
        comments: comments.rows,
        rating: newRate,
      },
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
  const {
    limit = 20,
    sort = 'ASC',
    from = 0,
    order_by = 'created_at',
  } = req.query;
  let newRate: number = 0;

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

    const textComments: string = `
    SELECT c.id, c.title, c.comment, c.user_id, c.created_at FROM comments c 
    INNER JOIN products p ON c.product_id = p.id
    WHERE p.slug = $1 ORDER BY ${order_by} ${sort} OFFSET $2 LIMIT $3`;
    const valuesComments = [slug, from, limit];

    const textRating: string = `
    SELECT AVG (rating) FROM ratings r 
    INNER JOIN products p ON r.product_id = p.id    
    WHERE p.slug = $1 
    `;
    const valuesRating = [slug];

    const [product, variants, images, comments, rating] = await Promise.all([
      await db.query(textProduct, valuesProduct),
      await db.query(textVariant, valuesVariants),
      await db.query(textImgs, valuesImgs),
      await db.query(textComments, valuesComments),
      await db.query(textRating, valuesRating),
    ]);

    const rate: number = Number(rating.rows[0].avg);

    if (rate <= 0.3) {
      newRate = 0;
    } else if (rate > 0.3 && rate <= 0.7) {
      newRate = 0.5;
    } else if (rate > 0.7 && rate <= 1.3) {
      newRate = 1;
    } else if (rate > 1.3 && rate <= 1.7) {
      newRate = 1.5;
    } else if (rate > 1.7 && rate <= 2.3) {
      newRate = 2;
    } else if (rate > 2.3 && rate <= 2.7) {
      newRate = 2.5;
    } else if (rate > 2.7 && rate <= 3.3) {
      newRate = 3;
    } else if (rate > 3.3 && rate <= 3.7) {
      newRate = 3.5;
    } else if (rate > 3.7 && rate <= 4.3) {
      newRate = 4;
    } else if (rate > 4.3 && rate <= 7.5) {
      newRate = 4.5;
    } else newRate = 5;

    return res.status(200).json({
      ok: true,
      msg: 'Producto obtenido correctamente.',
      fullProduct: {
        info: product.rows[0],
        variants: variants.rows,
        images: images.rows,
        comments: comments.rows,
        rating: newRate,
      },
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
    tags,
  }: ProductBody = req.body;

  const date = moment().format();
  const slug = slugify(title);
  const newSlug = await slugExist(slug, 'products');
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

    const variants: ProductVariant[] = await Promise.all(
      variant_options.map(async (variant) => {
        const text: string = `
        INSERT INTO
          variant_options(price, grams, mililiters, length, width, height, diameter, variant_size_id, variant_color_id)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING*`;
        const values = [
          variant.price,
          variant.grams,
          variant.mililiters,
          variant.length,
          variant.width,
          variant.height,
          variant.diameter,
          variant.variant_size_id,
          variant.variant_color_id,
        ];
        const { rows } = await db.query(text, values);

        return rows[0];
      })
    );

    const productsVariants: ProductsVariants[] = await Promise.all(
      variants.map(async (variant) => {
        const text: string = `INSERT INTO products_variants(product_id, variant_option_id) VALUES($1,$2) RETURNING*`;
        const values = [productCreated.id, variant.id];

        const { rows } = await db.query(text, values);
        return rows[0];
      })
    );

    const productTags: Tags[] = await Promise.all(
      tags.map(async (tag) => {
        const text: string = `INSERT INTO products_tags(product_id, tag_id) VALUES($1,$2) RETURNING*`;
        const values = [productCreated.id, tag.id];
        const { rows } = await db.query(text, values);

        return rows[0];
      })
    );

    return res.status(201).json({
      ok: true,
      msg: 'Se ha creado el producto exitosamente.',
      productCreated,
      variants,
      productsVariants,
      productTags,
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

    return res.status(200).json({
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
