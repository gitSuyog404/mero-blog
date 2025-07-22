/**
 * Node modules
 */
import { v2 as cloudinary } from 'cloudinary';

/**
 * Custom modules
 */

import { logger } from '@/lib/winston';

/**
 * Models
 */

import User from '@/models/user';
import Blog from '@/models/blog';

/**
 * Types
 */

import type { Request, Response } from 'express';

const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId;
  try {
    const blogs = await Blog.find({ author: userId })
      .select('banner.publicId')
      .lean()
      .exec();

    const publicIds = blogs
      .map(({ banner }) => banner?.publicId)
      .filter((publicId) => publicId); // Filter out undefined/null values

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
      logger.info('Multiple blog banners deleted from Cloudinary', {
        publicIds,
      });
    } else {
      logger.info('No blog banners to delete from Cloudinary', {
        userId,
      });
    }

    await Blog.deleteMany({ author: userId });
    logger.info('Multiple blogs deleted', {
      userId,
      blogs,
    });

    await User.deleteOne({ _id: userId });
    logger.info('A user account has been deleted', {
      userId,
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error while deleting current user account', err);
  }
};

export default deleteUserById;
