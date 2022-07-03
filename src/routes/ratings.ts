import { Router } from 'express';
import { check } from 'express-validator';
import {
  getAllAvgRatings,
  getAvgRateByProduct,
  getUsersRates,
  rateProduct,
} from '../controllers';
import {
  productExist,
  productsAvgQueryValidator,
  sortQueryValidator,
  userExist,
  usersRatingsQueryValidator,
} from '../helpers';
import {
  hasRol,
  validateFields,
  validateJWT,
  validateUser,
} from '../middlewares';

const router = Router();

router.get(
  '/:id',
  [check('id').custom(productExist), validateFields],
  getAvgRateByProduct
);

router.get(
  '/users-rate/:id',
  [
    validateJWT,
    validateUser,
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(usersRatingsQueryValidator),
    check('id').custom(userExist),
    validateFields,
  ],
  getUsersRates
);

router.get(
  '/all/products-rate',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(productsAvgQueryValidator),
    validateFields,
  ],
  getAllAvgRatings
);

router.post(
  '/',
  [
    validateJWT,
    validateUser,
    check('user_id').custom(userExist),
    check('product_id').custom(productExist),
    check(
      'rating',
      'La calificación tiene que ser un número entero entre 1 y 5.'
    ).isInt({
      min: 1,
      max: 5,
    }),
    validateFields,
  ],
  rateProduct
);

export default router;
