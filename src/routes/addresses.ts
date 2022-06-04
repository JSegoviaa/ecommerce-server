import { Router } from 'express';
import { check } from 'express-validator';
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from '../controllers';
import { addressExist, userExist, userExistsInAddress } from '../helpers';
import { hasRol, validateFields, validateJWT } from '../middlewares';

const router = Router();

router.get(
  '/',
  [validateJWT, hasRol('Super Administrador', 'Administrador'), validateFields],
  getAddresses
);

router.get(
  '/:id',
  [validateJWT, check('id').custom(addressExist), validateFields],
  getAddress
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
    hasRol('Usuario'),
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
    check('id').custom(addressExist),
    validateFields,
  ],
  updateAddress
);

router.delete(
  '/:id',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador', 'Usuario'),
    check('id').custom(addressExist),
    validateFields,
  ],
  deleteAddress
);

export default router;
