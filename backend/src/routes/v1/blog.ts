/**
 * Node modules
 */

import { Router } from 'express';
import { param, query, body } from 'express-validator';
import multer from 'multer';

/**
 * Middlewares
 */
import authenticate from '@/middlewares/authenticate';
import validationError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';

/**
 * Controllers
 */
import createBlog from '@/controllers/v1/blog/createBlog';
import getAllBlogs from '@/controllers/v1/blog/getAllBlogs';
import getBlogsByUser from '@/controllers/v1/blog/getBlogsByUser';
import getBlogBySlug from '@/controllers/v1/blog/getBlogBySlug';
import updateBlog from '@/controllers/v1/blog/updateBlog';
import deleteBlog from '@/controllers/v1/blog/deleteBlog';

/**
 * Models
 */

const upload = multer();
const router = Router();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('banner_image').notEmpty().withMessage('Banner image is required'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  uploadBlogBanner('post'),
  createBlog,
);

router.get(
  '/',
  authenticate,
  authorize(['admin', 'user']),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'),
  validationError,
  getAllBlogs,
);

router.get(
  '/user/:userId',
  authenticate,
  authorize(['admin', 'user']),
  param('userId').isMongoId().withMessage('Invalid user Id'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 to 50'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a positive integer'),
  validationError,
  getBlogsByUser,
);

router.get(
  '/:slug',
  authenticate,
  authorize(['admin', 'user']),
  param('slug').notEmpty().withMessage('Slug is required'),
  validationError,
  getBlogBySlug,
);

router.put(
  '/:blogId',
  authenticate,
  authorize(['admin']),
  param('blogId').isMongoId().withMessage('Invalid Blog Id'),
  upload.single('banner_image'),
  body('title')
    .optional()
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 characters'),
  body('content'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be one of the value, draft or published'),
  validationError,
  uploadBlogBanner('put'),
  updateBlog,
);

router.delete('/:blogId', authenticate, authorize(['admin']), deleteBlog);
export default router;
