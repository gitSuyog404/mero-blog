/**
 * Node modules
 */

import { Router } from 'express';
import { body, cookie } from 'express-validator';
import bcrypt from 'bcrypt';
/**
 * Controllers
 */
import register from '@/controllers/v1/auth/register';
import login from '@/controllers/v1/auth/login';
import refreshToken from '@/controllers/v1/auth/refresh_token';
import logout from '@/controllers/v1/auth/logout';
/**
 * Middlewares
 */
import validationError from '@/middlewares/validationError';
import authenticate from '@/middlewares/authenticate';

/**
 * Models
 */

import User from '@/models/user';

const router = Router();
router.post(
  '/register',
  body('firstName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('First name must be less than 20 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Last name must be less than 20 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error('User already exists');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('socialLinks.website')
    .optional()
    .isURL()
    .withMessage('Website must be a valid URL')
    .isLength({ max: 100 })
    .withMessage('Website URL must be less than 100 characters'),
  body('socialLinks.facebook')
    .optional()
    .isURL()
    .withMessage('Facebook URL must be a valid URL')
    .isLength({ max: 100 })
    .withMessage('Facebook URL must be less than 100 characters'),
  body('socialLinks.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram URL must be a valid URL')
    .isLength({ max: 100 })
    .withMessage('Instagram URL must be less than 100 characters'),
  body('socialLinks.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be a valid URL')
    .isLength({ max: 100 })
    .withMessage('LinkedIn URL must be less than 100 characters'),
  body('socialLinks.x')
    .optional()
    .isURL()
    .withMessage('X URL must be a valid URL')
    .isLength({ max: 100 })
    .withMessage('X URL must be less than 100 characters'),
  body('socialLinks.youtube')
    .optional()
    .isURL()
    .withMessage('YouTube URL must be a valid URL')
    .isLength({ max: 100 })
    .withMessage('YouTube URL must be less than 100 characters'),
  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user'),
  validationError,
  register,
);

router.post(
  '/login',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 50 })
    .withMessage('Email must be less than 50 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (!userExists) {
        throw new Error('User email or password is invalid');
      }
    }),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .custom(async (value, { req }) => {
      const { email } = req.body as { email: string };
      const user = await User.findOne({ email })
        .select('password')
        .lean()
        .exec();

      if (!user) {
        throw new Error('User email or password is invalid');
      }
      const passwordMatch = await bcrypt.compare(value, user.password);
      if (!passwordMatch) {
        throw new Error('User email or password is invalid');
      }
    }),
  validationError,
  login,
);

router.post(
  '/refresh-token',
  cookie('refreshToken')
    .notEmpty()
    .withMessage('Refresh token expired')
    .isJWT()
    .withMessage('Invalid refresh token'),
  validationError,
  refreshToken,
);

router.post('/logout', authenticate, logout);

export default router;
