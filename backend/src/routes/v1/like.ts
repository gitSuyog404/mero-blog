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
import checkLikeStatus from '@/controllers/v1/like/checkLikeStatus';

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  validationError,
  likeBlog,
);

router.delete(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  validationError,
  unlikeBlog,
);

router.get(
  '/blog/:blogId/status',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid blog Id'),
  validationError,
  checkLikeStatus,
);

export default router;
