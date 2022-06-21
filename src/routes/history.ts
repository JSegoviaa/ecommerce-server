import { Router } from 'express';
import { createHistory, deleteHistory, getHistoryByUser } from '../controllers';
import { validateFields, validateJWT, validateUser } from '../middlewares';

const router = Router();
//TODO
router.get(
  '/:id',
  [validateJWT, validateUser, validateFields],
  getHistoryByUser
);

router.post('/', [validateJWT, validateUser, validateFields], createHistory);

router.delete(
  '/:id',
  [validateJWT, validateUser, validateFields],
  deleteHistory
);

export default router;
