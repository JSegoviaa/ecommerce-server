import { Router } from 'express';
import { check } from 'express-validator';
import {
  createComment,
  getAllComments,
  getCommentsByProduct,
  getUsersComments,
} from '../controllers';
import {
  commentsQueryValidator,
  productExist,
  sortQueryValidator,
  userExist,
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
    check('order_by').custom(commentsQueryValidator),
    validateFields,
  ],
  getAllComments
);

router.get(
  '/:id',
  [check('sort').custom(sortQueryValidator), validateFields],
  getCommentsByProduct
);

router.get(
  '/users-comments/:id',
  [
    validateJWT,
    validateUser,
    check('sort').custom(sortQueryValidator),
    validateFields,
  ],
  getUsersComments
);

router.post(
  '/',
  [
    validateJWT,
    validateUser,
    check('user_id').custom(userExist),
    check('product_id').custom(productExist),
    check('title', 'El título es obligatorio.').not().isEmpty(),
    check('comment', 'El comentario es obligatorio.').not().isEmpty(),
    check(
      'user_id',
      'El id de usuario tiene que ser un número entero mayor a 0.'
    ).isInt({ min: 0 }),
    check(
      'product_id',
      'El id del producto tiene que ser un número entero mayor a 0.'
    ).isInt({ min: 0 }),
    validateFields,
  ],
  createComment
);

export default router;
