import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../controllers';
import { emailIsAlreadyUsed } from '../helpers';

const router = Router();

router.get('/', getUsers);
router.get('/:id', [], getUser);

router.post(
  '/',
  [
    check('first_name', 'El nombre es obligatorio').not().isEmpty(),
    check('last_name', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Ingrese un correo electrónico válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('email').custom(emailIsAlreadyUsed),
    validateFields,
  ],
  createUser
);

router.put('/:id', [], updateUser);
router.delete('/:id', [], deleteUser);

export default router;
