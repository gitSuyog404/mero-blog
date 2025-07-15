/**
 * Node modules
 */

import { Router } from 'express';
import { body, param } from 'express-validator';

/**
 * Middlewares
 */

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import validationError from '@/middlewares/validationError';

/**
 * Controllers
 */
import likeBlog from '@/controllers/v1/like/likeBlog';
import unlikeBlog from '@/controllers/v1/like/unlikeBlog';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user Id'),
  validationError,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  body('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isMongoId()
    .withMessage('Invalid user Id'),
  validationError,
  unlikeBlog,
);

export default router;
