import { Router } from 'express';
import {
  createComment,
  getAllComments,
  getCommentsByProduct,
} from '../controllers';

const router = Router();

router.get('/', [], getAllComments);
router.get('/:id', [], getCommentsByProduct);
router.post('/', [], createComment);

export default router;
