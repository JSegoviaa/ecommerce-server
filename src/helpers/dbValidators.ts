import { db } from '../db';
import { randomId, slugify } from './slugify';

export const emailIsAlreadyUsed = async (email: string) => {
  const text: string = `SELECT email FROM users WHERE email = '${email}' LIMIT 1`;

  const emailExist = await db.query(text);

  if (emailExist.rows.length === 0) return;

  if (emailExist) {
    throw new Error(
      `El correo electrónico ingresado ${emailExist.rows[0].email} ya está en uso`
    );
  }

  return;
};

export const userExist = async (id: string) => {
  const text: string = `SELECT * FROM users WHERE id = '${id}' LIMIT 1`;

  const userExist = await db.query(text);

  if (userExist.rows.length === 0) {
    throw new Error(`El usuario con el id ${id} no existe`);
  }

  if (userExist) return;

  return;
};

export const userExistsInAddress = async (id: string) => {
  const text: string = `SELECT user_id FROM addresses WHERE user_id = '${id}' LIMIT 1`;

  const userExist = await db.query(text);

  if (userExist.rows.length === 0) return;

  if (userExist) {
    throw new Error(`El usuario no puede tener más de dos direcciones`);
  }

  return;
};

export const addressExist = async (id: string) => {
  const text: string = `SELECT * FROM addresses WHERE id = '${id}' LIMIT 1`;

  const addressExist = await db.query(text);

  if (addressExist.rows.length === 0) {
    throw new Error(`No existe una dirección con el id ${id}`);
  }

  if (addressExist) return;

  return;
};

export const categoryExist = async (id: string) => {
  const text: string = `SELECT * FROM categories WHERE id = '${id}' LIMIT 1`;

  const categoryExist = await db.query(text);

  if (categoryExist.rows.length === 0) {
    throw new Error(`No existe una categoría con el id ${id}`);
  }

  if (categoryExist) return;

  return;
};

export const isValidRole = async (role: string) => {
  const text: string = `SELECT * FROM roles WHERE id = '${role}'`;
  const roleExist = await db.query(text);

  if (roleExist.rows.length === 0) {
    throw new Error(`El rol ${role} no es un rol válido`);
  }

  if (roleExist) return;
};

export const slugExist = async (slug: string) => {
  const query = `SELECT * FROM categories WHERE slug = '${slug}'`;
  const slugExist = await db.query(query);
  console.log(slugExist.rows);
  if (slugExist.rows.length === 0) {
    return slug;
  }

  if (slugExist) {
    const newSlug = slugify(slugExist.rows[0].slug);
    const randomSlugId = randomId();

    return newSlug + '-' + randomSlugId;
  }
};
