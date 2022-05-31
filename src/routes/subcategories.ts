import { Router } from 'express';
import {
  createSubategory,
  deleteSubcategory,
  getSubcategories,
  getSubcategory,
  updateSubategory,
} from '../controllers';

const router = Router();

router.get('/', getSubcategories);
router.get('/:id', getSubcategory);
router.post('/', createSubategory);
router.put('/:id', updateSubategory);
router.delete('/:id', deleteSubcategory);

export default router;
