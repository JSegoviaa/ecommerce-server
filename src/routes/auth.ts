import { Router } from 'express';
import { check } from 'express-validator';
import { login } from '../controllers';
import { validateFields } from '../middlewares';

const router = Router();

router.post(
  '/login',
  [
    check('email', 'El correo electróonico ingresado no es válido.').isEmail(),
    check('email', 'El correo electrónico es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria.').not().isEmpty(),
    validateFields,
  ],
  login
);

export default router;
