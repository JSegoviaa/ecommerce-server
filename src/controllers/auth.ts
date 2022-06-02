import { Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import { db } from '../db';
import { generateJWT } from '../helpers';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const text: string = `SELECT * FROM users WHERE email = '${email}'`;
    const { rows } = await db.query(text);
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
