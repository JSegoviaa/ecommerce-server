import { Router } from 'express';
import { check } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductBySlug,
  deactivateProduct,
} from '../controllers/';
import {
  commentsQueryValidator,
  productExist,
  productQueryValidator,
  slugExists,
  sortQueryValidator,
  userExist,
  variantColorExist,
  variantExist,
} from '../helpers';
import {
  hasRol,
  superAdminRol,
  validateFields,
  validateJWT,
} from '../middlewares';

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
  [
    check('id').custom(productExist),
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(commentsQueryValidator),
    validateFields,
  ],
  getProduct
);

router.get(
  '/find/:slug',
  [
    check('slug').custom((slug) => slugExists(slug, 'products')),
    check('sort').custom(sortQueryValidator),
    check('order_by').custom(commentsQueryValidator),
    validateFields,
  ],
  getProductBySlug
);

router.post(
  '/',
  [
    validateJWT,
    hasRol('Super Administrador', 'Administrador'),
    check('created_by').custom(userExist),
    check('updated_by').custom(userExist),
    check('variant_options.*.variant_size_id').custom(variantExist),
    check('variant_options.*.variant_color_id').custom(variantColorExist),
    check('updated_by').custom(userExist),
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
    check('variant_options.*.price', 'El precio es obligatorio.')
      .not()
      .isEmpty(),
    check(
      'variant_options.*.price',
      'El precio debe de ser un número mayor a 0.'
    ).isFloat({ min: 1 }),
    check('variant_options.*.variant_size_id', 'El tamaño es obligatorio.')
      .not()
      .isEmpty(),
    check(
      'variant_options.*.variant_size_id',
      'El id debe de ser un número entero.'
    ).isInt(),
    check('variant_options.*.variant_color_id', 'El color es obligatorio.')
      .not()
      .isEmpty(),
    check(
      'variant_options.*.variant_color_id',
      'El id debe de ser un número entero.'
    ).isInt(),
    validateFields,
  ],
  createProduct
);

router.put(
  '/:id',
  [check('id').custom(productExist), validateFields],
  updateProduct
);

router.put(
  '/deactivate-product/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(productExist),
    check('updated_by').custom(userExist),
    check(
      'updated_by',
      'El id del usuario que desactiva el producto tiene que ser un número entero.'
    ).isInt({ min: 1 }),
    check('updated_by', 'El usuario que desactiva el producto es obligatorio.')
      .not()
      .isEmpty(),
    check('is_active', 'El valor is_active es obligatorio.').not().isEmpty(),
    check(
      'is_active',
      'Tiene que ser un valor de verdadero o falso'
    ).isBoolean(),
    validateFields,
  ],
  deactivateProduct
);

router.delete(
  '/:id',
  [
    validateJWT,
    superAdminRol,
    check('id').custom(productExist),
    validateFields,
  ],
  deleteProduct
);

export default router;
