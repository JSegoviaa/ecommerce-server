import { Router } from 'express';
import { check } from 'express-validator';
import {
  createCategory,
  deactivateCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers';
import {
  categoryExist,
  categoryQueryValidator,
  sortQueryValidator,
  userExist,
} from '../helpers';
import {
  hasRol,
  superAdminRol,
  validateFields,
  validateJWT,
} from '../middlewares';

const router = Router();

router.get(
  '/',
  [
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(categoryQueryValidator),
    validateFields,
  ],
  getCategories
);

router.get(
  '/:id',
  [check('id').custom(categoryExist), validateFields],
  getCategory
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
  createCategory
);

router.put(
  '/:id',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador', 'Moderador'),
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('img', 'La imagen es obligatoria').not().isEmpty(),
    check('is_active', 'El estado de la categoría es obligatorio')
      .not()
      .isEmpty(),
    check('is_published', 'El estado de la categoría es obligatorio')
      .not()
      .isEmpty(),
    check('is_active', 'El tipo de dato no es correcto').isBoolean(),
    check('is_published', 'El tipo de dato no es correcto').isBoolean(),
    check('updated_by', 'El usuario que actualiza la categoría es obligatorio')
      .not()
      .isEmpty(),
    check('updated_by').custom(userExist),
    check('id').custom(categoryExist),
    validateFields,
  ],
  updateCategory
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
    check('id').custom(categoryExist),
    validateFields,
  ],
  deactivateCategory
);

router.delete(
  '/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(categoryExist),
    validateFields,
  ],
  deleteCategory
);

export default router;
