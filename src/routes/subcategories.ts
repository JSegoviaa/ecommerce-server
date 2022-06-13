import { Router } from 'express';
import { check } from 'express-validator';
import {
  createSubategory,
  deactivateSubcategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategory,
  updateSubategory,
} from '../controllers';
import { subcategoryExist, userExist } from '../helpers';
import {
  hasRol,
  superAdminRol,
  validateFields,
  validateJWT,
} from '../middlewares';

const router = Router();

router.get('/', getSubcategories);

router.get(
  '/:id',
  [check('id').custom(subcategoryExist), validateFields],
  getSubcategory
);

router.post(
  '/',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('created_by', 'El usuario que crea la categoría es obligatorio')
      .not()
      .isEmpty(),
    validateFields,
  ],
  createSubategory
);

router.put(
  '/:id',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador', 'Moderador'),
    check('id').custom(subcategoryExist),
    validateFields,
  ],
  updateSubategory
);

router.put(
  '/deactivate-category/:id',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('userId', 'El usuario que lo actualiza es obligatorio')
      .not()
      .isEmpty(),
    check('userId').custom(userExist),
    check('id').custom(subcategoryExist),
    validateFields,
  ],
  deactivateSubcategory
);

router.delete(
  '/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(subcategoryExist),
    validateFields,
  ],
  deleteSubcategory
);

export default router;
