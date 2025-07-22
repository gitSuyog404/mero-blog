import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useLikeBlogMutation,
  useUnlikeBlogMutation,
} from "../../redux/slices/likeApiSlice";
import type { RootState } from "../../redux/store";

interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  status: "draft" | "published";
  banner: {
    url: string;
    publicId?: string;
  };
  author: {
    _id: string;
    username: string;
    email: string;
    role: "admin" | "user";
    firstName?: string;
    lastName?: string;
  };
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  publishedAt: string;
  updatedAt: string;
}

interface BlogCardProps {
  blog: Blog;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  variant = "default",
  className = "",
}) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const isAdmin = userInfo?.role === "admin";

  const [likeBlog] = useLikeBlogMutation();
  const [unlikeBlog] = useUnlikeBlogMutation();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(blog.likesCount);
  const [isLiking, setIsLiking] = useState(false);

  const getExcerpt = (htmlContent: string, maxLength: number = 150) => {
    const textContent = htmlContent.replace(/<[^>]*>/g, "");
    return textContent.length > maxLength
      ? textContent.substring(0, maxLength) + "..."
      : textContent;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const getDisplayName = (author: Blog["author"]) => {
    if (author.firstName && author.lastName) {
      return `${author.firstName} ${author.lastName}`;
    } else if (author.firstName) {
      return author.firstName;
    } else if (author.lastName) {
      return author.lastName;
    }
    return author.username;
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userInfo) return;

    setIsLiking(true);
    try {
      if (isLiked) {
        await unlikeBlog({
          blogId: blog._id,
        }).unwrap();
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        const response = await likeBlog({
          blogId: blog._id,
        }).unwrap();
        setIsLiked(true);
        setLikesCount(response.likesCount);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, "");
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (variant === "featured") {
    return (
      <motion.article
        className={`group cursor-pointer ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={`/blog/${blog.slug}`} className="block">
          <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-gray-200">
            <div className="relative h-64 overflow-hidden">
              <img
                src={blog.banner.url}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              {blog.status === "draft" && (
                <motion.div
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                    Draft
                  </span>
                </motion.div>
              )}

              {isAdmin && (
                <motion.div
                  className="absolute top-4 right-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit/${blog.slug}`);
                    }}
                    className="bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-white p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                    title="Edit story"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </motion.div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  {getDisplayName(blog.author).charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getDisplayName(blog.author)}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{blog.author.username} • {formatDate(blog.publishedAt)}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
                {blog.title}
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {getExcerpt(blog.content, 200)}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>{getReadingTime(blog.content)} min read</span>
                  <motion.button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center space-x-1 transition-colors duration-200 ${
                      isLiked
                        ? "text-red-500"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.svg
                      className="w-4 h-4"
                      fill={isLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{ fill: isLiked ? "currentColor" : "none" }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </motion.svg>
                    <span className="text-xs">{likesCount}</span>
                  </motion.button>
                </div>
                <motion.span
                  className="text-gray-900 group-hover:text-gray-700 font-medium"
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  Read more →
                </motion.span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        className={`group cursor-pointer ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={`/blog/${blog.slug}`} className="block">
          <div className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={blog.banner.url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-700">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {getExcerpt(blog.content, 100)}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{getDisplayName(blog.author)}</span>
                <span>•</span>
                <span>{formatDate(blog.publishedAt)}</span>
                <span>•</span>
                <span>{getReadingTime(blog.content)} min read</span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      className={`group cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/blog/${blog.slug}`} className="block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-gray-200">
          <div className="relative h-48 overflow-hidden">
            <img
              src={blog.banner.url}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {blog.status === "draft" && (
              <motion.div
                className="absolute top-3 left-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  Draft
                </span>
              </motion.div>
            )}

            {isAdmin && (
              <motion.div
                className="absolute top-3 right-3"
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${blog.slug}`);
                  }}
                  className="bg-gray-900 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                  title="Edit story"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                {getDisplayName(blog.author).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {getDisplayName(blog.author)}
                </p>
                <p className="text-xs text-gray-500">
                  @{blog.author.username} • {formatDate(blog.publishedAt)}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2">
              {blog.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {getExcerpt(blog.content)}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-3">
                <span>{getReadingTime(blog.content)} min read</span>
                <motion.button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center space-x-1 transition-colors duration-200 ${
                    isLiked
                      ? "text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.svg
                    className="w-4 h-4"
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ fill: isLiked ? "currentColor" : "none" }}
                    transition={{ duration: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </motion.svg>
                  <span className="text-xs">{likesCount}</span>
                </motion.button>
              </div>
              <motion.span
                className="text-gray-900 group-hover:text-gray-700 font-medium"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Read more →
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
