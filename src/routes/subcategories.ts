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
import { subcategoryExist, userExist, categoryExist } from '../helpers';
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
    check('is_active', 'El estado de la categoría es obligatorio')
      .not()
      .isEmpty(),
    check('is_published', 'El estado de la categoría es obligatorio')
      .not()
      .isEmpty(),
    check('is_active', 'Se requiere un valor Verdadero o Falso').isBoolean(),
    check('is_published', 'Se requiere un valor Verdadero o Falso').isBoolean(),
    check('updated_by', 'El usuario que actualiza la categoría es obligatorio')
      .not()
      .isEmpty(),
    check('updated_by').custom(userExist),
    check('category_id', 'La categoría es obligatoria').not().isEmpty(),
    check('category_id').custom(categoryExist),
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
