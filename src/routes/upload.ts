import { Request, Router } from 'express';
import { check } from 'express-validator';
import { v2 } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import {
  deletePictureFromCategory,
  deletePictures,
  uploadPicture,
  uploadPictures,
} from '../controllers';
import {
  categoryExist,
  subcategoryExist,
  uploadTypeQueryValidator,
} from '../helpers';
import { validateFields } from '../middlewares';

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: async (req: Request, file) => {
    const { type } = req.query;
    const { id } = req.params;

    return {
      folder: `ecommerce/${type}/${id}`,
      public_id: `${type}_${id}`,
    };
  },
});

const upload = multer({ storage }).single('picture');
const uploads = multer({ storage }).array('pictures');

const router = Router();

router.post(
  '/categories/:id',
  [
    check('id').custom(categoryExist),
    check('type').custom(uploadTypeQueryValidator),
    upload,
    validateFields,
  ],
  uploadPicture
);

router.post(
  '/subcategories/:id',
  [
    check('id').custom(subcategoryExist),
    check('type').custom(uploadTypeQueryValidator),
    upload,
    validateFields,
  ],
  uploadPicture
);

router.post(
  '/products/:id',
  [check('type').custom(uploadTypeQueryValidator), uploads, validateFields],
  uploadPictures
);

router.delete(
  '/category/:id',
  [check('id').custom(categoryExist), validateFields],
  deletePictureFromCategory
);

router.delete('/delete-pictures/:id', [], deletePictures);

export default router;
