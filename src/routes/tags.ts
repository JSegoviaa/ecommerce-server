import { Router } from 'express';
import { check } from 'express-validator';
import { createTag, getTags } from '../controllers';
import { tagExist } from '../helpers';
import { hasRol, validateFields, validateJWT } from '../middlewares';

const router = Router();

router.get(
  '/',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador', 'Moderador'),
    validateFields,
  ],
  getTags
);

router.post(
  '/',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador', 'Moderador'),
    check('name').custom(tagExist),
    check('name', 'El nombre de la etiqueta es obligatorio.').not().isEmpty(),
    validateFields,
  ],
  createTag
);

export default router;
