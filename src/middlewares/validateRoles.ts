import { NextFunction, Response } from 'express';
import { ReqUser } from '../interfaces/users';

export const superAdminRol = (req: any, res: Response, next: NextFunction) => {
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

export const adminRol = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ msg: 'Se quiere verificar el rol sin iniciar sesión' });
  }

  const { role_id, first_name } = req.user as ReqUser;
  if (role_id !== 2) {
    return res.status(401).json({
      msg: `${first_name} no tiene permisos de Administrador para realizar esa acción`,
    });
  }

  next();
};

export const hasRol = (...roles: number[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(500)
        .json({ msg: 'Se quiere verificar el rol sin iniciar sesión' });
    }

    if (!roles.includes(req.user.role_id)) {
      return res.status(401).json({
        msg: `Para realizar esta acción se requiere alguno de estos roles: ${roles}`,
      });
    }

    next();
  };
};
