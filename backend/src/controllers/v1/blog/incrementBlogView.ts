/**
 * Custom modules
 */

import { logger } from '@/lib/winston';

/**
 * Models
 */
import Blog from '@/models/blog';

/**
 * Types
 */
import type { Request, Response } from 'express';

const incrementBlogView = async (req: Request, res: Response): Promise<void> => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findById(blogId).select('viewsCount').exec();
    
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    // Increment the view count
    blog.viewsCount++;
    await blog.save();

    logger.info('Blog view incremented successfully', {
      blogId: blog._id,
      viewsCount: blog.viewsCount,
    });

    res.status(200).json({
      viewsCount: blog.viewsCount,
    });
  } catch (err) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error: err,
    });
    logger.error('Error while incrementing blog view', err);
  }
};

export default incrementBlogView;
