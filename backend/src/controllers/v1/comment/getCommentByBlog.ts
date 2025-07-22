/**
 * Custom modules
 */

import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';
import Comment from '@/models/comment';
import User from '@/models/user';

/**
 * Types
 */

import type { Request, Response } from 'express';

const getCommentsByBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId)
      .select('_id status author')
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

    // Check if user can access this blog (prevent viewing comments on draft blogs by other users)
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

    const allComments = await Comment.find({ blogId })
      .populate('userId', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({
      comments: allComments,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error retrieving all comments', err);
  }
};

export default getCommentsByBlog;
