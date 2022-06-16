import { Router } from 'express';
import { check } from 'express-validator';
import { changeEmail, login } from '../controllers';
import { emailIsAlreadyUsed, userDeactivated, userExist } from '../helpers';
import { validateFields } from '../middlewares';
import { validateJWT } from '../middlewares/validateJWT';

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

router.put(
  '/change-email/:id',
  [
    validateJWT,
    check('id').custom(userExist),
    check('id').custom(userDeactivated),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check(
      'password',
      'La contraseña debe de contener al menos un número, una letra en mayúscula, una letra en minúscula y un símbolo'
    ).isStrongPassword(),
    check(
      'password',
      'La contraseña debe tener al menos 8 caracteres'
    ).isLength({ min: 8 }),
    check('confirmPassword', 'La confirmación de contraseña es obligatoria')
      .not()
      .isEmpty(),
    check(
      'confirmPassword',
      'La confirmación de contraseña debe de contener al menos un número, una letra en mayúscula, una letra en minúscula y un símbolo'
    ).isStrongPassword(),
    check(
      'confirmPassword',
      'La confirmación de contraseña debe tener al menos 8 caracteres'
    ).isLength({ min: 8 }),
    check('newEmail').custom(emailIsAlreadyUsed),
    check('newEmail', 'El correo electrónico es obligatorio').not().isEmpty(),
    check('newEmail', 'El correo electrónico ingresado no es válido').isEmail(),
    validateFields,
  ],
  changeEmail
);

export default router;
