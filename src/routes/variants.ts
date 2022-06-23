import { Router } from 'express';
import { check } from 'express-validator';
import {
  createVariant,
  deleteVariant,
  getVariants,
  updateVariant,
} from '../controllers';
import { variantExist } from '../helpers';
import {
  validateJWT,
  validateFields,
  superAdminRol,
  hasRol,
} from '../middlewares';

const router = Router();

router.get('/', getVariants);

router.post(
  '/',
  [
    validateJWT,
    superAdminRol,
    check('name', 'El nombre de la variante es obligatorio').not().isEmpty(),
    check('short', 'La abreviatura es obligatoria').not().isEmpty(),
    validateFields,
  ],
  createVariant
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
  updateVariant
);

router.delete(
  '/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(variantExist),
    validateFields,
  ],
  deleteVariant
);

export default router;
