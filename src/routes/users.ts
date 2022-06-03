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
import { emailIsAlreadyUsed, isValidRole, userExist } from '../helpers';

const router = Router();

router.get('/', getUsers);

router.get(
  '/:id',
  [
    check('id', 'No existe un usuario con ese id'),
    check('id').custom(userExist),
    validateFields,
  ],
  getUser
);

router.post(
  '/',
  [
    check('first_name', 'El nombre es obligatorio').not().isEmpty(),
    check('last_name', 'El apellido es obligatorio').not().isEmpty(),
    check('email', 'El correo es obligatorio').not().isEmpty(),
    check('email', 'Ingrese un correo electrónico válido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check(
      'password',
      'La contraseña debe de contener al menos un número, una letra en mayúscula, una letra en minúscula y un símbolo'
    ).isStrongPassword(),
    check(
      'password',
      'La contraseña debe tener al menos 8 caracteres'
    ).isLength({ min: 8 }),
    check('email').custom(emailIsAlreadyUsed),
    check('role_id', 'El rol ingresado no es un rol válido').isFloat({
      min: 1,
      max: 4,
    }),
    check('role_id').custom(isValidRole),
    validateFields,
  ],
  createUser
);

router.put(
  '/:id',
  [
    check('id', 'No existe un usuario con ese id'),
    check('id').custom(userExist),
    validateFields,
  ],
  updateUser
);

router.delete(
  '/:id',
  [
    check('id', 'No existe un usuario con ese id'),
    check('id').custom(userExist),
    validateFields,
  ],
  deleteUser
);

export default router;
