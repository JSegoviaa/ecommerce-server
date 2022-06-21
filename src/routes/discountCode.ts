import { Router } from 'express';
import { superAdminRol, validateFields, validateJWT } from '../middlewares';
import {
  createDiscountCode,
  deleteDiscountCode,
  getAllDiscountCodes,
  getDiscountCode,
  updateDiscountCode,
} from '../controllers';
import { check } from 'express-validator';
import {
  sortQueryValidator,
  userQueryVaidator,
  codeExist,
  codeNameExist,
  userExist,
} from '../helpers';

const router = Router();

router.get(
  '/',
  [
    validateJWT,
    superAdminRol,
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(userQueryVaidator),
    validateFields,
  ],
  getAllDiscountCodes
);

router.get(
  '/:id',
  [validateJWT, superAdminRol, check('id').custom(codeExist), validateFields],
  getDiscountCode
);

router.post(
  '/',
  [
    validateJWT,
    superAdminRol,
    check('name').custom(codeNameExist),
    check('name', 'El nombre del código es obligatorio').not().isEmpty(),
    check('discount', 'El descuento del código es obligatorio').not().isEmpty(),
    check(
      'discount',
      'El descuento tiene que ser un número entre 1 y 100'
    ).isFloat({ min: 1, max: 100 }),
    check(
      'created_by',
      'El usuario que crea el código de descuento es obligatorio'
    )
      .not()
      .isEmpty(),
    check('created_by').custom(userExist),
    check(
      'updated_by',
      'El usuario que crea el código de descuento es obligatorio'
    )
      .not()
      .isEmpty(),
    check('updated_by').custom(userExist),
    check('expires_at', 'La fecha de expiración es obligatoria')
      .not()
      .isEmpty(),
    validateFields,
  ],
  createDiscountCode
);

router.put(
  '/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(codeExist),
    check('name').custom(codeNameExist),
    check('name', 'El nombre del código es obligatorio').not().isEmpty(),
    check('discount', 'El descuento del código es obligatorio').not().isEmpty(),
    check(
      'discount',
      'El descuento tiene que ser un número entre 1 y 100'
    ).isFloat({ min: 1, max: 100 }),
    check(
      'updated_by',
      'El usuario que crea el código de descuento es obligatorio'
    )
      .not()
      .isEmpty(),
    check('updated_by').custom(userExist),
    check('expires_at', 'La fecha de expiración es obligatoria')
      .not()
      .isEmpty(),
    check('is_active', 'El valor activo es obligatorio').not().isEmpty(),
    check('is_active', 'Necesita un valor verdadero o falso').isBoolean(),
    validateFields,
  ],
  updateDiscountCode
);

router.delete(
  '/:id',
  [validateJWT, superAdminRol, check('id').custom(codeExist), validateFields],
  deleteDiscountCode
);

export default router;
