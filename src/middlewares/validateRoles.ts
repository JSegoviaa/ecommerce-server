import { NextFunction, Request, Response } from 'express';
import { ReqUser, Role } from '../interfaces/users';

declare global {
  namespace Express {
    interface Request {
      user: ReqUser;
    }
  }
}

export const superAdminRol = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ msg: 'Se quiere verificar el rol sin iniciar sesión' });
  }

  const { role_id, first_name } = req.user as ReqUser;
  if (role_id !== 1) {
    return res.status(401).json({
      msg: `${first_name} no tiene permisos de Super Administrador para realizar esa acción`,
    });
  }

  next();
};

export const adminRol = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ msg: 'Se quiere verificar el rol sin iniciar sesión' });
  }

  const { role_id, first_name } = req.user;
  if (role_id !== 2) {
    return res.status(401).json({
      msg: `${first_name} no tiene permisos de Administrador para realizar esa acción`,
    });
  }

  next();
};

export const hasRol = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(500)
        .json({ msg: 'Se quiere verificar el rol sin iniciar sesión' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `Para realizar esta acción se requiere alguno de estos roles: ${roles}`,
      });
    }

    next();
  };
};
