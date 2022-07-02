import { Router } from 'express';
import { check } from 'express-validator';
import { getRateByProduct, rateProduct } from '../controllers';
import { productExist, userExist } from '../helpers';
import { validateFields, validateJWT, validateUser } from '../middlewares';

const router = Router();

router.get('/:id', [], getRateByProduct);

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
