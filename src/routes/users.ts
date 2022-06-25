import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields';
import {
  countUsers,
  createUser,
  deactivateUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  updateUsersRole,
} from '../controllers';
import {
  emailIsAlreadyUsed,
  isValidRole,
  userExist,
  userDeactivated,
  sortQueryValidator,
  userQueryVaidator,
} from '../helpers';
import {
  hasRol,
  superAdminRol,
  validateJWT,
  validateUser,
} from '../middlewares';

const router = Router();

router.get(
  '/',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(userQueryVaidator),
    validateFields,
  ],
  getUsers
);

router.get(
  '/count-users',
  [validateJWT, hasRol('Super Administrador', 'Administrador'), validateFields],
  countUsers
);

router.get(
  '/:id',
  [validateJWT, validateUser, check('id').custom(userExist), validateFields],
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
    check('confirmPassword', 'La confirmación de contraseña es obligatoria')
      .not()
      .isEmpty(),
    check(
      'password',
      'La contraseña debe de contener al menos un número, una letra en mayúscula, una letra en minúscula y un símbolo'
    ).isStrongPassword(),
    check(
      'confirmPassword',
      'La confirmación de contraseña debe de contener al menos un número, una letra en mayúscula, una letra en minúscula y un símbolo'
    ).isStrongPassword(),
    check(
      'password',
      'La contraseña debe tener al menos 8 caracteres'
    ).isLength({ min: 8 }),
    check(
      'confirmPassword',
      'La confirmación de contraseña debe tener al menos 8 caracteres'
    ).isLength({ min: 8 }),
    check('email').custom(emailIsAlreadyUsed),
    check('role_id', 'El rol ingresado no es un rol válido').isFloat({
      min: 1,
      max: 5,
    }),
    check('role_id').custom(isValidRole),
    validateFields,
  ],
  createUser
);

router.put(
  '/:id',
  [
    validateJWT,
    validateUser,
    check('id').custom(userExist),
    check('id').custom(userDeactivated),
    validateFields,
  ],
  updateUser
);

router.put(
  '/deactivate-user/:id',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('id').custom(userExist),
    validateFields,
  ],
  deactivateUser
);

router.put(
  '/role/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(userDeactivated),
    check('id').custom(userExist),
    check('role', 'El rol ingresado no es un rol válido').isFloat({
      min: 1,
      max: 5,
    }),
    check('role').custom(isValidRole),
    validateFields,
  ],
  updateUsersRole
);

router.delete(
  '/:id',
  [validateJWT, superAdminRol, check('id').custom(userExist), validateFields],
  deleteUser
);

export default router;
