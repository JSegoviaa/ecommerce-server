import { Router } from 'express';
import { check } from 'express-validator';
import { createHistory, deleteHistory, getHistoryByUser } from '../controllers';
import { validateFields, validateJWT, validateUser } from '../middlewares';
import { historyExist, productExist, userExist } from '../helpers';

const router = Router();

router.get(
  '/:id',
  [validateJWT, validateUser, check('id').custom(userExist), validateFields],
  getHistoryByUser
);

router.post(
  '/',
  [
    validateJWT,
    validateUser,
    check('user_id').custom(userExist),
    check('product_id').custom(productExist),
    check('user_id', 'El id de usuario es obligatorio').not().isEmpty(),
    check(
      'user_id',
      'El id de usuario debe ser un número entero mayor a 0'
    ).isInt({
      min: 1,
    }),
    check('product_id', 'El id del producto es obligatorio').not().isEmpty(),
    check(
      'product_id',
      'El id del producto debe de ser un número entero mayor a 0'
    ).isInt({ min: 1 }),
    validateFields,
  ],
  createHistory
);

router.delete(
  '/:id',
  [validateJWT, validateUser, check('id').custom(historyExist), validateFields],
  deleteHistory
);

export default router;
