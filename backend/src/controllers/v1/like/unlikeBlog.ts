/**
 * Custom modules
 */

import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import Like from '@/models/like';
import User from '@/models/user';

/**
 * Types
 */

import type { Request, Response } from 'express';

const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId; // Get userId from authenticated user

  try {
    const existingLike = await Like.findOne({ userId, blogId }).lean().exec();

    if (!existingLike) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Like not found',
      });
      return;
    }

    await Like.deleteOne({ _id: existingLike._id });
    const blog = await Blog.findById(blogId)
      .select('likesCount status author')
      .populate('author', '_id')
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    // Check if user can access this blog (prevent unliking draft blogs by other users)
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

    blog.likesCount--;
    await blog.save();

    logger.info('Blog unliked successfully', {
      userId,
      blogId: blog._id,
      likesCount: blog.likesCount,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error while unliking blog', err);
  }
};

export default unlikeBlog;
