import { db } from '../db';
import { randomId, slugify } from './slugify';

type DB = 'categories' | 'subcategories' | 'products';

export const emailIsAlreadyUsed = async (email: string) => {
  const text: string = `SELECT email FROM users WHERE email = $1 LIMIT 1`;
  const values = [email];

  const emailExist = await db.query(text, values);

  if (emailExist.rows.length === 0) return;

  if (emailExist) {
    throw new Error(
      `El correo electrónico ingresado ${emailExist.rows[0].email} ya está en uso`
    );
  }

  return;
};

export const userExist = async (id: number) => {
  const text: string = `SELECT * FROM users WHERE id = $1 LIMIT 1`;
  const values = [id];

  const userExist = await db.query(text, values);

  if (userExist.rows.length === 0) {
    throw new Error(`El usuario con el id ${id} no existe`);
  }

  if (userExist) return;

  return;
};

export const userExistsInAddress = async (id: number) => {
  const text: string = `SELECT user_id FROM addresses WHERE user_id = $1 LIMIT 1`;
  const values = [id];

  const userExist = await db.query(text, values);

  if (userExist.rows.length === 0) return;

  if (userExist) {
    throw new Error(`El usuario no puede tener más de dos direcciones`);
  }

  return;
};

export const userDeactivated = async (id: number) => {
  const text: string = `SELECT * FROM users WHERE id = $1`;
  const values = [id];

  const userHasBeenDeactivated = await db.query(text, values);

  if (userHasBeenDeactivated.rows.length === 0) return;

  if (userHasBeenDeactivated.rows[0].is_active) return;

  if (!userHasBeenDeactivated.rows[0].is_active) {
    throw new Error(
      'Para actualizar la información del usuario hay que darlo de alta'
    );
  }
};

export const addressExist = async (id: number) => {
  const text: string = `SELECT * FROM addresses WHERE user_id = $1 LIMIT 1`;
  const values = [id];

  const addressExist = await db.query(text, values);

  if (addressExist.rows.length === 0) {
    throw new Error(`No existe una dirección asociada al usuario con id ${id}`);
  }

  if (addressExist) return;

  return;
};

export const categoryExist = async (id: number) => {
  const text: string = `SELECT * FROM categories WHERE id = $1 LIMIT 1`;
  const values = [id];

  const categoryExist = await db.query(text, values);

  if (categoryExist.rows.length === 0) {
    throw new Error(`No existe una categoría con el id ${id}`);
  }

  if (categoryExist) return;

  return;
};

export const subcategoryExist = async (id: number) => {
  const text: string = `SELECT * FROM subcategories WHERE id = $1 LIMIT 1`;
  const values = [id];

  const subcategoryExist = await db.query(text, values);

  if (subcategoryExist.rows.length === 0) {
    throw new Error(`No existe una subcategoría con el id ${id}`);
  }

  if (subcategoryExist) return;

  return;
};

export const productExist = async (id: number) => {
  const text: string = `SELECT * FROM products WHERE id = $1 LIMIT 1`;
  const values = [id];

  const productExist = await db.query(text, values);

  if (productExist.rows.length === 0) {
    throw new Error(`No existe un producto con el id ${id}`);
  }

  if (productExist) return;

  return;
};

export const codeExist = async (id: string) => {
  const text: string = `SELECT * FROM codes WHERE id = $1 LIMIT 1`;
  const values = [id];

  const codeExist = await db.query(text, values);

  if (codeExist.rows.length === 0) {
    throw new Error(`No existe un código con el id ${id}`);
  }

  if (codeExist) return;

  return;
};

export const codeNameExist = async (name: string) => {
  const text: string = `SELECT * FROM codes WHERE name = $1 LIMIT 1`;
  const values = [name];

  const codeNameExist = await db.query(text, values);

  if (codeNameExist.rows.length === 0) return;

  if (codeNameExist) {
    throw new Error('Ya existe un código con ese nombre');
  }

  return;
};

export const isValidRole = async (role: number) => {
  const text: string = `SELECT * FROM roles WHERE id = $1`;
  const values = [role];

  const roleExist = await db.query(text, values);

  if (roleExist.rows.length === 0) {
    throw new Error(`El rol ${role} no es un rol válido`);
  }

  if (roleExist) return;
};

export const slugExist = async (slug: string, category: DB) => {
  const query = `SELECT * FROM ${category} WHERE slug = $1`;
  const values = [slug];

  const slugExist = await db.query(query, values);

  if (slugExist.rows.length === 0) {
    return slug;
  }

  if (slugExist) {
    const newSlug = slugify(slugExist.rows[0].slug);
    const randomSlugId = randomId();

    return newSlug + '-' + randomSlugId;
  }
};

export const historyExist = async (id: number) => {
  const text: string = `SELECT * FROM history WHERE id = $1 LIMIT 1`;
  const values = [id];

  const historyExist = await db.query(text, values);

  if (historyExist.rows.length === 0) {
    throw new Error(`No existe el historial con el id ${id}`);
  }

  if (historyExist) return;

  return;
};

export const variantExist = async (id: number) => {
  const text: string = `SELECT * FROM variant_sizes WHERE id = $1 LIMIT 1`;
  const values = [id];

  const variantExist = await db.query(text, values);

  if (variantExist.rows.length === 0) {
    throw new Error(`No existe una variante con ese id ${id}`);
  }

  if (variantExist) return;

  return;
};

export const variantSizeNameExist = async (name: number) => {
  const text: string = `SELECT * FROM variant_sizes WHERE name = $1 LIMIT 1`;
  const values = [name];

  const variantSizeNameExist = await db.query(text, values);

  if (variantSizeNameExist.rows.length === 0) return;

  if (variantSizeNameExist) {
    throw new Error('Ya existe un tamaño con ese nombre.');
  }

  return;
};

export const variantSizeShortExist = async (short: number) => {
  const text: string = `SELECT * FROM variant_sizes WHERE short = $1 LIMIT 1`;
  const values = [short];

  const variantSizeShortExist = await db.query(text, values);

  if (variantSizeShortExist.rows.length === 0) return;

  if (variantSizeShortExist) {
    throw new Error('Ya existe una abreviación con ese nombre.');
  }

  return;
};

export const variantColorExist = async (id: number) => {
  const text: string = `SELECT * FROM variant_colors WHERE id = $1 LIMIT 1`;
  const values = [id];

  const variantColorExist = await db.query(text, values);

  if (variantColorExist.rows.length === 0) {
    throw new Error(`No existe un color con ese id ${id}`);
  }

  if (variantColorExist) return;

  return;
};

export const variantColorNameExist = async (name: string) => {
  const text: string = `SELECT * FROM variant_colors WHERE name = $1 LIMIT 1`;
  const values = [name];

  const variantColorNameExist = await db.query(text, values);

  if (variantColorNameExist.rows.length === 0) return;

  if (variantColorNameExist) {
    throw new Error('Ya existe un color con ese nombre');
  }

  return;
};
