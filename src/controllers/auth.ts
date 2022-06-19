import { Request, Response } from 'express';
import moment from 'moment';
import bcryptjs from 'bcryptjs';
import { db } from '../db';
import { generateJWT } from '../helpers';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const text: string = `SELECT * FROM users WHERE email = $1`;
    const values = [email];

    const { rows } = await db.query(text, values);
    const user = rows[0];

    if (!user) {
      return res.status(400).json({
        msg: 'Correo electrónico o contraseña incorrectos',
        ok: false,
      });
    }

    if (!user.is_active) {
      return res.status(400).json({
        msg: 'Esa cuenta ha sido dada de baja',
      });
    }

    //Validar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Correo electrónico o contraseña incorrectos',
        ok: false,
      });
    }

    //Generar JWT
    const token = await generateJWT(user.id);

    return res
      .status(200)
      .json({ ok: true, msg: 'Inicio de sesión', token, user });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, msg: 'Error', error });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password, confirmPassword, newPassword, confirmNewPassword } =
    req.body;

  const date = moment().format();
  try {
    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({ ok: false, msg: 'Las contraseñas no coinciden' });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(401)
        .json({ ok: false, msg: 'La nueva contraseña no coincide' });
    }

    const text: string = `SELECT * FROM users WHERE id = $1`;
    const values = [id];

    const { rows } = await db.query(text, values);
    const user = rows[0];

    //Validar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ ok: false, msg: 'La contraseña es incorrecta' });
    }

    //Encriptar nueva contraseña
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(newPassword, salt);

    const updateText: string =
      'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3 RETURNING*';

    const updateValues = [hash, date, id];

    const updatedUser = await db.query(updateText, updateValues);

    return res.status(200).json({
      ok: true,
      msg: 'Su contraseña se ha actualizado correctamente',
      updatedUser: updatedUser.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      error,
      msg: 'Error en el servidor al momento de actualizar la contraseña',
    });
  }
};

export const changeEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password, confirmPassword, newEmail } = req.body;
  const date = moment().format();

  try {
    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({ ok: false, msg: 'Las contraseñas no coinciden' });
    }

    const text: string = `SELECT * FROM users WHERE id = $1`;
    const values = [id];

    const { rows } = await db.query(text, values);
    const user = rows[0];

    //Validar contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res
        .status(401)
        .json({ ok: false, msg: 'La contraseña es incorrecta' });
    }

    //Actualizar correo de usuario
    const updateText: string =
      'UPDATE users SET email = $1, updated_at = $2 WHERE id = $3 RETURNING*';

    const updateValues = [newEmail, date, id];

    const updatedUser = await db.query(updateText, updateValues);

    return res.status(200).json({
      ok: true,
      msg: 'Correo actualizado correctamente',
      updatedUser: updatedUser.rows[0],
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, error, msg: 'Error' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ ok: false, error, msg: 'Error' });
  }
};
