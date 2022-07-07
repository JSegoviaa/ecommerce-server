import { Router } from 'express';
import { check } from 'express-validator';
import { searchProduct } from '../controllers';
import { productsSearch, sortQueryValidator } from '../helpers';
import { validateFields } from '../middlewares';

const router = Router();

router.get(
  '/products',
  [
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(productsSearch),
    validateFields,
  ],
  searchProduct
);

export default router;
