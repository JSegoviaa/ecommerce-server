import { Router } from 'express';
import { check } from 'express-validator';
import {
  createVariantColor,
  createVariantSize,
  deleteVariantColor,
  deleteVariantSize,
  getVariantColors,
  getVariantsSizes,
  updatedVariantColor,
  updateVariantSize,
} from '../controllers';
import {
  variantColorExist,
  variantColorNameExist,
  variantExist,
  variantSizeNameExist,
  variantSizeShortExist,
} from '../helpers';
import {
  validateJWT,
  validateFields,
  superAdminRol,
  hasRol,
} from '../middlewares';

const router = Router();

router.get('/', getVariantsSizes);

router.post(
  '/',
  [
    validateJWT,
    superAdminRol,
    check('name').custom(variantSizeNameExist),
    check('short').custom(variantSizeShortExist),
    check('name', 'El nombre de la variante es obligatorio').not().isEmpty(),
    check('short', 'La abreviatura es obligatoria').not().isEmpty(),
    validateFields,
  ],
  createVariantSize
);

router.put(
  '/:id',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('id').custom(variantExist),
    check('name', 'El nombre de la variante es obligatorio').not().isEmpty(),
    check('short', 'La abreviatura es obligatoria').not().isEmpty(),
    validateFields,
  ],
  updateVariantSize
);

router.delete(
  '/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(variantExist),
    validateFields,
  ],
  deleteVariantSize
);

router.get('/colors', getVariantColors);

router.post(
  '/colors',
  [
    validateJWT,
    superAdminRol,
    check('name').custom(variantColorNameExist),
    check('name', 'El nombre del color es obligatorio').not().isEmpty(),
    validateFields,
  ],
  createVariantColor
);

router.put(
  '/colors/:id',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('id').custom(variantColorExist),
    check('name', 'El nombre del color es obligatorio').not().isEmpty(),
    validateFields,
  ],
  updatedVariantColor
);

router.delete(
  '/colors/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(variantColorExist),
    validateFields,
  ],
  deleteVariantColor
);

export default router;
