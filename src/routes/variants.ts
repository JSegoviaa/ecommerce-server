import { Router } from 'express';
import { check } from 'express-validator';
import {
  createVariantSize,
  deleteVariantSize,
  getVariantsSizes,
  updateVariantSize,
} from '../controllers';
import { variantExist } from '../helpers';
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

export default router;
