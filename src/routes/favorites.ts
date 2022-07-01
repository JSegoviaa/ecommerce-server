import { Router } from 'express';
import {
  addFavorite,
  deleteFavorite,
  getFavoritesByUser,
} from '../controllers';

const router = Router();

router.get('/:id', [], getFavoritesByUser);
router.post('/', [], addFavorite);
router.delete('/:id', [], deleteFavorite);

export default router;
