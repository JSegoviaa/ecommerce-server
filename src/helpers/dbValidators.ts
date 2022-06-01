import { db } from '../db';

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
