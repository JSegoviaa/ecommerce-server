import { Router } from 'express';
import { check } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/';
import {
  productExist,
  productQueryValidator,
  sortQueryValidator,
} from '../helpers';
import { hasRol, validateFields, validateJWT } from '../middlewares';

const router = Router();

router.get(
  '/',
  [
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(productQueryValidator),
    validateFields,
  ],
  getProducts
);

router.get(
  '/:id',
  [check('id').custom(productExist), validateFields],
  getProduct
);

router.post(
  '/',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('title', 'El título es obligatorio.').not().isEmpty(),
    check('description', 'La descripción es obligatoria.').not().isEmpty(),
    check('discount', 'El descuento tiene que ser un número.').isFloat(),
    check(
      'discount',
      'El descuento no puede ser menor a 0 ni mayor a 100.'
    ).isFloat({ min: 0, max: 100 }),
    check('created_by', 'El id de usuario que lo crea es obligatorio.')
      .not()
      .isEmpty(),
    check('updated_by', 'El id de usuario que lo actualiza es obligatorio.')
      .not()
      .isEmpty(),
    check('image_id', 'El id de la imagen es obligatorio.').not().isEmpty(),
    check('variant_options', 'Se debe de agregar por lo menos una variante.')
      .not()
      .isEmpty(),
    check('variant_options', 'Tiene que ser en forma de arreglo.').isArray(),
    check('variant_options.*.price', 'El precio es obligatorio')
      .not()
      .isEmpty(),
    //TODO Validar los demás campos del arreglo.
    validateFields,
  ],
  createProduct
);

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);

export default router;
