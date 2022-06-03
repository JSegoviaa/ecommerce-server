import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';

export const validateJWT = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-token');

  if (!token) {
    return res
      .status(401)
      .json({ msg: 'Se necesita iniciar sesión para realizar esta acción.' });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT!) as any;
    const text: string = `
          SELECT 
            users.id, 
            users.is_active, 
            roles.role 
          FROM 
            users 
          INNER JOIN roles ON users.role_id = roles.id 
          WHERE users.id = '${uid}'
          `;

    const { rows } = await db.query(text);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        msg: 'El usuario que intenta hacer esa acción no existe',
      });
    }

    //Vericar que el usuario no haya sido dado de baja
    if (!user.is_active) {
      return res.status(401).json({
        msg: 'El usuario que intenta realizar esta acción ha sido dado de baja',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido',
    });
  }
};
