/**
 * Custom modules
 */

import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';
/**
 * Models
 */

import User from '@/models/user';
import Token from '@/models/token';

/**
 * Types
 */

import type { Request, Response, NextFunction } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body as UserData;
    const user = await User.findOne({ email })
      .select('username email password role firstName lastName')
      .lean()
      .exec();

    if (!user) {
      res.status(404).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    //Generate access token and refresh token for new users

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Store refresh Token in db

    await Token.create({ token: refreshToken, userId: user._id });
    logger.info('Refresh Token created for the user ', {
      userId: user._id,
      token: refreshToken,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken,
    });

    logger.info('User logged in successfully', {
      userId: user._id,
      email: user.email,
      username: user.username,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Login failed due to a server error. Please try again later.',
      error: err,
    });

    logger.error('Error during user login', err);
  }
};

export default login;
