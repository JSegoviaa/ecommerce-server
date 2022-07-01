import { Router } from 'express';
import { rateProduct } from '../controllers';

const router = Router();

router.post('/', rateProduct);

export default router;
