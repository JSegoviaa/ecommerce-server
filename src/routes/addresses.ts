import { Router } from 'express';
import { check } from 'express-validator';
import {
  createAddress,
  deleteAddress,
  getAddressByUser,
  getAddresses,
  updateAddress,
} from '../controllers';
import {
  addressExist,
  addressQueryValidator,
  sortQueryValidator,
  userExist,
  userExistsInAddress,
} from '../helpers';
import {
  hasRol,
  validateFields,
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
    check('order_by').custom(addressQueryValidator),
    validateFields,
  ],
  getAddresses
);

router.get(
  '/:id',
  [
    validateJWT,
    validateUser,
    check('id').custom(userExist),
    check('id').custom(addressExist),
    validateFields,
  ],
  getAddressByUser
);

router.post(
  '/',
  [
    check('country', 'El país es obligatorio').not().isEmpty(),
    check('state', 'El estado es obligatorio').not().isEmpty(),
    check('municipality', 'El municipio es obligatorio').not().isEmpty(),
    check('city', 'La ciudad es obligatoria').not().isEmpty(),
    check('colony', 'La colonia es obligatoria').not().isEmpty(),
    check('postal_code', 'El código postal es obligatorio').not().isEmpty(),
    check('postal_code', 'El código postal debe tener 5 dígitos').isLength({
      min: 5,
      max: 5,
    }),
    check('address', 'La dirección es obligatoria').not().isEmpty(),
    check('user_id', 'El id de usuario es obligatorio').not().isEmpty(),
    check('user_id').custom(userExistsInAddress),
    check('user_id').custom(userExist),
    validateFields,
  ],
  createAddress
);

router.put(
  '/:id',
  [
    validateJWT,
    validateUser,
    check('country', 'El país es obligatorio').not().isEmpty(),
    check('state', 'El estado es obligatorio').not().isEmpty(),
    check('municipality', 'El municipio es obligatorio').not().isEmpty(),
    check('city', 'La ciudad es obligatoria').not().isEmpty(),
    check('colony', 'La colonia es obligatoria').not().isEmpty(),
    check('postal_code', 'El código postal es obligatorio').not().isEmpty(),
    check('postal_code', 'El código postal debe ser un número').not().isFloat(),
    check('postal_code', 'El código postal debe tener 5 dígitos').isLength({
      min: 5,
      max: 5,
    }),
    check('address', 'La dirección es obligatoria').not().isEmpty(),
    check('id').custom(userExist),
    check('id').custom(addressExist),
    validateFields,
  ],
  updateAddress
);

router.delete(
  '/:id',
  [
    validateJWT,
    validateUser,
    check('id').custom(userExist),
    check('id').custom(addressExist),
    validateFields,
  ],
  deleteAddress
);

export default router;
