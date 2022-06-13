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
import { categoryExist, userExist } from '../helpers';
import {
  hasRol,
  superAdminRol,
  validateFields,
  validateJWT,
} from '../middlewares';

const router = Router();

router.get('/', getCategories);

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
