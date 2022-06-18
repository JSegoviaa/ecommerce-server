import { NextFunction, Request, Response } from 'express';

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (
    req.user.id === Number(id) ||
    req.user.role_id === 1 ||
    req.user.role_id === 2
  ) {
    next();
  } else {
    switch (req.method) {
      case 'GET':
        return res.status(401).json({
          ok: false,
          msg: 'No puedes ver la información de otro usuario',
        });

      case 'PUT':
        return res.status(401).json({
          ok: false,
          msg: 'No puedes actualizar la información de otro usuario',
        });

      default:
        return res.status(401).json({
          ok: false,
          msg: 'Eres imbécil',
        });
    }
  }
};
