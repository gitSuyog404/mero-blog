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
import createComment from '@/controllers/v1/comment/createComment';
import getCommentsByBlog from '@/controllers/v1/comment/getCommentByBlog';
import deleteComment from '@/controllers/v1/comment/deleteComment';

/**
 * Controllers
 */

const router = Router();

router.post(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid Blog Id'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  validationError,
  createComment,
);

router.get(
  '/blog/:blogId',
  authenticate,
  authorize(['admin', 'user']),
  param('blogId').isMongoId().withMessage('Invalid Blog Id'),
  validationError,
  getCommentsByBlog,
);

router.delete(
  '/:commentId',
  authenticate,
  authorize(['admin', 'user']),
  param('commentId').isMongoId().withMessage('Invalid comment Id'),
  deleteComment,
);
export default router;
