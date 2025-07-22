/**
 * Custom modules
 */

import { logger } from '@/lib/winston';

/**
 * Models
 */
import Like from '@/models/like';
import Blog from '@/models/blog';
import User from '@/models/user';

/**
 * Types
 */

import type { Request, Response } from 'express';

const checkLikeStatus = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId; // Get userId from authenticated user

  try {
    // Check if blog exists and user can access it
    const blog = await Blog.findById(blogId)
      .select('status author')
      .populate('author', '_id')
      .lean()
      .exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    // Check if user can access this blog (prevent checking like status on draft blogs by other users)
    const user = await User.findById(userId).select('role').lean().exec();
    if (
      user?.role === 'user' &&
      blog.status === 'draft' &&
      (blog.author as any)?._id?.toString() !== userId
    ) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const existingLike = await Like.findOne({ blogId, userId }).lean().exec();

    res.status(200).json({
      isLiked: !!existingLike,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error while checking like status', err);
  }
};

export default checkLikeStatus;
