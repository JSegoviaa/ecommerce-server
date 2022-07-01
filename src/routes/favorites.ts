import { Router } from 'express';
import { check } from 'express-validator';
import { validateFields, validateJWT, validateUser } from '../middlewares';
import {
  addFavorite,
  deleteFavorite,
  getFavoritesByUser,
} from '../controllers';
import {
  favoritesQueryValidator,
  sortQueryValidator,
  productExist,
  userExist,
  favoriteExist,
} from '../helpers';

const router = Router();

router.get(
  '/:id',
  [
    validateJWT,
    validateUser,
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(favoritesQueryValidator),
    check('id').custom(userExist),
    validateFields,
  ],
  getFavoritesByUser
);

router.post(
  '/',
  [
    validateJWT,
    validateUser,
    check('user_id').custom(userExist),
    check('product_id').custom(productExist),
    validateFields,
  ],
  addFavorite
);

router.delete(
  '/:id',
  [
    validateJWT,
    validateUser,
    check('id').custom(favoriteExist),
    validateFields,
  ],
  deleteFavorite
);

export default router;
